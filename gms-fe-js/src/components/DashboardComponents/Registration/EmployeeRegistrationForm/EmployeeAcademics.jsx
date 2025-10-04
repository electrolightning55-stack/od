'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';

const EmployeeAcademics = ({ onNext, onPrevious, initialData = {} }) => {
    const validationSchema = Yup.object({
        lastEducation: Yup.string(),
        institute: Yup.string(),
        hasDrivingLicense: Yup.boolean(),
        drivingLicenseNo: Yup.string().when('hasDrivingLicense', {
            is: true,
            then: (schema) => schema,
            otherwise: (schema) => schema.notRequired()
        }),
        drivingLicenseIssueDate: Yup.date().when('hasDrivingLicense', {
            is: true,
            then: (schema) => schema,
            otherwise: (schema) => schema.notRequired()
        }),
        drivingLicenseExpiryDate: Yup.date().when('hasDrivingLicense', {
            is: true,
            then: (schema) => schema,
            otherwise: (schema) => schema.notRequired()
        }),
        licenseIssueCity: Yup.string().when('hasDrivingLicense', {
            is: true,
            then: (schema) => schema,
            otherwise: (schema) => schema.notRequired()
        })
    });

    const initialValues = {
        lastEducation: initialData.lastEducation || '',
        institute: initialData.institute || '',
        hasDrivingLicense: initialData.hasDrivingLicense || false,
        drivingLicenseNo: initialData.drivingLicenseNo || '',
        drivingLicenseIssueDate: initialData.drivingLicenseIssueDate || '',
        drivingLicenseExpiryDate: initialData.drivingLicenseExpiryDate || '',
        licenseIssueCity: initialData.licenseIssueCity || ''
    };

    const handleSubmit = (values) => {
        console.log('Employee Academics & Licenses Information:', values);
        if (onNext) {
            onNext(values);
        }
    };

    const educationLevels = [
        'Primary',
        'Middle',
        'Matriculation',
        'Intermediate',
        'Bachelor',
        'Master',
        'PhD',
        'Diploma',
        'Certificate',
        'Other'
    ];

    const pakistaniCities = [
        'Karachi',
        'Lahore',
        'Islamabad',
        'Rawalpindi',
        'Faisalabad',
        'Multan',
        'Peshawar',
        'Quetta',
        'Sialkot',
        'Gujranwala',
        'Hyderabad',
        'Sargodha',
        'Bahawalpur',
        'Sukkur',
        'Larkana',
        'Other'
    ];

    return (
        <div className="flex-1 bg-white p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Academics & Licenses</h2>
                    <div className="text-sm text-gray-500">Step 3 of 8</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '37.5%' }}></div>
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Last Education */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Education 
                                </label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name="lastEducation"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        <option value="">Select Education Level</option>
                                        {educationLevels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </Field>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <ErrorMessage name="lastEducation" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Institute */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Institute/Institution 
                                </label>
                                <Field
                                    type="text"
                                    name="institute"
                                    placeholder="Enter institute/institution name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="institute" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Has Driving License */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Do you have a Driving License? 
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <Field
                                            type="radio"
                                            name="hasDrivingLicense"
                                            value={true}
                                            onChange={() => setFieldValue('hasDrivingLicense', true)}
                                            className="mr-2"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center">
                                        <Field
                                            type="radio"
                                            name="hasDrivingLicense"
                                            value={false}
                                            onChange={() => setFieldValue('hasDrivingLicense', false)}
                                            className="mr-2"
                                        />
                                        No
                                    </label>
                                </div>
                                <ErrorMessage name="hasDrivingLicense" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Driving License Details - Only show if hasDrivingLicense is true */}
                            {values.hasDrivingLicense && (
                                <>
                                    {/* Driving License Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Driving License No. 
                                        </label>
                                        <Field
                                            type="text"
                                            name="drivingLicenseNo"
                                            placeholder="Enter driving license number"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage name="drivingLicenseNo" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* License Issue City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            License Issue City 
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="licenseIssueCity"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                            >
                                                <option value="">Select City</option>
                                                {pakistaniCities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <ErrorMessage name="licenseIssueCity" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Issue Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Issue Date 
                                        </label>
                                        <Field
                                            type="date"
                                            name="drivingLicenseIssueDate"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage name="drivingLicenseIssueDate" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    {/* Expiry Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date 
                                        </label>
                                        <Field
                                            type="date"
                                            name="drivingLicenseExpiryDate"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage name="drivingLicenseExpiryDate" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-center space-x-4 pt-8">
                            <button
                                type="button"
                                onClick={onPrevious}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Previous
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : 'Continue'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EmployeeAcademics; 