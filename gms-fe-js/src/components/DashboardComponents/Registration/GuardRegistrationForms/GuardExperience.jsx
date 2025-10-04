'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const GuardExperience = ({ onNext, onPrevious, initialData = {} }) => {
    const validationSchema = Yup.object({
        isExServiceMen: Yup.string(),
        rankName: Yup.string(),
        armyNumber: Yup.string(),
        unit: Yup.string(),
        exServiceDischargeNumber: Yup.string(),
        branch: Yup.string(),
        serviceYears: Yup.number().min(0, 'Years must be 0 or greater'),
        serviceMonths: Yup.number().min(0, 'Months must be 0 or greater').max(11, 'Months must be less than 12'),
        securityYears: Yup.number().min(0, 'Years must be 0 or greater'),
        place: Yup.string(),
        recentCivilEmployment: Yup.string()
    });


    const initialValues = {
        isExServiceMen: initialData.guardExperience?.[0]?.isExServiceMen ? 'Yes' : 'No',
        rankName: initialData.guardExperience?.[0]?.rankName || '',
        armyNumber: initialData.guardExperience?.[0]?.armyNumber || '',
        unit: initialData.guardExperience?.[0]?.unit || '',
        exServiceDischargeNumber: initialData.guardExperience?.[0]?.exServiceDischargeNumber || '',
        branch: initialData.guardExperience?.[0]?.branch || '',
        serviceYears: initialData.guardExperience?.[0]?.serviceYears || 0,
        serviceMonths: initialData.guardExperience?.[0]?.serviceMonths || 0,
        securityYears: initialData.guardExperience?.[0]?.securityYears || 0,
        place: initialData.guardExperience?.[0]?.place || '',
        recentCivilEmployment: initialData.guardExperience?.[0]?.recentCivilEmployment || '',
        ...initialData
    };

    const handleSubmit = (values) => {
        // Structure data according to API format
        const formattedData = {
            guardExperience: [{
                isExServiceMen: values.isExServiceMen === 'Yes',
                rankName: values.rankName,
                armyNumber: values.armyNumber,
                unit: values.unit,
                exServiceDischargeNumber: values.exServiceDischargeNumber,
                branch: values.branch,
                serviceYears: parseInt(values.serviceYears) || 0,
                serviceMonths: parseInt(values.serviceMonths) || 0,
                securityYears: parseInt(values.securityYears) || 0,
                place: values.place,
                recentCivilEmployment: values.recentCivilEmployment
            }]
        };

        console.log('Experience Information:', formattedData);
        if (onNext) {
            onNext(formattedData);
        }
    };

    const exServiceOptions = [
        'Yes',
        'No'
    ];

    const rankNames = [
        'Private',
        'Lance Corporal',
        'Corporal',
        'Sergeant',
        'Staff Sergeant',
        'Warrant Officer',
        'Second Lieutenant',
        'Lieutenant',
        'Captain',
        'Major',
        'Lieutenant Colonel',
        'Colonel',
        'Brigadier',
        'Major General',
        'Lieutenant General',
        'General',
        'Security Guard',
        'Head Guard',
        'Supervisor',
        'Other'
    ];

    const branches = [
        'Army',
        'Navy',
        'Air Force',
        'Police',
        'Rangers',
        'Other'
    ];

    const NumberInput = ({ name, value, setFieldValue, disabled = false, label }) => {
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
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ex-Service Men */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ex-Service Men
                                </label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name="isExServiceMen"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">Select</option>
                                        {exServiceOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Field>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <ErrorMessage name="isExServiceMen" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Rank Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rank Name
                                </label>
                                <div className="relative">
                                    <Field
                                     
                                        name="rankName"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    />
                                        
                                   
                                </div>
                                <ErrorMessage name="rankName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Army Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Army Number
                                </label>
                                <Field
                                    type="text"
                                    name="armyNumber"
                                    placeholder="Enter Army Number"
                                    disabled={values.isExServiceMen !== 'Yes'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage name="armyNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Unit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <Field
                                    type="text"
                                    name="unit"
                                    placeholder="Enter Unit"
                                    disabled={values.isExServiceMen !== 'Yes'}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage name="unit" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Service Period - Years and Months */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Period
                                </label>
                                <div className="flex space-x-2 flex-col gap-2">
                                    <div className="flex-1">
                                        <NumberInput
                                            name="serviceYears"
                                            value={values.serviceYears}
                                            setFieldValue={setFieldValue}
                                            disabled={values.isExServiceMen !== 'Yes'}
                                            label="Years"
                                        />
                                        <div className="text-[13px] text-gray-500 mt-1 text-center">Years</div>
                                    </div>
                                    <div className="flex-1">
                                        <NumberInput
                                            name="serviceMonths"
                                            value={values.serviceMonths}
                                            setFieldValue={setFieldValue}
                                            disabled={values.isExServiceMen !== 'Yes'}
                                            label="Months"
                                        />
                                        <div className="text-[13px] text-gray-500 mt-1 text-center">Months</div>
                                    </div>
                                </div>
                                <ErrorMessage name="serviceYears" component="div" className="text-red-500 text-sm mt-1" />
                                <ErrorMessage name="serviceMonths" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Branch */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch
                                </label>
                                <div className="relative">
                                    <Field
                                       
                                        name="branch"
                                        disabled={values.isExServiceMen !== 'Yes'}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                   
                                    
                                </div>
                                <ErrorMessage name="branch" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Ex-Service Discharge Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ex-Service Discharge Number
                            </label>
                            <Field
                                type="text"
                                name="exServiceDischargeNumber"
                                placeholder="Enter Ex-Service Discharge Number"
                                disabled={values.isExServiceMen !== 'Yes'}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <ErrorMessage name="exServiceDischargeNumber" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recent Civil Employment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recent Civil Employment
                                </label>
                                <Field
                                    type="text"
                                    name="recentCivilEmployment"
                                    placeholder="Enter Recent Civil Employment"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="recentCivilEmployment" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Place of Duty */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Place of Duty
                                </label>
                                <Field
                                    type="text"
                                    name="place"
                                    placeholder="Enter Place of Duty"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="place" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Security Years */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Security Years
                                </label>
                                <NumberInput
                                    name="securityYears"
                                    value={values.securityYears}
                                    setFieldValue={setFieldValue}
                                    label="Years"
                                />
                                <ErrorMessage name="securityYears" component="div" className="text-red-500 text-sm mt-1" />
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

export default GuardExperience; 