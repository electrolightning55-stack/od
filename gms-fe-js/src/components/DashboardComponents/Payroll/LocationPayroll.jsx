'use client';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, Download, PrinterCheck } from 'lucide-react';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import PayrollContext from '@/context/PayrollContext';
import { transformDeductionData } from '@/utils/FormHelpers/deductionHelpers';
import Button from '@/common/DashboardCommon/Button';


const LocationPayroll = () => {
    const { globalPayrollFilters } = useContext(PayrollContext);

    const [payrollData, setPayrollData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Validation schema
    const validationSchema = Yup.object({
        officeId: Yup.string(),
        locationId: Yup.string().required('Location is required'),
        dateFrom: Yup.date().required('From date is required'),
        dateTo: Yup.date().required('To date is required'),
        totalDays: Yup.number().required('Total days is required')
    });

    // Initial values
    const initialValues = {
        officeId: '',
        locationId: globalPayrollFilters?.locationId || "",
        dateFrom: globalPayrollFilters?.fromDate || "",
        dateTo: globalPayrollFilters?.toDate || "",
        totalDays: globalPayrollFilters?.totalDays || 30
    };

    useEffect(() => {
        const getLocationsByOrganization = async () => {
            try {
                const res = await userRequest.get('/location/by-organization');
                setLocations(res.data.data);
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch locations');
            }
        };
        getLocationsByOrganization();
    }, []);


    const getFinalPayrollData = async () => {
        setIsLoading(true);

        if (!globalPayrollFilters?.locationId || !globalPayrollFilters?.fromDate || !globalPayrollFilters?.toDate) { return toast.error('Please select a location and date range'); }

        try {
            if (!globalPayrollFilters?.locationId || !globalPayrollFilters?.fromDate || !globalPayrollFilters?.toDate) {
                toast.error('Please select a location and date range');
                return;
            }
            const res = await userRequest.get(`/payroll/location/net-payable/${globalPayrollFilters?.locationId}?from=${globalPayrollFilters?.fromDate}&to=${globalPayrollFilters?.toDate}`);
            console.log("res.data", res.data);

            // Transform data using deduction helper
            const rawData = res.data.data || [];
            const transformedData = transformDeductionData(rawData);

            setPayrollData(transformedData);
            toast.success('Payroll data loaded successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch payroll data');
            setPayrollData([]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleSave = () => {
        toast.success('Payroll for the month of ' + globalPayrollFilters?.fromDate + ' to ' + globalPayrollFilters?.toDate + ' locked successfully');
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
                            <aside>
                                <h1 className="text-lg font-[500] text-gray-800">
                                    Location Pay Roll - Net Payable to Guard
                                </h1>
                            </aside>

                            {/* Form Fields */}
                            <div className="grid grid-cols-5 gap-6">
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
                                            <option value="">Select Office/Branch</option>
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
                                        Select Location
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as="select"
                                            name="locationId"
                                            disabled={true}
                                            value={globalPayrollFilters?.locationId}
                                            className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none disabled:opacity-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                        >
                                            <option value="">Select</option>
                                            {locations.map((location) => (
                                                <option key={location.id} value={location.id}>{location.locationName} - ({location.createdLocationId}) </option>
                                            ))}

                                        </Field>

                                    </div>
                                    <ErrorMessage name="locationId" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date Range
                                    </label>
                                    <Field
                                        type="date"
                                        disabled={true}
                                        name="dateFrom"
                                        placeholder="Lock"
                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <ErrorMessage name="dateFrom" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date Range
                                    </label>
                                    <Field
                                        type="date"
                                        disabled={true}
                                        name="dateTo"
                                        placeholder="Lock"
                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <ErrorMessage name="dateTo" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Days
                                    </label>
                                    <Field
                                        type="number"
                                        disabled={true}
                                        name="totalDays"
                                        placeholder="Lock"
                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <ErrorMessage name="totalDays" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>



                            <div className="grid grid-cols-5 gap-6">
                                <aside>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service No.
                                    </label>
                                    <Field
                                        type="text"
                                        name="serviceNo"
                                        placeholder="Service No."
                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </aside>
                                <aside>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guard Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="guardName"
                                        placeholder="Guard Name"
                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </aside>

                                {/* Action Buttons */}
                                <aside className="flex gap-4 justify-between col-span-3 items-end">
                                    <article className='flex gap-2 items-center'>

                                        <Button variant="blue" onClick={getFinalPayrollData} disabled={isLoading} isLoading={isLoading} loadingText="Fetching..." type="button">
                                            Fetch Report
                                        </Button>

                                        <Button variant="red" onClick={handleSave} disabled={isLoading} isLoading={isLoading} loadingText="Saving..." type="button">
                                            Lock Payroll
                                        </Button>
                                    </article>

                                    <aside className="flex gap-2 items-center">
                                        <button type="button" className="flex items-center gap-2 px-3 py-[5px] font-[500] text-[12px] border border-gray-300 rounded-2xl hover:bg-gray-50">
                                            <PrinterCheck className="w-4 h-4" />
                                            Print
                                        </button>

                                        <button type="button" className="flex items-center gap-2 px-3 py-[5px] font-[500] text-[12px] border border-gray-300 rounded-2xl hover:bg-gray-50">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </aside>
                                </aside>

                            </div>


                            {/* Data Table */}
                            <div className="bg-formBGBlue rounded-2xl p-6">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-600">Loading payroll data...</span>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                        <table className="min-w-full bg-white rounded-lg">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">S.No</th>
                                                    <th className="sticky left-10 z-10 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-40">Name</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-24">SERVICE No.</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-16">P</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-16">A</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-16">R</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-16">L</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">
                                                        Sessi/Pessi Fund
                                                    </th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">
                                                        EOBI
                                                    </th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">
                                                        Insurance
                                                    </th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">
                                                        Advances
                                                    </th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">
                                                        Loan Repayment
                                                    </th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">Penalty</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">Misc Charges</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">Net Deductions</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">Net Salary</th>


                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-24">Over Time</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-24">Allowance</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 w-32">Gazetted Holiday</th>
                                                    <th className="px-3 py-3 text-xs font-medium text-gray-700 border border-gray-200 bg-green-50 w-32">
                                                        Net Payable
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payrollData.length > 0 ? payrollData.map((row, index) => (
                                                    <tr key={row.id} className="hover:bg-gray-50">
                                                        <td className="sticky left-0 z-10 bg-white px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-16">
                                                            {index + 1}
                                                        </td>
                                                        <td className="sticky left-10 z-10 bg-white px-4 py-3 text-xs text-gray-600 border border-gray-200 w-40">
                                                            {row.fullName}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-24">
                                                            {row.serviceNumber}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-16">
                                                            {row.attendanceStats?.P || 0}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-16">
                                                            {row.attendanceStats?.A || 0}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-16">
                                                            {row.attendanceStats?.R || 0}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-16">
                                                            {row.attendanceStats?.L || 0}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.deductionTotals?.sessiPessiFund || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.deductionTotals?.eobiFund || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.deductionTotals?.insurance || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.deductionTotals?.advances || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.deductionTotals?.loanRepayment || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.deductionTotals?.penalty || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.deductionTotals?.miscCharges || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.netDeductions).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-28">
                                                            <span className="font-medium">{parseFloat(row.netSalary).toFixed(2)}</span>
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-24">
                                                            {parseFloat(row.providedAllowances?.overTimeAmount || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-24">
                                                            {parseFloat(row.providedAllowances?.allowanceAmount || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center w-32">
                                                            {parseFloat(row.providedAllowances?.gazettedHolidayAmount || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-3 text-xs text-gray-600 border border-gray-200 text-center bg-green-50 font-semibold w-32">
                                                            <span className="text-green-700 font-bold">{parseFloat(row.netPayableSalary).toFixed(2)}</span>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="14" className="px-4 py-12 text-center text-gray-500">
                                                            {isLoading ? 'Loading...' : 'No payroll data available. Please fill in the form and click "Fetch Report" to load data.'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LocationPayroll;
