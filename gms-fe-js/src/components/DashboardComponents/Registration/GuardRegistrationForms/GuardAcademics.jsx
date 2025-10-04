'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';

const GuardAcademics = ({ onNext, onPrevious, initialData = {} }) => {
    const validationSchema = Yup.object({
        lastEducation: Yup.string().notRequired(),
        institute: Yup.string().notRequired(),
        hasDrivingLicense: Yup.string().notRequired(),

        drivingLicenseNo: Yup.string().when('hasDrivingLicense', {
            is: (value) => value === 'Yes',
            then: (schema) => schema.required('Driving License No. is required'),
            otherwise: (schema) => schema.notRequired(),
        }),

        drivingLicenseIssueDate: Yup.date().when('hasDrivingLicense', {
            is: (value) => value === 'Yes',
            then: (schema) => schema.required('Date of Issue is required'),
            otherwise: (schema) => schema.notRequired(),
        }),

        drivingLicenseExpiryDate: Yup.date().when('hasDrivingLicense', {
            is: (value) => value === 'Yes',
            then: (schema) => schema.required('Expiry Date is required'),
            otherwise: (schema) => schema.notRequired(),
        }),

        licenseIssueCity: Yup.string().when('hasDrivingLicense', {
            is: (value) => value === 'Yes',
            then: (schema) => schema.required('License Issue City is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    });


    const initialValues = {
        lastEducation: initialData.academic?.lastEducation || '',
        institute: initialData.academic?.institute || '',
        hasDrivingLicense: initialData.academic?.hasDrivingLicense ? 'Yes' : 'No',
        drivingLicenseNo: initialData.drivingLicense?.drivingLicenseNo || '',
        drivingLicenseIssueDate: initialData.drivingLicense?.drivingLicenseIssueDate || '',
        drivingLicenseExpiryDate: initialData.drivingLicense?.drivingLicenseExpiryDate || '',
        licenseIssueCity: initialData.drivingLicense?.licenseIssueCity || '',
        ...initialData
    };

    const handleSubmit = (values) => {
        // Structure data according to API format
        const formattedData = {
            academic: {
                lastEducation: values.lastEducation,
                institute: values.institute,
                hasDrivingLicense: values.hasDrivingLicense === 'Yes'
            },
            drivingLicense: values.hasDrivingLicense === 'Yes' ? {
                drivingLicenseNo: values.drivingLicenseNo,
                drivingLicenseIssueDate: values.drivingLicenseIssueDate,
                drivingLicenseExpiryDate: values.drivingLicenseExpiryDate,
                licenseIssueCity: values.licenseIssueCity
            } : {
                drivingLicenseNo: "",
                drivingLicenseIssueDate: "",
                drivingLicenseExpiryDate: "",
                licenseIssueCity: ""
            }
        };

        console.log('Academics & Licenses Information:', formattedData);
        if (onNext) {
            onNext(formattedData);
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

    const drivingLicenseOptions = [
        'Yes',
        'No'
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">Select</option>
                                        {educationLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </Field>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <ErrorMessage name="lastEducation" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Institute */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Institute
                                </label>
                                <Field
                                    type="text"
                                    name="institute"
                                    placeholder="Enter Institute Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="institute" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Has Driving License */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Has Driving License
                                </label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name="hasDrivingLicense"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">Select</option>
                                        {drivingLicenseOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Field>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <ErrorMessage name="hasDrivingLicense" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Driving License No. */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Driving License No.
                                </label>
                                <Field
                                    type="text"
                                    name="drivingLicenseNo"
                                    placeholder="Enter Driving License No."
                                    disabled={values.hasDrivingLicense !== 'Yes'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage name="drivingLicenseNo" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Driving License Issue Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Driving License Issue Date
                                </label>
                                <Field
                                    type="date"
                                    name="drivingLicenseIssueDate"
                                    disabled={values.hasDrivingLicense !== 'Yes'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage name="drivingLicenseIssueDate" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Driving License Expiry Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Driving License Expiry Date
                                </label>
                                <Field
                                    type="date"
                                    name="drivingLicenseExpiryDate"
                                    disabled={values.hasDrivingLicense !== 'Yes'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage name="drivingLicenseExpiryDate" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* License Issue City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    License Issue City
                                </label>
                                <Field
                                    type="text"
                                    name="licenseIssueCity"
                                    placeholder="Enter License Issue City"
                                    disabled={values.hasDrivingLicense !== 'Yes'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage name="licenseIssueCity" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center space-x-4 pt-8">
                            <button
                                type="button"
                                onClick={onPrevious}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Continue'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default GuardAcademics; 