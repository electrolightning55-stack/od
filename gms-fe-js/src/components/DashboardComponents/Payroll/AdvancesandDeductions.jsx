'use client';
import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, Download, PrinterCheck } from 'lucide-react';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { deductionTypes } from '@/constants/FormConstantFields';
import PayrollContext from '@/context/PayrollContext';
import { transformDeductionData } from '@/utils/FormHelpers/deductionHelpers';
import Button from '@/common/DashboardCommon/Button';


const AdvancesandDeductions = () => {
    const { globalPayrollFilters } = useContext(PayrollContext);

    const [deductionData, setDeductionData] = useState([]);
    // Validation schema
    const validationSchema = Yup.object({
        officeId: Yup.string(),
        deductionType: Yup.string(),
        dateFrom: Yup.date(),
        dateTo: Yup.date(),
        serviceNo: Yup.string(),
        guardName: Yup.string()
    });

    // Initial values
    const initialValues = {
        officeId: '',
        deductionType: '',
        dateFrom: globalPayrollFilters?.fromDate || '',
        dateTo: globalPayrollFilters?.toDate || '',
        serviceNo: '',
        guardName: ''
    };


    const handleFetchReport = async () => {
        if (!globalPayrollFilters?.locationId || !globalPayrollFilters?.fromDate || !globalPayrollFilters?.toDate) {
            return toast.error('Please select a location and date range');
        }
        try {

            const res = await userRequest.get(`/payroll/guard-deductions/${globalPayrollFilters?.locationId}?from=${globalPayrollFilters?.fromDate}&to=${globalPayrollFilters?.toDate}`);


            if (res.data && res.data.data) {
                const transformedData = transformDeductionData(res.data.data);
                setDeductionData(transformedData);
                toast.success('Deduction data fetched successfully');
            } else {
                toast.error('No data found');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch deduction data');
        }
    };

    const handleSave = () => {
        toast.success('Data saved successfully');
    };

    return (
        <div>
            {/* Form Card */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-md p-8">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-8">
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
                                        Auto
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time
                                    </label>
                                    <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                        Auto
                                    </div>
                                </div>
                            </div>

                            {/* Main Title */}
                            <aside >
                                <h1 className="text-lg font-[500]  text-gray-800">
                                    Advances and Deduction Adjustment - Guard Wise
                                </h1>
                            </aside>

                            {/* Form Fields */}
                            <div className="grid grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Office/Branch
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="officeId"
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:border-transparent appearance-none"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="MEZB">Office 1</option>
                                            <option value="MEZC">Office 2</option>
                                            <option value="MEZD">Office 3</option>
                                        </Field>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="officeId" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Deduction Type
                                    </label>
                                    <div className="relative cursor-pointer">
                                        <Field
                                            as="select"
                                            name="deductionType"
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:border-transparent appearance-none"
                                        >
                                            <option value="" disabled>Select</option>
                                            <option value="all">All</option>
                                            {deductionTypes.map((type) => (
                                                <option key={type.value} value={type.value} >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="deductionType" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Date
                                    </label>
                                    <Field
                                        type="date"
                                        name="dateFrom"
                                        disabled
                                        value={globalPayrollFilters?.fromDate || ''}
                                        placeholder="From"
                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:border-transparent"
                                    />
                                    <ErrorMessage name="dateFrom" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        To Date
                                    </label>
                                    <Field
                                        type="date"
                                        name="dateTo"
                                        disabled
                                        value={globalPayrollFilters?.toDate || ''}
                                        placeholder="To"
                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:border-transparent"
                                    />
                                    <ErrorMessage name="dateTo" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                            </div>

                            <aside className="grid grid-cols-4 gap-6">


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Service No.
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="serviceNo"
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:border-transparent appearance-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="001">001</option>
                                            <option value="002">002</option>
                                            <option value="003">003</option>
                                        </Field>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="serviceNo" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Guard Name Field */}
                                <div className="">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guard Name
                                        </label>
                                        <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                            Auto
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <aside className="flex gap-4 justify-between col-span-2 items-end">

                                    <article className='flex gap-2 items-center'>
                                        <button
                                            type="button"
                                            onClick={handleFetchReport}
                                            disabled={isSubmitting}
                                            className="px-6 py-3 bg-formButtonBlue text-white text-sm rounded-md hover:bg-formButtonBlueHover focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Loading...' : 'Fetch Report'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            className="px-6 py-3 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Save
                                        </button>
                                    </article>



                                </aside>

                            </aside>



                            {/* Data Table */}
                            <div className="bg-formBGBlue rounded-2xl p-6">
                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                    <table className="min-w-full bg-white rounded-lg">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="sticky left-0 z-10 bg-gray-50 px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">S.No</th>
                                                <th className="sticky left-8 z-10 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 min-w-32">Name</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">SERVICE No.</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">P</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">A</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">R</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">L</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">SESSI/PESSI Fund</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">EOBI</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Insurance</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Advances</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Loan Repayment</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Penalty</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Misc. Charges</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deductionData.length > 0 ? deductionData.map((row, index) => (
                                                <tr key={row.id} className="hover:bg-gray-50">
                                                    <td className="sticky left-0 z-10 bg-white px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="sticky left-8 z-10 bg-white px-3 py-2 text-xs text-gray-600 border border-gray-200 min-w-32">
                                                        {row.fullName}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.serviceNumber}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.attendanceStats?.P || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.attendanceStats?.A || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.attendanceStats?.R || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.attendanceStats?.L || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.deductionTotals?.sessiPessiFund || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.deductionTotals?.eobiFund || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.deductionTotals?.insurance || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.deductionTotals?.advances || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.deductionTotals?.loanRepayment || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.deductionTotals?.penalty || 0}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {row.deductionTotals?.miscCharges || 0}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="14" className="px-4 py-8 text-center text-gray-500">
                                                        Please fill in the date field in location attendance sheet and  then click "Fetch Report" to load data.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AdvancesandDeductions;