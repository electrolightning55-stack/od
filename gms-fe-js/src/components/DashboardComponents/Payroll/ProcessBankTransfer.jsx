'use client'
import { getCurrentDate, getCurrentTime } from '@/utils/FormHelpers/CurrentDateTime';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';
import { useCurrentUser } from '@/lib/hooks';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';

const ProcessBankTransfer = () => {
  
    const [transferType, setTransferType] = useState('');
    const [reportData, setReportData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [locations, setLocations] = useState([]);

    // Validation schema
    const validationSchema = Yup.object({
        officeId: Yup.string(),
        locationId: Yup.string().required('Location is required'),
        bankId: Yup.string().required('Bank selection is required'),
        transferType: Yup.string().required('Transfer type is required')
    });

    // Initial values
    const initialValues = {
        officeId: '',
        locationId: '',
        bankId: '',
        transferType: ''
    };

    useEffect(() => {
        // Mock locations data - replace with actual API call
        setLocations([
            { id: '1', name: 'MEZB', code: 'MEZB' },
            { id: '2', name: 'MEZC', code: 'MEZC' },
            { id: '3', name: 'MEZD', code: 'MEZD' }
        ]);
    }, []);

    const handleFetchReport = async (values, { setSubmitting }) => {
        try {
            // Mock data based on transfer type
            const mockData = transferType === 'IBFT' ? [
                {
                    id: 1,
                    companyBankAccount: '1234567890',
                    amount: '50000',
                    accountTitle: 'Mujtaba Ahmed',
                    accountNumber: '9876543210',
                    bankIdentifierCode: 'MEZB',
                    transferReference: 'IBFT001'
                },
                {
                    id: 2,
                    companyBankAccount: '1234567891',
                    amount: '75000',
                    accountTitle: 'Mustafa Ali',
                    accountNumber: '9876543211',
                    bankIdentifierCode: 'MEZC',
                    transferReference: 'IBFT002'
                }
            ] : [
                {
                    id: 1,
                    guardAccountNumber: '1111222233',
                    amount: '25000',
                    guardAccountTitle: 'Mujtaba Ahmed',
                    emailId: 'ahmad@example.com',
                    transferReference: 'IFT001'
                },
                {
                    id: 2,
                    guardAccountNumber: '4444555566',
                    amount: '30000',
                    guardAccountTitle: 'Hassan Khan',
                    emailId: 'hassan@example.com',
                    transferReference: 'IFT002'
                }
            ];

            setReportData(mockData);
            setShowTable(true);
            toast.success('Report fetched successfully');
        } catch (error) {
            toast.error('Failed to fetch report');
        }
        setSubmitting(false);
    };

    const handleTransferTypeChange = (value, setFieldValue) => {
        setTransferType(value);
        setFieldValue('transferType', value);
        setShowTable(false);
        setReportData([]);
    };

    return (
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-md p-8">

            <div className='flex flex-col gap-4'>
                {/* Auto Fields Row */}
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            User ID
                        </label>
                        <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                            Auto (Display login ID)
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                            {getCurrentDate()}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time
                        </label>
                        <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                            {getCurrentTime()}
                        </div>
                    </div>
                </div>

                <h1 className='text-lg font-medium text-gray-900 mt-5 mb-4'>Process Bank Transfer</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleFetchReport}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form className="space-y-8">
                            {/* Form Fields */}
                            <div className="grid grid-cols-4 gap-6">
                                {/* Office/Branch */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Office/Branch
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="officeId"
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                        >
                                            <option value="">Lock as per attendance sheet</option>
                                            <option value="1">Office 1</option>
                                            <option value="2">Office 2</option>
                                        </Field>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="officeId" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Location
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="locationId"
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                        >
                                            <option value="">Lock as per attendance sheet</option>
                                            {locations.map((location) => (
                                                <option key={location.id} value={location.id}>
                                                    {location.name} - ({location.code})
                                                </option>
                                            ))}
                                        </Field>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="locationId" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Bank */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Bank
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="bankId"
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="hbl">HBL</option>
                                            <option value="ubl">UBL</option>
                                            <option value="mcb">MCB</option>
                                            <option value="nbl">NBP</option>
                                        </Field>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="bankId" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Transfer Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transfer Type
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="transferType"
                                            onChange={(e) => handleTransferTypeChange(e.target.value, setFieldValue)}
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                        >
                                            <option value="">All</option>
                                            <option value="IFT">IFT (Same Bank - Internal Bank Funds Transfer)</option>
                                            <option value="IBFT">IBFT (Interbank Funds Transfer)</option>
                                        </Field>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="transferType" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-formButtonBlue text-white text-sm rounded-md hover:bg-formButtonBlueHover focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Fetching...' : 'Fetch Report'}
                                </button>

                                {showTable && (
                                    <>
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Process Transfer
                                        </button>
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Download
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Transfer Type Headers */}
                            {showTable && transferType && (
                                <div className="mt-8">
                                    {transferType === 'IBFT' && (
                                        <div className="bg-green-500 text-white text-center py-3 rounded-t-lg font-medium">
                                            IBFT (Interbank Funds Transfer)
                                        </div>
                                    )}
                                    {transferType === 'IFT' && (
                                        <div className="bg-orange-500 text-white text-center py-3 rounded-t-lg font-medium">
                                            IFT (Same Bank - Internal Bank Funds Transfer)
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Data Table */}
                            {showTable && reportData.length > 0 && (
                                <div className="bg-formBGBlue rounded-2xl p-6">
                                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                        <table className="min-w-full bg-white rounded-lg">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {transferType === 'IBFT' ? (
                                                        <>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Company Bank Account Number</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Amount</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Account Title</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Account Number</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Bank Identifier Code</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Transfer Reference</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Company Bank Account Number</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Amount</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Guard Account Number</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Email ID</th>
                                                            <th className="px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200">Transfer Reference</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        {transferType === 'IBFT' ? (
                                                            <>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.companyBankAccount}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.amount}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.accountTitle}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.accountNumber}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.bankIdentifierCode}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.transferReference}
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    Numeric Only
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.amount}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.guardAccountNumber}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.emailId}
                                                                </td>
                                                                <td className="px-4 py-3 text-xs text-gray-600 border border-gray-200">
                                                                    {item.transferReference}
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default ProcessBankTransfer