'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';

const GuardBankAccount = ({ onNext, onPrevious, initialData = {} }) => {
    const validationSchema = Yup.object({
        bankName: Yup.string(),
        //banlk code ax 4 capital only letters
        bankCode: Yup.string().max(4, 'Bank Code must be at most 4 characters').matches(/^[A-Z]+$/, 'Bank Code must contain only capital letters'),
        accountTitle: Yup.string(),
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
        bankName: initialData.bankAccount?.bankName || '',
        bankCode: initialData.bankAccount?.bankCode || '',
        accountTitle: initialData.bankAccount?.accountTitle || '',
        accountNumber: initialData.bankAccount?.accountNumber || '',
        IBAN: initialData.bankAccount?.IBAN || '',
        branchCode: initialData.bankAccount?.branchCode || '',
        branch: initialData.bankAccount?.branch || '',
        ...initialData
    };

    const handleSubmit = (values) => {
        // Structure data according to API format
        const formattedData = {
            bankAccount: {
                bankName: values.bankName,
                bankCode: values.bankCode,
                accountTitle: values.accountTitle,
                accountNumber: values.accountNumber,
                IBAN: values.IBAN.toUpperCase(),
                branchCode: values.branchCode,
                branch: values.branch
            }
        };

        console.log('Bank Account Information:', formattedData);
        if (onNext) {
            onNext(formattedData);
        }
    };

    const pakistaniBanks = [
        'Habib Bank Limited (HBL)',
        'United Bank Limited (UBL)',
        'Muslim Commercial Bank (MCB)',
        'National Bank of Pakistan (NBP)',
        'Allied Bank Limited (ABL)',
        'Bank Alfalah Limited',
        'Standard Chartered Bank Pakistan',
        'Faysal Bank Limited',
        'Bank Al Habib Limited',
        'Askari Bank Limited',
        'JS Bank Limited',
        'Soneri Bank Limited',
        'Bank of Punjab (BOP)',
        'Silk Bank Limited',
        'Summit Bank Limited',
        'Meezan Bank Limited',
        'Dubai Islamic Bank Pakistan',
        'BankIslami Pakistan Limited',
        'Al Baraka Bank (Pakistan) Limited',
        'First Women Bank Limited',
        'Zarai Taraqiati Bank Limited (ZTBL)',
        'The Bank of Khyber',
        'Bank of Azad Jammu & Kashmir',
        'Industrial Development Bank of Pakistan',
        'Other'
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">Select</option>
                                        {pakistaniBanks.map((bank) => (
                                            <option key={bank} value={bank}>
                                                {bank}
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
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    placeholder="Enter Account Number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="accountNumber" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Account Title */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Account Title
                                </label>
                                <Field
                                    type='text'
                                    name='accountTitle'
                                    placeholder="Enter Account Title"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="accountTitle" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* IBAN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    IBAN
                                </label>
                                <Field
                                    type="text"
                                    name="IBAN"
                                    placeholder="Enter IBAN"
                                    style={{ textTransform: 'uppercase' }}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={(e) => {
                                        // Auto-uppercase IBAN input
                                        const value = e.target.value.toUpperCase();
                                        setFieldValue('IBAN', value);
                                    }}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    Format: PK36SCBL0000001123456702
                                </div>
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
                                    placeholder="Enter Branch Code"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="branchCode" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Branch */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch
                                </label>
                                <Field
                                    type="text"
                                    name="branch"
                                    placeholder="Enter Branch Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="branch" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Banking Information Guidelines
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Ensure all banking details are accurate to avoid payment delays</li>
                                            <li>IBAN format should start with PK followed by 2 digits and bank code</li>
                                            <li>Account number should match the number associated with your IBAN</li>
                                            <li>Branch code and name should correspond to your account's home branch</li>
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

export default GuardBankAccount; 