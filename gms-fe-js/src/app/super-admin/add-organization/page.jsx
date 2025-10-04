'use client'

import React, { useState, useRef } from 'react';
import { userRequest } from '@/lib/RequestMethods';
import SuperAdminSidebar from '@/components/DashboardComponents/Sidebar/SuperAdminSidebar';
import OrganizationFeatureSelector from '@/components/OrganizationFeatureSelector';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { getPresignedUrl, uploadFileToS3 } from '@/services/FileService';

const validationSchema = yup.object().shape({
    organizationName: yup.string()
        .required('Organization name is required')
        .min(2, 'Organization name must be at least 2 characters'),
    email: yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    userName: yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    phoneNumber1: yup.string()
        .required('Phone number is required')
        .matches(/^\+92[0-9]{10}$/, {
            message: 'Phone number must be in format: +92XXXXXXXXXX',
            excludeEmptyString: true
        }),
    phoneNumber2: yup.string()
        .nullable()
        .matches(/^\+92[0-9]{10}$/, {
            message: 'Phone number must be in format: +92XXXXXXXXXX',
            excludeEmptyString: true
        })
        .transform((value) => (value === '' ? null : value)),
    province: yup.string()
        .required('Province is required'),
    city: yup.string()
        .required('City is required'),
    addressLine1: yup.string()
        .required('Address Line 1 is required'),
    addressLine2: yup.string()
        .nullable()
        .transform((value) => (value === '' ? null : value)),
    logoFile: yup.mixed()
        .nullable()
        .test('fileSize', 'File must be less than 5MB', (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
        })
        .test('fileType', 'File must be an image (jpg, jpeg, png, or webp)', (value) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type);
        }),
    features: yup.array()
        .of(yup.string().required('Feature name is required'))
        .required('At least one feature must be selected')
        .min(1, 'Select at least one feature'),
});

// Define provinces and cities data
const provinces = [
    'Punjab',
    'Sindh',
    'KPK',
    'Balochistan',
    'Gilgit-Baltistan',
    'AJK',
    'Islamabad'
];

