'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ClientPrimaryContact = ({ onNext, onPrevious, initialData = {}, currentStepIndex = 1, totalSteps = 2 }) => {
    const validationSchema = Yup.object({
        POCName: Yup.string()
            .required('POC Name is required')
            .min(2, 'POC Name must be at least 2 characters'),
        POCEmail: Yup.string()
            .email('Invalid email')
            .required('POC Email is required'),
        POCDesignation: Yup.string()
            .required('POC Designation is required'),
        POCContact: Yup.string()
            .required('POC Contact is required')
            .matches(/^[0-9]{11}$/, 'POC contact number must be exactly 11 digits'),
        AlternateContactPerson: Yup.string()
            .min(2, 'Alternate contact person name must be at least 2 characters'),
        AlternateContactNumber: Yup.string()
            .matches(/^[0-9]{11}$/, 'Alternate contact number must be exactly 11 digits')
            .required("Alternate contact number is required")
    });

    const initialValues = {
        POCName: initialData.POCName || '',
        POCEmail: initialData.POCEmail || '',
        POCDesignation: initialData.POCDesignation || '',
        POCContact: initialData.POCContact || '',
        AlternateContactPerson: initialData.AlternateContactPerson || '',
        AlternateContactNumber: initialData.AlternateContactNumber || '',
        ...initialData
    };

    const handleSubmit = (values) => {
        // Prepare payload for API
        const payload = {
            POCName: values.POCName,
            POCEmail: values.POCEmail,
            POCDesignation: values.POCDesignation,
            POCContact: values.POCContact,
            AlternateContactPerson: values.AlternateContactPerson,
            AlternateContactNumber: values.AlternateContactNumber
        };
        if (onNext) {
            onNext(payload);
        }
    };

    const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
        <div className="flex-1 bg-white p-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Primary Contact</h2>
                    <div className="text-sm text-gray-500">Step {currentStepIndex + 1} of {totalSteps}</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-[#5570f1] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* POC Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    POC Name
                                </label>
                                <Field
                                    type="text"
                                    name="POCName"
                                    placeholder="Enter POC Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="POCName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            {/* POC Designation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    POC Designation
                                </label>
                                <Field
                                    type="text"
                                    name="POCDesignation"
                                    placeholder="Enter POC Designation"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="POCDesignation" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            {/* POC Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    POC Email
                                </label>
                                <Field
                                    type="email"
                                    name="POCEmail"
                                    placeholder="Enter POC Email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="POCEmail" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            {/* POC Contact */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    POC Contact
                                </label>
                                <Field
                                    type="tel"
                                    name="POCContact"
                                    placeholder="Enter POC Contact"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="POCContact" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            {/* Alternate Contact Person */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alternate Contact Person
                                </label>
                                <Field
                                    type="text"
                                    name="AlternateContactPerson"
                                    placeholder="Enter Alternate Contact Person"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="AlternateContactPerson" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            {/* Alternate Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alternate Contact Number
                                </label>
                                <Field
                                    type="tel"
                                    maxLength={11}
                                    name="AlternateContactNumber"
                                    placeholder="eg: (03323312188)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5570f1]"
                                />
                                <ErrorMessage name="AlternateContactNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 mt-8">
                            <button
                                type="button"
                                onClick={onPrevious}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-[#5570f1] text-white rounded-lg hover:bg-[#4560e1] transition-colors disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ClientPrimaryContact;