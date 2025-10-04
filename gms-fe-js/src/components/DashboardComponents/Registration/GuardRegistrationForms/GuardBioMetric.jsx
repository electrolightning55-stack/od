'use client';
import React, { useState } from 'react';
import { userRequest } from '@/lib/RequestMethods';
import axios from 'axios';
import toast from 'react-hot-toast';

const GuardBioMetric = ({ onNext, onPrevious, onComplete, onSave, initialData = {} }) => {

    const [scanAvailable, setScanAvailable] = useState(false)

    const biometricFields = [
        { name: 'rightThumb', label: 'Right Thumb' },
        { name: 'rightForeFinger', label: 'Right Fore Finger' },
        { name: 'rightMiddleFinger', label: 'Right Middle Finger' },
        { name: 'rightRingFinger', label: 'Right Ring Finger' },
        { name: 'rightLittleFinger', label: 'Right Little Finger' },
        { name: 'rightFourFinger', label: 'Right Four Fingers' },
        { name: 'leftThumb', label: 'Left Thumb' },
        { name: 'leftForeFinger', label: 'Left Fore Finger' },
        { name: 'leftMiddleFinger', label: 'Left Middle Finger' },
        { name: 'leftRingFinger', label: 'Left Ring Finger' },
        { name: 'leftLittleFinger', label: 'Left Little Finger' },
        { name: 'leftFourFinger', label: 'Left Four Fingers' }
    ];

    const [uploadedFiles, setUploadedFiles] = useState(() => {
        const initialFiles = {};
        biometricFields.forEach(field => {
            initialFiles[field.name] = initialData.biometric?.[field.name] || null;
        });
        return initialFiles;
    });

    console.log('Uploaded biometric files:', uploadedFiles);

    // Helper function to format biometric data
    const formatBiometricData = (files, usePlaceholder = false) => {
        console.log('=== formatBiometricData DEBUG ===');
        console.log('files received:', files);
        console.log('usePlaceholder:', usePlaceholder);

        // Only create biometric object if at least one field has data
        const hasData = Object.values(files).some(value => value !== null && value !== '');
        
        if (!hasData) {
            return { biometric: null };
        }

        const result = {
            biometric: {
                rightThumb: files.rightThumb || null,
                rightForeFinger: files.rightForeFinger || null,
                rightMiddleFinger: files.rightMiddleFinger || null,
                rightRingFinger: files.rightRingFinger || null,
                rightLittleFinger: files.rightLittleFinger || null,
                rightFourFinger: files.rightFourFinger || null,
                leftThumb: files.leftThumb || null,
                leftForeFinger: files.leftForeFinger || null,
                leftMiddleFinger: files.leftMiddleFinger || null,
                leftRingFinger: files.leftRingFinger || null,
                leftLittleFinger: files.leftLittleFinger || null,
                leftFourFinger: files.leftFourFinger || null
            }
        };

        console.log('result.biometric:', result.biometric);
        console.log('=== END formatBiometricData DEBUG ===');

        return result;
    };

    const handleFileChange = async (field, file) => {
        console.log(`Starting file upload for field: ${field}`, { fileName: file?.name, fileType: file?.type });
        
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff', 'application/octet-stream'];
            if (!allowedTypes.includes(file.type)) {
                const errorMsg = 'Please upload only JPG, PNG, BMP, TIFF, or Template files';
                toast.error(errorMsg);
                console.error(`File type validation failed for ${field}:`, file.type);
                return;
            }

            // Validate file size (max 10MB for biometric files)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                const errorMsg = 'File size must be less than 10MB';
                toast.error(errorMsg);
                console.error(`File size validation failed for ${field}:`, file.size);
                return;
            }

            try {
                // Get upload URL from API
                const getUploadKeyPayload = {
                    fileName: file.name,
                    fileType: file.type
                };
                console.log('Biometric upload payload:', getUploadKeyPayload);

                const res = await userRequest.post("/file/presigned-url", getUploadKeyPayload);
                if (!res.data || !res.data.data) {
                    throw new Error('Invalid response from server');
                }
                const { key, uploadUrl } = res.data.data;
                if (!key || !uploadUrl) {
                    throw new Error('Missing upload URL or key from server');
                }
                console.log("Biometric Key:", key);
                console.log("Biometric Upload URL:", uploadUrl);

                // Upload file to S3
                const uploadFileResponse = await axios.put(uploadUrl, file, {
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                if (uploadFileResponse.status === 200) {
                    console.log(file.name, "Uploaded successfully");
                }

                // Update the uploaded files state
                console.log(`File upload successful for ${field}, updating state with key:`, key);
                
                const updatedFiles = {
                    ...uploadedFiles,
                    [field]: key
                };

                console.log('Previous uploaded files:', uploadedFiles);
                console.log('Updated files state:', updatedFiles);

                setUploadedFiles(updatedFiles);

                // Auto-save the data immediately after file upload
                const formattedData = formatBiometricData(updatedFiles);
                console.log(`Formatted data for ${field}:`, formattedData);

                // Auto-save to parent component for persistence (without navigation)
                if (onSave) {
                    console.log(`Saving ${field} data to parent component`);
                    onSave(formattedData);
                    toast.success(`${field} uploaded successfully`);
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
                
                toast.error(errorMessage);
            }
        }
    };

    const removeFile = (fieldName) => {
        console.log(`Removing file for field: ${fieldName}`);
        console.log('Current uploaded files:', uploadedFiles);
        
        const updatedFiles = {
            ...uploadedFiles,
            [fieldName]: null
        };

        console.log('Files state after removal:', updatedFiles);
        setUploadedFiles(updatedFiles);

        // Auto-save the data after file removal
        const formattedData = formatBiometricData(updatedFiles);
        console.log('Formatted data after removal:', formattedData);

        // Auto-save to parent component for persistence (without navigation)
        if (onSave) {
            console.log(`Saving data after removing ${fieldName}`);
            onSave(formattedData);
            toast.success(`${fieldName} removed successfully`);
        }
    };

    const handleCapture = (field) => {
        // Trigger file input click
        const fileInput = document.getElementById(field);
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleCancel = () => {
        if (onPrevious) {
            onPrevious();
        }
    };

    const handleContinue = () => {
        console.log('=== DEBUG handleContinue ===');
        console.log('uploadedFiles:', uploadedFiles);

        // Check if any biometric data is uploaded
        const hasAnyBiometricData = Object.values(uploadedFiles).some(value => value !== null && value !== '');

        // If no biometric data, create empty biometric object
        let formattedData;
        if (!hasAnyBiometricData) {
            formattedData = { biometric: null };
        } else {
            formattedData = formatBiometricData(uploadedFiles, false);
        }

        console.log('Final biometric formattedData:', formattedData);
        console.log('=== END DEBUG ===');

        if (onComplete) {
            onComplete(formattedData);
        }
    };

    const renderFileInput = (field, label) => {
        const file = uploadedFiles[field];

        return (
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <div className="flex">
                    <div className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm text-gray-600 min-h-[42px] flex items-center justify-between">
                        <span>{file ? `File uploaded (${field})` : `No file selected`}</span>
                        {file && (
                            <button
                                type="button"
                                onClick={() => removeFile(field)}
                                className="text-red-500 hover:text-red-700 ml-2"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <input
                        type="file"
                        id={field}
                        accept=".jpg,.jpeg,.png,.bmp,.tiff,.template"
                        onChange={(e) => handleFileChange(field, e.target.files[0])}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => handleCapture(field)}
                        className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${file
                            ? 'bg-green-100 hover:bg-green-200 text-green-600'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                    >
                        {file ? '✓' : '📁'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 bg-white p-8">

           


            {/* Header */}
            <div className="mb-8">
                <aside className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Bio-Metric</h2>
                    <div className="text-sm text-gray-500">Step 8 of 8</div>
                </aside>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <article className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></article>
                </div>
            </div>

            <aside className='flex justify-end'>
                <button
                    type="button"
                    onClick={() => toast.error('Scan not available. Please use document upload.')}
                    className="px-5 py-2 rounded-xl border border-blue-600 text-blue-600 font-medium bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                >
                    Scan Fingerprints
                </button>

            </aside>


            {/* Form Content */}
            <div className="space-y-8">
                {/* Right Hand Bio-Metric */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Right Hand Bio-Metric</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderFileInput('rightThumb', 'Right Thumb')}
                        {renderFileInput('rightForeFinger', 'Right Fore Finger')}
                        {renderFileInput('rightMiddleFinger', 'Right Middle Finger')}
                        {renderFileInput('rightRingFinger', 'Right Ring Finger')}
                        {renderFileInput('rightLittleFinger', 'Right Little Finger')}

                        <div className="col-span-2">
                            {renderFileInput('rightFourFinger', 'Right Four Fingers')}
                        </div>
                    </div>
                </div>

                {/* Left Hand Bio-Metric */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Left Hand Bio-Metric</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {renderFileInput('leftThumb', 'Left Thumb')}
                        {renderFileInput('leftForeFinger', 'Left Fore Finger')}
                        {renderFileInput('leftMiddleFinger', 'Left Middle Finger')}
                        {renderFileInput('leftRingFinger', 'Left Ring Finger')}
                        {renderFileInput('leftLittleFinger', 'Left Little Finger')}

                        <div className="col-span-2">
                            {renderFileInput('leftFourFinger', 'Left Four Fingers')}
                        </div>
                    </div>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Biometric Guidelines
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>All biometric fields are optional - you can proceed without uploading any fingerprints</li>
                                    <li>If uploading, ensure clear fingerprint images or biometric templates</li>
                                    <li>Supported formats: JPG, PNG, BMP, TIFF, Template files</li>
                                    <li>Individual finger captures are preferred for accuracy</li>
                                    <li>Four-finger captures can be used as alternatives</li>
                                    <li>Click "Complete Registration" to continue with or without biometric data</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 pt-8 mt-8">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleContinue}
                    className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Complete Registration
                </button>
            </div>
        </div>
    );
};

export default GuardBioMetric; 