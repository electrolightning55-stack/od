'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { userRequest } from '@/lib/RequestMethods';
import axios from 'axios';
import CNICInput from '@/utils/FormHelpers/CNICField';
import { relationships } from '@/constants/FormConstantFields';

const GuardReferences = ({ onNext, onPrevious, initialData = {} }) => {
    // Initialize with one reference from initialData or empty
    const [references, setReferences] = useState(() => {
        if (initialData.references && initialData.references.length > 0) {
            return initialData.references.map(ref => ({
                ...ref,
                id: ref.id || Date.now(),
                cnicFront: ref.cnicFront || null,
                cnicBack: ref.cnicBack || null
            }));
        }
        return [
            {
                id: Date.now(),
                fullName: '',
                cnicNumber: '',
                cnicFront: null,
                cnicBack: null,
                fatherName: '',
                contactNumber: '',
                relationship: '',
                currentAddress: '',
                permanentAddress: ''
            }
        ];
    });


    // Create validation schema dynamically based on number of references
    const createValidationSchema = () => {
        const schema = {};
        references.forEach((_, index) => {
            // Make all fields conditionally required based on whether any field in the reference is filled
            const referenceFields = [
                `reference_${index}_fullName`,
                `reference_${index}_fatherName`,
                `reference_${index}_cnicNumber`,
                `reference_${index}_contactNumber`,
                `reference_${index}_relationship`,
                `reference_${index}_currentAddress`,
                `reference_${index}_permanentAddress`,
                `reference_${index}_cnicFront`,
                `reference_${index}_cnicBack`
            ];

            const isAnyFieldFilled = function(fields, values) {
                return fields.some(field => values && values[field]);
            };

            // Basic validations without required()
            schema[`reference_${index}_fullName`] = Yup.string()
                .test('conditional-required', 'Full Name is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_fatherName`] = Yup.string()
                .test('conditional-required', "Father's Name is required", function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_cnicNumber`] = Yup.string()
                .matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC format should be 12345-1234567-1')
                .test('conditional-required', 'CNIC Number is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_contactNumber`] = Yup.string()
                .matches(/^[\+]?[0-9]{10,15}$/, 'Invalid contact number')
                .test('conditional-required', 'Contact Number is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_relationship`] = Yup.string()
                .test('conditional-required', 'Relationship is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_currentAddress`] = Yup.string()
                .test('conditional-required', 'Current Address is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_permanentAddress`] = Yup.string()
                .test('conditional-required', 'Permanent Address is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_cnicFront`] = Yup.string()
                .test('conditional-required', 'CNIC Front is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });

            schema[`reference_${index}_cnicBack`] = Yup.string()
                .test('conditional-required', 'CNIC Back is required', function(value) {
                    return !isAnyFieldFilled(referenceFields, this.parent) || value;
                });
        });
        return Yup.object(schema);
    };

    // Create initial values based on references array
    const createInitialValues = () => {
        const values = {};
        references.forEach((reference, index) => {
            values[`reference_${index}_fullName`] = reference.fullName || '';
            values[`reference_${index}_fatherName`] = reference.fatherName || '';
            values[`reference_${index}_cnicNumber`] = reference.cnicNumber || '';
            values[`reference_${index}_contactNumber`] = reference.contactNumber || '';
            values[`reference_${index}_relationship`] = reference.relationship || '';
            values[`reference_${index}_currentAddress`] = reference.currentAddress || '';
            values[`reference_${index}_permanentAddress`] = reference.permanentAddress || '';
            values[`reference_${index}_cnicFront`] = reference.cnicFront || '';
            values[`reference_${index}_cnicBack`] = reference.cnicBack || '';
        });
        return values;
    };

    const addReference = (values) => {
        const newReference = {
            id: Date.now(),
            fullName: '',
            fatherName: '',
            cnicNumber: '',
            contactNumber: '',
            relationship: '',
            currentAddress: '',
            permanentAddress: '',
            cnicFront: null,
            cnicBack: null
        };

        // Preserve existing references' values while adding new one
        setReferences(prev => {
            const updatedReferences = prev.map((ref, idx) => ({
                ...ref,
                fullName: values[`reference_${idx}_fullName`] || ref.fullName,
                fatherName: values[`reference_${idx}_fatherName`] || ref.fatherName,
                cnicNumber: values[`reference_${idx}_cnicNumber`] || ref.cnicNumber,
                contactNumber: values[`reference_${idx}_contactNumber`] || ref.contactNumber,
                relationship: values[`reference_${idx}_relationship`] || ref.relationship,
                currentAddress: values[`reference_${idx}_currentAddress`] || ref.currentAddress,
                permanentAddress: values[`reference_${idx}_permanentAddress`] || ref.permanentAddress,
                cnicFront: values[`reference_${idx}_cnicFront`] || ref.cnicFront,
                cnicBack: values[`reference_${idx}_cnicBack`] || ref.cnicBack
            }));
            return [...updatedReferences, newReference];
        });
    };

    const removeReference = (indexToRemove) => {
        if (references.length > 1) {
            setReferences(prev => prev.filter((_, index) => index !== indexToRemove));
        }
    };

    const handleFileUpload = async (fieldName, event, setFieldValue, values) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        try {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload only JPG, PNG, or PDF files');
                event.target.value = '';
                return;
            }

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size must be less than 10MB');
                event.target.value = '';
                return;
            }

            // Get upload URL from API
            const getUploadKeyPayload = {
                fileName: file.name,
                fileType: file.type
            };

            const res = await userRequest.post("/file/presigned-url", getUploadKeyPayload);
            if (!res.data || !res.data.data) {
                throw new Error('Invalid response from server');
            }
            const { key, uploadUrl } = res.data.data;
            if (!key || !uploadUrl) {
                throw new Error('Missing upload URL or key from server');
            }

            // Upload file to S3
            const uploadFileResponse = await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            if (uploadFileResponse.status === 200) {
                // Update Formik value
                setFieldValue(fieldName, key);

                // Extract reference index and type from fieldName
                const [, referenceIndex, documentType] = fieldName.match(/reference_(\d+)_(cnicFront|cnicBack)/);

                // Update references state while preserving form values
                setReferences(prevReferences => {
                    const updatedReferences = prevReferences.map((ref, idx) => {
                        if (idx === parseInt(referenceIndex)) {
                            return {
                                ...ref,
                                [documentType]: key,
                                fullName: values[`reference_${idx}_fullName`] || ref.fullName,
                                fatherName: values[`reference_${idx}_fatherName`] || ref.fatherName,
                                cnicNumber: values[`reference_${idx}_cnicNumber`] || ref.cnicNumber,
                                contactNumber: values[`reference_${idx}_contactNumber`] || ref.contactNumber,
                                relationship: values[`reference_${idx}_relationship`] || ref.relationship,
                                currentAddress: values[`reference_${idx}_currentAddress`] || ref.currentAddress,
                                permanentAddress: values[`reference_${idx}_permanentAddress`] || ref.permanentAddress
                            };
                        }
                        return ref;
                    });
                    return updatedReferences;
                });
            } else {
                throw new Error(`Upload failed with status ${uploadFileResponse.status}`);
            }
        } catch (error) {
            console.error('File upload failed:', error);
            let errorMessage = 'File upload failed. ';
            
            if (error.response) {
                // Server responded with error
                console.error('Server error:', error.response.data);
                errorMessage += error.response.data.message || 'Server error occurred.';
            } else if (error.request) {
                // Request was made but no response
                console.error('Network error:', error.request);
                errorMessage += 'Network error. Please check your connection.';
            } else {
                // Error in request setup
                console.error('Request error:', error.message);
                errorMessage += error.message || 'Please try again.';
            }
            
            alert(errorMessage);
            
            // Reset the file input
            event.target.value = '';
        }
    };

    const handleSubmit = (values) => {
        // Convert form values back to references array format and filter out empty references
        const formattedReferences = references.map((reference, index) => ({
            fullName: values[`reference_${index}_fullName`] || '',
            fatherName: values[`reference_${index}_fatherName`] || '',
            cnicNumber: values[`reference_${index}_cnicNumber`] || '',
            cnicFront: values[`reference_${index}_cnicFront`] || '',
            cnicBack: values[`reference_${index}_cnicBack`] || '',
            contactNumber: values[`reference_${index}_contactNumber`] || '',
            relationship: values[`reference_${index}_relationship`] || '',
            currentAddress: values[`reference_${index}_currentAddress`] || '',
            permanentAddress: values[`reference_${index}_permanentAddress`] || ''
        })).filter(ref => 
            ref.fullName || 
            ref.fatherName || 
            ref.cnicNumber || 
            ref.contactNumber || 
            ref.relationship || 
            ref.currentAddress || 
            ref.permanentAddress
        );

        const formData = {
            references: formattedReferences.length > 0 ? formattedReferences : undefined
        };

        console.log('References/Guarantors Information:', formData);
        if (onNext) {
            onNext(formData);
        }
    };

    const ReferenceSection = ({ referenceIndex, reference, isRemovable, setFieldValue, values }) => {
        return (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4 relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Reference No. {referenceIndex + 1}
                    </h3>
                    {isRemovable && (
                        <button
                            type="button"
                            onClick={() => removeReference(referenceIndex)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                            title="Remove Reference"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <Field
                            type="text"
                            name={`reference_${referenceIndex}_fullName`}
                            placeholder="Enter Full Name"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name={`reference_${referenceIndex}_fullName`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Father's Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Father's Name <span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="text"
                            name={`reference_${referenceIndex}_fatherName`}
                            placeholder="Enter Father's Name"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name={`reference_${referenceIndex}_fatherName`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* CNIC Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CNIC Number <span className="text-red-500">*</span>
                        </label>
                        <CNICInput name={`reference_${referenceIndex}_cnicNumber`} label="CNIC Number" />


                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="text"
                            name={`reference_${referenceIndex}_contactNumber`}
                            placeholder="Enter Contact Number"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name={`reference_${referenceIndex}_contactNumber`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Relationship */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relationship <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Field
                                as="select"
                                name={`reference_${referenceIndex}_relationship`}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                            >
                                <option value="">Select Relationship</option>
                                {relationships.map((relationship) => (
                                    <option key={relationship} value={relationship}>
                                        {relationship}
                                    </option>
                                ))}
                            </Field>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        <ErrorMessage name={`reference_${referenceIndex}_relationship`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Current Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Address <span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="text"
                            name={`reference_${referenceIndex}_currentAddress`}
                            placeholder="Enter Current Address"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage name={`reference_${referenceIndex}_currentAddress`} component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                </div>

                {/* Permanent Address - Full Width */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permanent Address <span className="text-red-500">*</span>
                    </label>
                    <Field
                        type="text"
                        name={`reference_${referenceIndex}_permanentAddress`}
                        placeholder="Enter Permanent Address"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage name={`reference_${referenceIndex}_permanentAddress`} component="div" className="text-red-500 text-sm mt-1" />
                </div>


                <aside className='flex flex-col items-center justify-center'>

                    <div className="flex items-center gap-4">

                        <div className="mt-2 flex flex-col relative">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileUpload(`reference_${referenceIndex}_cnicFront`, e, setFieldValue, values)}
                                className="hidden"
                                id={`upload-cnic-front-${referenceIndex}`}
                            />
                            <span className="absolute top-[-19px] right-[3px] text-red-500 text-lg">*</span>
                            <label
                                htmlFor={`upload-cnic-front-${referenceIndex}`}
                                className="inline-flex items-center px-6 py-3 bg-[#5570F1]
                                hover:bg-blue-600 text-white rounded-xl cursor-pointer"
                            >
                                {reference.cnicFront ? "✓ CNIC Front Uploaded" : "Upload CNIC Front"}
                            </label>
                            <ErrorMessage
                                name={`reference_${referenceIndex}_cnicFront`}
                                component="div"
                                className="text-red-500 text-sm mt-1 text-center"
                            />
                        </div>

                        {/* CNIC Back Upload */}
                        <div className="mt-2 flex flex-col relative">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileUpload(`reference_${referenceIndex}_cnicBack`, e, setFieldValue, values)}
                                className="hidden"
                                id={`upload-cnic-back-${referenceIndex}`}
                            />
                            <span className="absolute top-[-19px] right-[3px] text-red-500 text-lg">*</span>
                            <label
                                htmlFor={`upload-cnic-back-${referenceIndex}`}
                                className="inline-flex items-center px-6 py-3 bg-[#5570F1] hover:bg-blue-600
                                 text-white rounded-xl cursor-pointer"
                            >
                                {reference.cnicBack ? "✓ CNIC Back Uploaded" : "Upload CNIC Back"}
                            </label>
                            <ErrorMessage
                                name={`reference_${referenceIndex}_cnicBack`}
                                component="div"
                                className="text-red-500 text-sm mt-1 text-center"
                            />
                        </div>
                    </div>
                </aside>
                {/* CNIC Front Upload */}



            </div>
        );
    };

    return (
        <div className="flex-1 bg-white p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">References / Guarantors</h2>
                    <div className="text-sm text-gray-500">Step 6 of 8</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
            </div>

            <Formik
                initialValues={createInitialValues()}
                validationSchema={createValidationSchema()}
                onSubmit={handleSubmit}
                enableReinitialize={false}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-8">
                        {/* Render all reference sections */}
                        {references.map((reference, index) => (
                            <ReferenceSection
                                key={reference.id}
                                referenceIndex={index}
                                reference={reference}
                                isRemovable={references.length > 1}
                                setFieldValue={setFieldValue}
                                values={values}
                            />
                        ))}

                        {/* Add More Reference Button */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => addReference(values)}
                                className="flex items-center px-6 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add More Reference
                            </button>
                        </div>

                        {/* Information Box */}
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-amber-800">
                                        Important Guidelines
                                    </h3>
                                    <div className="mt-2 text-sm text-amber-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>All references must provide valid contact information</li>
                                            <li>References should be financially stable and known to the applicant</li>
                                            <li>Ensure all contact information is current and accurate</li>
                                            <li>CNIC numbers should be accurate and verifiable</li>
                                            <li>You can add multiple references as needed</li>
                                        </ul>
                                    </div>
                                </div>
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

export default GuardReferences; 