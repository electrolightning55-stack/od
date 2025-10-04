'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus, X, Check } from 'lucide-react';
import { publicRequest, userRequest } from '@/lib/RequestMethods';
import axios from 'axios';

const EmployeeDocuments = ({ onNext, onPrevious, onSave, initialData = {} }) => {

    const documentFields = [
        { name: 'picture', label: 'Picture (passport size)', required: true },
        { name: 'cnicFront', label: 'CNIC Front', required: true },
        { name: 'cnicBack', label: 'CNIC Back', required: true },
        { name: 'licenseFront', label: 'License Front', required: false },
        { name: 'licenseBack', label: 'License Back', required: false }
    ];

    const [uploadedFiles, setUploadedFiles] = useState(() => {
        const initialFiles = {};
        documentFields.forEach(field => {
            initialFiles[field.name] = initialData.employeeDocuments?.[field.name] || null;
        });
        return initialFiles;
    });

    console.log('Employee Documents uploadedFiles:', uploadedFiles);

    // Helper function to format employee documents data
    const formatEmployeeDocumentsData = (files, usePlaceholder = false) => {
        console.log('=== formatEmployeeDocumentsData DEBUG ===');
        console.log('files received:', files);
        console.log('usePlaceholder:', usePlaceholder);

        const result = {
            employeeDocuments: {
                picture: files.picture ? (usePlaceholder ? 'uploaded_file_placeholder' : files.picture) : '',
                cnicFront: files.cnicFront ? (usePlaceholder ? 'uploaded_file_placeholder' : files.cnicFront) : '',
                cnicBack: files.cnicBack ? (usePlaceholder ? 'uploaded_file_placeholder' : files.cnicBack) : '',
                licenseFront: files.licenseFront ? (usePlaceholder ? 'uploaded_file_placeholder' : files.licenseFront) : '',
                licenseBack: files.licenseBack ? (usePlaceholder ? 'uploaded_file_placeholder' : files.licenseBack) : ''
            }
        };

        console.log('result.employeeDocuments:', result.employeeDocuments);
        console.log('=== END formatEmployeeDocumentsData DEBUG ===');

        return result;
    };

    // Validation schema - require picture, cnicFront, cnicBack
    const validationSchema = Yup.object({
        picture: Yup.string().required('Picture is required'),
        cnicFront: Yup.string().required('CNIC Front is required'),
        cnicBack: Yup.string().required('CNIC Back is required')
    });

    const initialValues = {
        ...documentFields.reduce((acc, field) => {
            acc[field.name] = initialData.employeeDocuments?.[field.name] || '';
            return acc;
        }, {})
    };

    const handleSubmit = (values) => {
        console.log('=== DEBUG handleSubmit ===');
        console.log('uploadedFiles:', uploadedFiles);

        // Structure data according to API format using helper function with actual keys
        const formattedData = formatEmployeeDocumentsData(uploadedFiles, false);

        console.log('Final formattedData:', formattedData);
        console.log('=== END DEBUG ===');

        if (onNext) {
            onNext(formattedData);
        }
    };

    // Handle file upload with S3 integration
    const handleFileUpload = async (fieldName, event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload only JPG, PNG, or PDF files');
                return;
            }

            // Validate file size (max 10MB for documents)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size must be less than 10MB');
                return;
            }

            try {
                // Get upload URL from API
                const getUploadKeyPayload = {
                    fileName: file.name,
                    fileType: file.type
                };
                console.log('Document upload payload:', getUploadKeyPayload);

                const res = await userRequest.post("/file/presigned-url", getUploadKeyPayload);
                if (!res.data || !res.data.data) {
                    throw new Error('Invalid response from server');
                }
                const { key, uploadUrl } = res.data.data;
                if (!key || !uploadUrl) {
                    throw new Error('Missing upload URL or key from server');
                }
                console.log("Key:", key);
                console.log("Upload URL:", uploadUrl);

                // Upload file to S3
                try {
                    const uploadFileResponse = await axios.put(uploadUrl, file, {
                        headers: {
                            "Content-Type": file.type,
                        },
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity
                    });

                    if (uploadFileResponse.status === 200) {
                        console.log(file.name, "Uploaded successfully");
                    } else {
                        throw new Error(`Upload failed with status ${uploadFileResponse.status}`);
                    }
                } catch (uploadError) {
                    console.error('S3 upload error:', uploadError);
                    throw new Error('Failed to upload file to storage: ' + (uploadError.message || 'Unknown error'));
                }

                // Update the uploaded files state
                const updatedFiles = {
                    ...uploadedFiles,
                    [fieldName]: key
                };

                setUploadedFiles(updatedFiles);

                // Sync Formik value
                setFieldValue(fieldName, key);

                // Auto-save the data immediately after file upload
                const formattedData = formatEmployeeDocumentsData(updatedFiles);

                // Auto-save to parent component for persistence (without navigation)
                if (onSave) {
                    onSave(formattedData);
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
        }
    };

    const removeFile = (fieldName, setFieldValue) => {
        const updatedFiles = {
            ...uploadedFiles,
            [fieldName]: null
        };

        setUploadedFiles(updatedFiles);

        // Clear Formik value
        setFieldValue(fieldName, '');

        // Auto-save the data after file removal
        const formattedData = formatEmployeeDocumentsData(updatedFiles);

        // Auto-save to parent component for persistence (without navigation)
        if (onSave) {
            onSave(formattedData);
        }
    };

    // Document upload field component
    const DocumentUploadField = ({ field, setFieldValue, error, touched }) => {
        const file = uploadedFiles[field.name];
        const isRequired = field.required;

        // Show file.name if file is an object with a name property, otherwise show the string value
        let fileDisplayName = '';
        if (file) {
            if (typeof file === 'object' && file.name) {
                fileDisplayName = file.name;
            } else {
                fileDisplayName = file;
            }
        }

        return (
            <div className="flex flex-col">
                <div className="flex items-center space-x-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={fileDisplayName}
                            placeholder={field.label + (isRequired ? ' (Required)' : ' (Optional)')}
                            readOnly
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileUpload(field.name, e, setFieldValue)}
                                className="hidden"
                                id={`upload-${field.name}`}
                            />
                            <label
                                htmlFor={`upload-${field.name}`}
                                className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer transition-colors border border-blue-200"
                                title={file ? "Replace file" : "Upload file"}
                            >
                                {file ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                    <Plus className="h-5 w-5 text-blue-600" />
                                )}
                            </label>
                        </div>
                        {file && (
                            <button
                                type="button"
                                onClick={() => removeFile(field.name, setFieldValue)}
                                className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 rounded-md transition-colors border border-red-200"
                                title="Remove file"
                            >
                                <X className="h-5 w-5 text-red-600" />
                            </button>
                        )}
                    </div>
                </div>
                {/* Show validation error if field is required and has error */}
                {isRequired && error && touched && (
                    <div className="text-red-500 text-sm mt-1">{error}</div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 bg-white p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Upload Employee Documents</h2>
                    <div className="text-sm text-gray-500">Step 7 of 8</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                    <Form className="space-y-6">
                        {/* Document Upload Fields */}
                        <div className="space-y-6">
                            {documentFields.map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <DocumentUploadField
                                        field={field}
                                        setFieldValue={setFieldValue}
                                        error={errors[field.name]}
                                        touched={touched[field.name]}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Document Upload Guidelines
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Upload clear, readable documents</li>
                                            <li>Supported formats: JPG, PNG, PDF</li>
                                            <li>Maximum file size: 10MB per document</li>
                                            <li>Picture should be passport size</li>
                                            <li>CNIC should be clearly visible on both sides</li>
                                            <li>Driving license documents are optional</li>
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

export default EmployeeDocuments; 