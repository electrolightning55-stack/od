'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Upload, Check, X } from 'lucide-react';
import { countries } from '@/constants/countries';
import { PAKISTAN_CITIES } from '@/constants/PakistanCities';
import { userRequest } from '@/lib/RequestMethods';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClientCompanyInformation = ({ onNext, onSave, initialData = {}, currentStepIndex = 0, totalSteps = 2 }) => {
    const [contractKey, setContractKey] = useState(initialData.contractFile || '');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const validationSchema = Yup.object({
        contractNumber: Yup.string()
            .matches(/^\d{1,15}$/, 'Contract number must be between 1 and 15 digits')
            .test('positive', 'Contract number must be positive', (val) => !val || parseInt(val) > 0),
        companyName: Yup.string()
            .required('Company Name is required')
            .min(2, 'Company name must be at least 2 characters'),
        websiteLink: Yup.string()
            .url('Invalid URL format')
            .nullable(),
        city: Yup.string()
            .required('City is required'),
        country: Yup.string()
            .required('Country is required'),
        contactNumber: Yup.string()
            .required('Contact Number is required')
            .matches(/^[0-9]{11}$/, 'Contact number must be exactly 11 digits'),
        recruitmentDate: Yup.string()
            .required('Contract Date is required'),
        industry: Yup.string()
            .required('Industry is required'),
        address: Yup.string()
            .required('Address is required'),
        state: Yup.string()
            .required('State/Province is required'),
        officialEmail: Yup.string()
            .email('Invalid email format')
            .required('Official Email is required'),
        currentAddress: Yup.string()
            .required('Current Address is required'),
        contractFile: Yup.string()
            .nullable()
    });    const initialValues = {
        contractNumber: initialData.contractNumber || '',
        companyName: initialData.companyName || '',
        websiteLink: initialData.websiteLink || '',
        city: initialData.city || '',
        country: initialData.country || '',
        contactNumber: initialData.contactNumber || '',
        recruitmentDate: initialData.recruitmentDate || '',
        industry: initialData.industry || '',
        address: initialData.address || '',
        state: initialData.state || '',
        officialEmail: initialData.officialEmail || '',
        currentAddress: initialData.currentAddress || '',
        contractFile: contractKey || ''
    };

    // S3 contract upload logic with persistence
    const handleContractUpload = async (event, setFieldValue, values) => {
        const file = event.target.files[0];
        setUploadError('');
        setUploadSuccess(false);

        if (!file) return;

        setUploading(true);

        try {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setUploadError('Only PDF or Word documents are allowed');
                setUploading(false);
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setUploadError('File size must be less than 10MB');
                setUploading(false);
                return;
            }

            // Step 1: Get upload URL and key
            const res = await userRequest.post('/file/presigned-url', {
                fileName: file.name,
                fileType: file.type
            });
            
            if (!res.data || !res.data.data || !res.data.data.uploadUrl) {
                throw new Error('Failed to get upload URL from server');
            }
            
            const { key, uploadUrl } = res.data.data;

            // Step 2: Upload to S3
            const uploadResponse = await axios.put(uploadUrl, file, { 
                headers: { 'Content-Type': file.type },
                maxContentLength: 10 * 1024 * 1024, // 10MB max
                timeout: 30000 // 30 second timeout
            });

            if (uploadResponse.status !== 200) {
                throw new Error('Failed to upload file to S3');
            }

            // Update local state
            setContractKey(key);
            setFieldValue('contractFile', key);
            setUploadSuccess(true);
            setUploading(false);

            // Auto-save all form data including the new contract key
            const updatedFormData = {
                ...values,
                contractFile: key
            };

            // Convert date to ISO for saving
            let isoRecruitmentDate = '';
            if (updatedFormData.recruitmentDate) {
                const date = new Date(updatedFormData.recruitmentDate);
                if (!isNaN(date.getTime())) isoRecruitmentDate = date.toISOString();
            }

            const dataToSave = {
                ...updatedFormData,
                recruitmentDate: isoRecruitmentDate
            };

            // Persist to parent component without navigation
            if (onSave) {
                onSave(dataToSave);
            }

        } catch (err) {
            console.error('Contract upload error:', err);
            setUploadError('File upload failed. Please try again.');
            setUploading(false);
        }
    };

    const removeContract = (setFieldValue, values) => {
        setContractKey('');
        setFieldValue('contractFile', '');
        setUploadSuccess(false);
        setUploadError('');

        // Auto-save form data without contract
        const updatedFormData = {
            ...values,
            contractFile: ''
        };

        if (onSave) {
            onSave(updatedFormData);
        }
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            // Convert date to ISO
            let isoRecruitmentDate = '';
            if (values.recruitmentDate) {
                const date = new Date(values.recruitmentDate);
                if (!isNaN(date.getTime())) {
                    isoRecruitmentDate = date.toISOString();
                } else {
                    throw new Error('Invalid recruitment date');
                }
            }

            // Validate contact number format
            if (!/^\d{11}$/.test(values.contactNumber)) {
                setErrors({ contactNumber: 'Contact number must be exactly 11 digits' });
                return;
            }

            // Validate contract number
            if (values.contractNumber) {
                const contractNum = parseInt(values.contractNumber);
                if (isNaN(contractNum) || contractNum <= 0) {
                    setErrors({ contractNumber: 'Contract number must be a positive number' });
                    return;
                }
            }

            const payload = {
                contractNumber: values.contractNumber,
                contractFile: values.contractFile,
                recruitmentDate: isoRecruitmentDate,
                companyName: values.companyName,
                industry: values.industry,
                websiteLink: values.websiteLink,
                address: values.address,
                city: values.city,
                state: values.state,
                country: values.country,
                currentAddress: values.currentAddress,
                contactNumber: values.contactNumber,
                officialEmail: values.officialEmail
            };

            if (onNext) {
                await onNext(payload);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Handle specific error cases
            if (error.response?.data?.message) {
                // Handle server validation errors
                if (error.response.data.message.includes('officialEmail')) {
                    setErrors({ officialEmail: 'This email is already registered' });
                } else if (error.response.data.message.includes('contractNumber')) {
                    setErrors({ contractNumber: 'Invalid contract number' });
                } else {
                    toast.error(`Error: ${error.response.data.message}`);
                }
            } else {
                // Handle other types of errors
                toast.error('An error occurred while submitting the form. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
        <aside className="flex-1 bg-white p-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                    <article className="text-sm text-gray-500">Step {currentStepIndex + 1} of {totalSteps}</article>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <article
                        className="bg-[#5570f1] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></article>
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contract Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Number
                                </label>
                                <Field
                                    type="text"
                                    name="contractNumber"
                                    placeholder="Enter Contract Number (Optional)"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                    onChange={(e) => {
                                        // Only allow digits
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        e.target.value = value;
                                        e.target.dispatchEvent(new Event('input', { bubbles: true }));
                                    }}
                                />
                                <ErrorMessage name="contractNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Recruitment Date */}
                            <div>
                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recruitment Date
                                </label> */}
                                {/* Renamed the recruitment date to contract date */}

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Date
                                </label>
                                <Field
                                    type="date"
                                    name="recruitmentDate"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="recruitmentDate" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <Field
                                    type="text"
                                    name="companyName"
                                    placeholder="Enter Company Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="companyName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Industry
                                </label>
                                <Field
                                    type="text"
                                    name="industry"
                                    placeholder="Enter Industry"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="industry" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Website Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website Link
                                </label>
                                <Field
                                    type="url"
                                    name="websiteLink"
                                    placeholder="Enter Website Link"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="websiteLink" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <Field
                                    type="text"
                                    name="address"
                                    placeholder="Enter Address"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <Field
                                    as="select"
                                    name="city"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                >
                                    <option value="">Select a city</option>
                                    {PAKISTAN_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* State/Province */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State/Province
                                </label>
                                <Field
                                    as="select"
                                    name="state"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                >
                                    <option value="">Select</option>
                                    <option value="Sindh">Sindh</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                                    <option value="Balochistan">Balochistan</option>
                                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                                    <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                                </Field>
                                <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <Field
                                    as="select"
                                    name="country"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                >
                                    <option value="">Select a country</option>
                                    {countries.map(country => (
                                        <option key={country.name} value={country.name}>{country.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Official Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Official Email
                                </label>
                                <Field
                                    type="email"
                                    name="officialEmail"
                                    placeholder="Enter Official Email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="officialEmail" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Number
                                </label>
                                <Field
                                    type="tel"
                                    name="contactNumber"
                                    maxLength={11}
                                    minLength={11}
                                    pattern="[0-9]{11}"
                                    placeholder="eg: 03321234567"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Current Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Address
                                </label>
                                <Field
                                    type="text"
                                    name="currentAddress"
                                    placeholder="Enter Current Address"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="currentAddress" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Upload Contract */}
                        <div className="mt-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contract Document
                            </label>

                            <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={contractKey ? `Contract uploaded (${contractKey.split('/').pop()})` : ''}
                                        placeholder="No contract uploaded"
                                        readOnly
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1] text-gray-700"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleContractUpload(e, setFieldValue, values)}
                                            className="hidden"
                                            id="contractFile"
                                        />
                                        <label
                                            htmlFor="contractFile"
                                            className={`flex items-center justify-center w-12 h-12 rounded-md cursor-pointer transition-colors border ${contractKey && uploadSuccess
                                                ? 'bg-green-100 hover:bg-green-200 border-green-200'
                                                : uploading
                                                    ? 'bg-blue-100 border-blue-200 cursor-not-allowed'
                                                    : 'bg-blue-100 hover:bg-blue-200 border-blue-200'
                                                }`}
                                            title={contractKey ? "Replace contract" : "Upload contract"}
                                        >
                                            {uploading ? (
                                                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                            ) : contractKey && uploadSuccess ? (
                                                <Upload className="h-5 w-5 text-blue-600" />
                                            ) : (
                                                <Upload className="h-5 w-5 text-blue-600" />
                                            )}
                                        </label>
                                    </div>

                                    {contractKey && (
                                        <button
                                            type="button"
                                            onClick={() => removeContract(setFieldValue, values)}
                                            className="flex items-center justify-center w-12 h-12 bg-red-100 hover:bg-red-200 rounded-md transition-colors border border-red-200"
                                            title="Remove contract"
                                        >
                                            <X className="h-5 w-5 text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {uploadError && (
                                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                            )}

                            {uploadSuccess && contractKey && (
                                <p className="text-sm text-green-600 mt-2">
                                    ✓ Contract uploaded successfully
                                </p>
                            )}

                            <ErrorMessage name="contractFile" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Contract Upload Guidelines
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Upload contract documents in PDF or Word format</li>
                                            <li>Maximum file size: 10MB</li>
                                            <li>File will be automatically saved once uploaded</li>
                                            <li>You can replace the contract by uploading a new file</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 mt-8">
                            <button
                                type="button"
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || uploading}
                                className="px-8 py-3 bg-[#5570f1] text-white rounded-lg hover:bg-[#4560e1] transition-colors disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </aside>
    );
};

export default ClientCompanyInformation;