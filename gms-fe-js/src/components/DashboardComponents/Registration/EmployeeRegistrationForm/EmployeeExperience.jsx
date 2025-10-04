'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus, Minus, Trash2 } from 'lucide-react';

const EmployeeExperience = ({ onNext, onPrevious, initialData = {} }) => {
    // Initialize with one experience from initialData or empty
    const [experiences, setExperiences] = useState(() => {
        if (initialData.experiences && initialData.experiences.length > 0) {
            return initialData.experiences;
        }
        return [
            {
                id: 1,
                totalYears: '',
                placeOfDuty: '',
                recentCivilEmployment: ''
            }
        ];
    });

    // Create validation schema dynamically based on number of experiences
    const createValidationSchema = () => {
        const schema = {};
        experiences.forEach((_, index) => {
            schema[`experience_${index}_totalYears`] = Yup.number()
                .min(0, 'Years must be 0 or greater');
            schema[`experience_${index}_placeOfDuty`] = Yup.string();
            schema[`experience_${index}_recentCivilEmployment`] = Yup.string();
        });
        return Yup.object(schema);
    };

    // Create initial values dynamically based on experiences
    const createInitialValues = () => {
        const values = {};
        experiences.forEach((exp, index) => {
            values[`experience_${index}_totalYears`] = exp.totalYears;
            values[`experience_${index}_placeOfDuty`] = exp.placeOfDuty;
            values[`experience_${index}_recentCivilEmployment`] = exp.recentCivilEmployment;
        });
        return values;
    };

    const addExperience = () => {
        const newExp = {
            id: Date.now(),
            totalYears: '',
            placeOfDuty: '',
            recentCivilEmployment: ''
        };
        setExperiences([...experiences, newExp]);
    };

    const removeExperience = (id) => {
        if (experiences.length > 1) {
            setExperiences(experiences.filter(exp => exp.id !== id));
        }
    };

    const handleSubmit = (values) => {
        // Transform form values back to experiences array
        const experiencesData = experiences.map((_, index) => ({
            totalYears: values[`experience_${index}_totalYears`] || '',
            placeOfDuty: values[`experience_${index}_placeOfDuty`] || '',
            recentCivilEmployment: values[`experience_${index}_recentCivilEmployment`] || ''
        }));

        const formData = {
            experiences: experiencesData
        };

        console.log('Employee Experience Information:', formData);
        if (onNext) {
            onNext(formData);
        }
    };

    const NumberInput = ({ name, value, setFieldValue, disabled = false }) => {
        const increment = () => {
            if (!disabled) {
                setFieldValue(name, Math.max(0, (value || 0) + 1));
            }
        };

        const decrement = () => {
            if (!disabled) {
                setFieldValue(name, Math.max(0, (value || 0) - 1));
            }
        };

        return (
            <div className="flex items-center">
                <Field
                    type="number"
                    name={name}
                    min="0"
                    disabled={disabled}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-center"
                />
                <div className="flex flex-col border border-l-0 border-gray-200 rounded-r-md">
                    <button
                        type="button"
                        onClick={increment}
                        disabled={disabled}
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 border-b border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                    <button
                        type="button"
                        onClick={decrement}
                        disabled={disabled}
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                </div>
            </div>
        );
    };

    const ExperienceSection = ({ experienceIndex, experience, isRemovable }) => (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Experience {experienceIndex + 1}
                </h3>
                {isRemovable && (
                    <button
                        type="button"
                        onClick={() => removeExperience(experience.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove this experience"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Years */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Years <span className="text-red-500">*</span>
                    </label>
                    <Field
                        type="number"
                        name={`experience_${experienceIndex}_totalYears`}
                        min="0"
                        placeholder="Enter total years"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name={`experience_${experienceIndex}_totalYears`} component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Place of Duty */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Place of Duty <span className="text-red-500">*</span>
                    </label>
                    <Field
                        type="text"
                        name={`experience_${experienceIndex}_placeOfDuty`}
                        placeholder="Enter place of duty/company"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name={`experience_${experienceIndex}_placeOfDuty`} component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Recent Civil Employment */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recent Civil Employment <span className="text-red-500">*</span>
                    </label>
                    <Field
                        type="text"
                        name={`experience_${experienceIndex}_recentCivilEmployment`}
                        placeholder="Enter your recent civil employment/position"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name={`experience_${experienceIndex}_recentCivilEmployment`} component="div" className="text-red-500 text-sm mt-1" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-white p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                    <div className="text-sm text-gray-500">Step 4 of 8</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
            </div>

            <Formik
                key={experiences.length} // Force re-render when experiences change
                initialValues={createInitialValues()}
                validationSchema={createValidationSchema()}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">
                        {/* Render all experience sections */}
                        {experiences.map((experience, index) => (
                            <ExperienceSection
                                key={experience.id}
                                experienceIndex={index}
                                experience={experience}
                                isRemovable={experiences.length > 1}
                            />
                        ))}

                        {/* Add Experience Button */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={addExperience}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Another Experience
                            </button>
                        </div>

                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Experience Guidelines
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Include all relevant work experience</li>
                                            <li>Total years should reflect actual working years</li>
                                            <li>Place of duty should include company/organization name</li>
                                            <li>Recent civil employment refers to your last position</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
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

export default EmployeeExperience; 