const cities = {
    Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'],
    Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
    KPK: ['Peshawar', 'Abbottabad', 'Mardan', 'Kohat'],
    Balochistan: ['Quetta', 'Gwadar', 'Turbat'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza'],
    AJK: ['Muzaffarabad', 'Mirpur', 'Kotli'],
    Islamabad: ['Islamabad']
};

const AddOrganizationPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        organizationName: '',
        logoFile: null,
        userName: '',
        email: '',
        password: '',
        phoneNumber1: '+92',
        phoneNumber2: '',
        province: '',
        city: '',
        addressLine1: '',
        addressLine2: '',
        features: [] // Array for selected features
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };
            
            // Reset city when province changes
            if (name === 'province') {
                newData.city = '';
            }
            
            return newData;
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({}); // Clear previous errors

        try {
            // Validate form data and show all errors at once
            const validatedData = await validationSchema.validate(formData, { 
                abortEarly: false,
                stripUnknown: true 
            });
            
            // Prepare organization data first to validate structure
            const organizationData = {
                organizationName: validatedData.organizationName?.trim(),
                userName: validatedData.userName?.trim(),
                email: validatedData.email?.trim().toLowerCase(),
                password: validatedData.password,
                phoneNumber1: validatedData.phoneNumber1?.trim(),
                phoneNumber2: validatedData.phoneNumber2?.trim() || null,
                province: validatedData.province?.trim(),
                city: validatedData.city?.trim(),
                addressLine1: validatedData.addressLine1?.trim(),
                addressLine2: validatedData.addressLine2?.trim() || null,
                organizationLogo: null
            };

            // Log data for debugging
            console.log('Form Data:', {
                ...organizationData,
                password: '***hidden***'
            });
            
            // Handle logo upload if file is selected
            if (formData.logoFile) {
                try {
                    console.log('Uploading logo file:', {
                        name: formData.logoFile.name,
                        type: formData.logoFile.type,
                        size: formData.logoFile.size
                    });

                    const { uploadUrl, key } = await getPresignedUrl(
                        formData.logoFile.name,
                        formData.logoFile.type
                    );
                    
                    const uploadSuccess = await uploadFileToS3(formData.logoFile, uploadUrl);
                    if (!uploadSuccess) {
                        throw new Error('Failed to upload logo');
                    }
                    
                    organizationData.organizationLogo = key;
                    console.log('Logo uploaded successfully, key:', key);
                } catch (error) {
                    console.error('Logo upload error:', error);
                    toast.error('Failed to upload logo: ' + error.message);
                    setIsLoading(false);
                    return;
                }
            }
            
            // Clean up features array - remove any empty/invalid values
            organizationData.features = (formData.features || [])
                .filter(feature => typeof feature === 'string' && feature.trim().length > 0);

            if (organizationData.features.length === 0) {
                toast.error('Please select at least one feature');
                setIsLoading(false);
                return;
            }

            // Make API call to create organization
            console.log('Sending data to API:', {
                ...organizationData,
                password: '***hidden***'
            });
            
            const response = await userRequest.post('/organizations/register', organizationData);
            
            console.log('API Response:', response.data);
            
            if (response.data) {
                toast.success('Organization created successfully');
                router.push('/super-admin/organizations');
            } else {
                throw new Error('No response data received from server');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            if (error?.name === 'ValidationError') {
                // Handle Yup validation errors
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
                
                // Log validation errors for debugging
                console.log('Validation errors:', validationErrors);
                
                const errorMessages = error.inner.map(err => err.message);
                toast.error(`Please check the form: ${errorMessages[0]}`);
            } else if (error?.response?.status === 409) {
                // Handle conflict errors (email/username already exists)
                toast.error(error.response.data.message || 'Email or username already exists');
                setErrors({
                    email: error.response.data.message?.includes('Email') ? error.response.data.message : '',
                    userName: error.response.data.message?.includes('Username') ? error.response.data.message : ''
                });
            } else if (error?.response?.data?.message) {
                // Handle other API errors with messages
                toast.error(`Error: ${error.response.data.message}`);
            } else {
                // Handle other errors
                toast.error(error.message || 'Failed to create organization');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <SuperAdminSidebar />
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Organization</h1>
                    
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
                <div className="p-6 space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Organization ID */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Organization ID</span>
                                <input
                                    type="text"
                                    value={formData.organizationId}
                                    disabled
                                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500"
                                />
                            </label>

                            {/* Organization Name */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Organization Name *</span>
                                <input
                                    type="text"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.organizationName ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter Organization Name"
                                />
                                {errors.organizationName && <p className="mt-1 text-sm text-red-500">{errors.organizationName}</p>}
                            </label>
                        </div>

                        {/* Features Selection */}
                        <div className="mb-6">
                            <OrganizationFeatureSelector
                                selectedFeatures={formData.features}
                                onChange={(features) => setFormData(prev => ({ ...prev, features }))}
                            />
                        </div>

                        {/* Organization Logo */}
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Organization Logo</span>
                                <div className="mt-1 flex items-center space-x-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    logoFile: file
                                                }));
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                    />
                                    {formData.logoFile && (
                                        <span className="text-sm text-gray-500">
                                            {formData.logoFile.name}
                                        </span>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Email *</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.email ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter email"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Username *</span>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.userName ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter username"
                                />
                                {errors.userName && <p className="mt-1 text-sm text-red-500">{errors.userName}</p>}
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Password *</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.password ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter password"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Phone Number 1 *</span>
                                <input
                                    type="text"
                                    name="phoneNumber1"
                                    value={formData.phoneNumber1}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.phoneNumber1 ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter primary phone number"
                                />
                                {errors.phoneNumber1 && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber1}</p>}
                            </label>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Location</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Province *</span>
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.province ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                                {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">City *</span>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled={!formData.province}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.city ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select City</option>
                                    {formData.province && cities[formData.province]?.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                            </label>
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Address Line 1 *</span>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 bg-blue-50/10 border rounded-md text-sm ${
                                        errors.addressLine1 ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter address"
                                />
                                {errors.addressLine1 && <p className="mt-1 text-sm text-red-500">{errors.addressLine1}</p>}
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</span>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 bg-blue-50/10 border border-gray-200 rounded-md text-sm"
                                    placeholder="Enter additional address details"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4 rounded-b-lg">
                    <button
                        type="button"
                        onClick={() => router.push('/super-admin/organizations')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Save'}
                    </button>
                </div>
            </form>
                </div>
            </div>
        </div>
    );
};

export default AddOrganizationPage;