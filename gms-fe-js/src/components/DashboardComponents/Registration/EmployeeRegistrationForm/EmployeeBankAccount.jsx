'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';

const EmployeeBankAccount = ({ onNext, onPrevious, initialData = {} }) => {
    const validationSchema = Yup.object({
        bankName: Yup.string(),
        bankCode: Yup.string().max(4, 'Bank Code must be at most 4 characters').matches(/^[A-Z]+$/, 'Bank Code must contain only capital letters'),
        accountNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Account number must contain only numbers')
            .min(8, 'Account number must be at least 8 digits'),
        IBAN: Yup.string()
            .matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, 'Invalid IBAN format')
            .min(15, 'IBAN must be at least 15 characters')
            .max(34, 'IBAN must not exceed 34 characters'),
        branchCode: Yup.string(),
        branch: Yup.string()
    });

    const initialValues = {
        bankName: initialData.bankName || '',
        bankCode: initialData.bankCode || '',
        accountNumber: initialData.accountNumber || '',
        IBAN: initialData.IBAN || '',
        branchCode: initialData.branchCode || '',
        branch: initialData.branch || ''
    };

    const handleSubmit = (values) => {
        console.log('Employee Bank Account Information:', values);
        if (onNext) {
            onNext(values);
        }
    };

    const pakistaniBanks = [
        { name: 'Habib Bank Limited (HBL)', code: '001' },
        { name: 'United Bank Limited (UBL)', code: '002' },
        { name: 'Muslim Commercial Bank (MCB)', code: '003' },
        { name: 'National Bank of Pakistan (NBP)', code: '004' },
        { name: 'Allied Bank Limited (ABL)', code: '005' },
        { name: 'Bank Alfalah Limited', code: '006' },
        { name: 'Standard Chartered Bank Pakistan', code: '007' },
        { name: 'Faysal Bank Limited', code: '008' },
        { name: 'Bank Al Habib Limited', code: '009' },
        { name: 'Askari Bank Limited', code: '010' },
        { name: 'Soneri Bank Limited', code: '011' },
        { name: 'Bank of Punjab (BOP)', code: '012' },
        { name: 'Meezan Bank Limited', code: '013' },
        { name: 'JS Bank Limited', code: '014' },
        { name: 'Silk Bank Limited', code: '015' }
    ];

    return (
        <div className="flex-1 bg-white p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Add Bank Account</h2>
                    <div className="text-sm text-gray-500">Step 5 of 8</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62.5%' }}></div>
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
                            {/* Bank Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bank Name 
                                </label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name="bankName"
                                        onChange={(e) => {
                                            const selectedBank = pakistaniBanks.find(bank => bank.name === e.target.value);
                                            setFieldValue('bankName', e.target.value);
                                           
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        <option value="">Select Bank</option>
                                        {pakistaniBanks.map((bank) => (
                                            <option key={bank.code} value={bank.name}>
                                                {bank.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <ErrorMessage name="bankName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Bank Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bank Identifier Code (BIC)
                                </label>
                                <Field
                                    type="text"
                                    name="bankCode"
                                    placeholder="Enter Bank Identifier Code (BIC)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="bankCode" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Account Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Number 
                                </label>
                                <Field
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Enter account number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="accountNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* IBAN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    IBAN 
                                </label>
                                <Field
                                    type="text"
                                    name="IBAN"
                                    placeholder="PK57UNIL0000009876543210"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="text-xs text-gray-500 mt-1">Format: PK followed by 22 characters</div>
                                <ErrorMessage name="IBAN" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Branch Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch Code 
                                </label>
                                <Field
                                    type="text"
                                    name="branchCode"
                                    placeholder="Enter branch code"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="branchCode" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Branch Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch Name 
                                </label>
                                <Field
                                    type="text"
                                    name="branch"
                                    placeholder="Enter branch name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="branch" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Information Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Bank Account Information
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Ensure account number is correct and active</li>
                                            <li>IBAN format: PK followed by 22 characters</li>
                                            <li>Branch code should match your account's branch</li>
                                            <li>Salary will be deposited to this account</li>
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

export default EmployeeBankAccount; 