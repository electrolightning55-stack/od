'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { userRequest } from '@/lib/RequestMethods';
import { useCurrentUser } from '@/lib/hooks';
import toast from 'react-hot-toast';

const GuardsCategoryForm = () => {

    const { user } = useCurrentUser();

    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [createdGuardCategories, setCreatedGuardCategories] = useState(null);
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        const now = new Date();

        const date = now.toLocaleDateString('en-GB');
        const time = now.toLocaleTimeString('en-US');

        setCurrentDate(date);
        setCurrentTime(time);
    }, []);

    useEffect(() => {

        const getCreatedGuardCategories = async () => {
            setisLoading(true)
            const res = await userRequest.get("/guard-category/by-organization");
            setCreatedGuardCategories(res.data.data);
            console.log(res.data.data);
            if (res.data) {
                setisLoading(false)
            }

        }
        getCreatedGuardCategories();

    }, [])


    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            const GuardCategoryPayload = {
                categoryName: values.guardType
            };

            const res = await userRequest.post('/guard-category', GuardCategoryPayload);
            console.log('Success:', res.data);
            toast.success("Guard Category Created Successfully")

            // Add the new category to the local state
            const newCategory = {
                id: res.data.data?.id || Date.now(), 
                categoryName: values.guardType
            };

            setCreatedGuardCategories((prev) => ([...prev, newCategory]));

            // Reset form on successful submission
            resetForm();

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Error adding guard category. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Add Guards Category</h2>
            <Formik
                initialValues={{ guardType: '' }}
                validationSchema={Yup.object({
                    guardType: Yup.string().required('Guard Type is required'),
                })}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Office</label>
                                <input type="text" value={user?.id} readOnly className="w-full px-4 py-2 bg-formBgLightGreen  rounded-md text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Staff ID</label>
                                <input type="text" value='Auto' readOnly className="w-full px-4 py-2 bg-formBgLightGreen  rounded-md text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                                <input
                                    type="text"
                                    value={currentDate}
                                    readOnly
                                    className="w-full px-4 py-2 bg-formBgLightGreen  rounded-md text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                                <input
                                    type="text"
                                    value={currentTime}
                                    readOnly
                                    className="w-full px-4 py-2 bg-formBgLightGreen  rounded-md text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Enter Guard Type *</label>
                            <Field
                                name="guardType"
                                type="text"
                                placeholder="Enter Type"
                                className="w-full px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name="guardType" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {isLoading ? (
                            <div className="bg-green-50 rounded-lg p-6 mt-2 flex justify-center items-center h-24">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                                <span className="ml-2 text-sm text-green-700">Loading categories...</span>
                            </div>
                        ) : (
                            <div
                                className="bg-green-50 rounded-lg p-6 mt-2 overflow-y-auto"
                                style={{
                                    maxHeight: createdGuardCategories?.length > 10 ? "300px" : "auto",
                                }}
                            >
                                {createdGuardCategories?.map((cat, idx) => (
                                    <div key={cat.id} className="flex items-center mb-2 last:mb-0">
                                        <span className="w-7 h-7 flex items-center justify-center bg-purple-200 text-purple-700 rounded-full mr-3 text-sm font-semibold">
                                            {idx + 1}
                                        </span>
                                        <span className="text-gray-800 text-sm">{cat.categoryName}</span>
                                    </div>
                                ))}
                            </div>
                        )}



                        <div className="flex justify-end space-x-4 pt-8">
                            <button
                                type="button"
                                className="px-8 py-3 border border-blue-500 text-blue-600 rounded-md bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => { }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default GuardsCategoryForm;