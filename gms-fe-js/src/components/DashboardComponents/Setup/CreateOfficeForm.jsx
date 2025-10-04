'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { PAKISTAN_CITIES } from '@/constants/PakistanCities';
import Autosuggest from 'react-autosuggest';

const CreateOfficeForm = () => {

    const validationSchema = Yup.object({
        branchName: Yup.string().required("Branch name is required"),
        province: Yup.string().required('Province is required'),
        city: Yup.string().required('City is required'),
        contactNo: Yup.string()
            .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
            .required('Contact number is required'),
        contactNumberOpt: Yup.string()
            .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        addressLine1: Yup.string().required('Address Line 1 is required'),
        addressLine2: Yup.string()
    });

    const initialValues = {
        branchName: '',
        province: '',
        city: '',
        contactNo: '',
        contactNumberOpt: '',
        email: '',
        addressLine1: '',
        addressLine2: ''
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // Format payload to match backend DTO
            const addOfficePayload = {
                branchName: values.branchName,
                email: values.email,
                province: values.province,
                city: values.city,
                address: values.addressLine2 
                    ? `${values.addressLine1}, ${values.addressLine2}`
                    : values.addressLine1,
                contactNumber: values.contactNo
            }

            const res = await userRequest.post("/organizations/add-office", addOfficePayload);

            console.log(res.data);

            toast.success("Office Created Successfully")
            setTimeout(() => {
                setSubmitting(false);
                resetForm();
            }, 1000);
        } catch (error) {
            console.log(error);
            const errMessage = error?.response?.data?.message;
            toast.error(errMessage)
        }





    };

    const provinces = [
        'Balochistan',
        'Khyber Pakhtunkhwa',
        'Punjab',
        'Sindh',
        'Azad Jammu and Kashmir',
        'Capital Territory',
        'Gilgit-Baltistan'
    ];

    // Helper for city suggestions
    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        if (!inputValue) return [];
        return PAKISTAN_CITIES.filter(city =>
            city.toLowerCase().includes(inputValue)
        ).slice(0, 5);
    };

    const getSuggestionValue = suggestion => suggestion;
    const renderSuggestion = suggestion => <div>{suggestion}</div>;

    return (
        <div className="min-h-screen bg-formBGBlue flex flex-col w-full px-4 pt-4">
            {/* Breadcrumb */}
            <div className="w-full max-w-5xl ">
                <aside className="bg-white border-b rounded-xl border-gray-200">
                    <div className="px-6 py-4">
                        <article className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span className="text-gray-900 font-medium">Create office</span>
                        </article>
                    </div>
                </aside>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-md mt-8 p-8">
                {/* Header */}
                <div className="flex items-center justify-between border-gray-200">
                    <h1 className="text-xl font-semibold ">Create Office</h1>

                </div>
                {/* Form */}
                <div className="pt-8">

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Select Province */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Province *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="province"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                            >
                                                <option value="">Select</option>
                                                {provinces.map((province) => (
                                                    <option key={province} value={province}>
                                                        {province}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <ErrorMessage name="province" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Enter City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Enter City *
                                        </label>
                                        <Autosuggest
                                            suggestions={getSuggestions(values.city)}
                                            onSuggestionsFetchRequested={({ value }) => {
                                                /* handled by getSuggestions inline */
                                            }}
                                            onSuggestionsClearRequested={() => {
                                                /* no-op, handled by getSuggestions */
                                            }}
                                            getSuggestionValue={getSuggestionValue}
                                            renderSuggestion={renderSuggestion}
                                            inputProps={{
                                                name: 'city',
                                                value: values.city,
                                                onChange: (e, { newValue }) => setFieldValue('city', newValue),
                                                className: 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                                                placeholder: 'Enter city',
                                            }}
                                            theme={{
                                                container: '',
                                                input: '',
                                                suggestionsContainer: 'absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full',
                                                suggestion: 'px-4 py-2 cursor-pointer',
                                                suggestionHighlighted: 'bg-blue-100',
                                            }}
                                        />
                                        <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* {Enter Branch Name} */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Branch Name
                                        </label>
                                        <Field
                                            type="text"
                                            name="branchName"
                                            placeholder="Enter Branch Name."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <ErrorMessage name="branchName" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Contact No */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact No. *
                                        </label>
                                        <Field
                                            type="text"
                                            name="contactNo"
                                            placeholder="Enter Contact No."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <ErrorMessage name="contactNo" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* {Optional Contact No. } */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Optional Contact No.
                                        </label>
                                        <Field
                                            type="text"
                                            name="contactNumberOpt"
                                            placeholder="Enter Contact No."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <ErrorMessage name="contactNumberOpt" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Email ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email ID *
                                        </label>
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Enter Email ID"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Address Line 1 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Line 1 *
                                    </label>
                                    <Field
                                        type="text"
                                        name="addressLine1"
                                        placeholder=""
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <ErrorMessage name="addressLine1" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Address Line 2 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Line 2(Optional)
                                    </label>
                                    <Field
                                        type="text"
                                        name="addressLine2"
                                        placeholder=""
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <ErrorMessage name="addressLine2" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-center space-x-4 pt-8">
                                    <button
                                        type="button"
                                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CreateOfficeForm; 