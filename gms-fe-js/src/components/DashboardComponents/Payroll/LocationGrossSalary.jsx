'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, Download, FileText, Calculator } from 'lucide-react';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { useCurrentUser } from '@/lib/hooks';
import PayrollContext from '@/context/PayrollContext';
import Button from '@/common/DashboardCommon/Button';

const LocationGrossSalaryForm = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [locations, setLocations] = useState([]);
    const [payrollData, setPayrollData] = useState([]);
    const [offices, setOffices] = useState([]);
    const [guards, setGuards] = useState([]);
    const { user } = useCurrentUser();
    const { globalPayrollFilters } = useContext(PayrollContext);
    const [isLoading, setIsLoading] = useState(false);
    // Validation schema
    const validationSchema = Yup.object({
        officeId: Yup.string(),
        locationId: Yup.string().required('Location ID is required'),
        fromDate: Yup.string().required('From date is required'),
        toDate: Yup.string().required('To date is required'),
        serviceNo: Yup.string(),
        guardName: Yup.string()
    });

    // Initial values
    const initialValues = {
        officeId: globalPayrollFilters?.officeId || '',
        locationId: globalPayrollFilters?.locationId || '',
        fromDate: globalPayrollFilters?.fromDate || '',
        toDate: globalPayrollFilters?.toDate || '',
        serviceNo: globalPayrollFilters?.serviceNo || '',
        guardName: globalPayrollFilters?.guardName || ''
    };

    // Get current year dynamically if needed
    const currentYear = new Date().getFullYear();



    useEffect(() => {
        const now = new Date();
        const date = now.toLocaleDateString('en-GB');
        const time = now.toLocaleTimeString('en-US');
        setCurrentDate(date);
        setCurrentTime(time);
    }, []);

    // Use API response data instead of mock data
    const payrollGuards = payrollData || [];

    useEffect(() => {
        const getLocationsByOrganzation = async () => {
            try {
                const res = await userRequest.get('/location/by-organization');
                setLocations(res.data.data);
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch locations');
            }
        };

        // const getOffices = async () => {
        //     try {
        //         const res = await userRequest.get('/organizations/get-offices');
        //         setOffices(res.data.data);
        //     } catch (error) {
        //         console.log(error);
        //         toast.error('Failed to fetch offices');
        //     }
        // };

        getLocationsByOrganzation();
        // getOffices();
    }, []);

    // Fetch guards when location is selected
    useEffect(() => {
        const getGuardsByLocation = async () => {
            const locationId = globalPayrollFilters?.locationId;
            if (locationId) {
                try {
                    const res = await userRequest.get(`/location/assigned-guard/${locationId}`);
                    console.debug('GET /location/assigned-guard response:', res.data);
                    setGuards(res.data.data || []);
                } catch (error) {
                    console.log(error);
                    toast.error('Failed to fetch guards');
                }
            }
        };

        getGuardsByLocation();
    }, [globalPayrollFilters?.locationId]);

    const handleGeneratePayroll = async (values) => {
        setIsLoading(true);
        try {
            const res = await userRequest.get(`/payroll/location/gross-salary/${values.locationId}?from=${values.fromDate}&to=${values.toDate}`);
            console.log(res.data.data);
            if (res.data.data.length > 0) {
                toast.success('Payroll generated successfully');
                setPayrollData(res.data.data);
                console.log(res.data.data);
            } else {
                toast.error('No payroll data available');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to generate payroll');
        } finally {
            setIsLoading(false);
            }
    };

    const handleLocationChange = async (locationId) => {
        if (locationId) {
            try {
                const res = await userRequest.get(`/location/assigned-guard/${locationId}`);
                console.debug('GET /location/assigned-guard (onChange) response:', res.data);
                setGuards(res.data.data || []);
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch guards for this location');
            }
        } else {
            setGuards([]);
        }
    };

    const getFirstDateOfMonth = (month) => {
        return `${currentYear}-${month.value}-01`;
    };


    return (
        <div className="min-h-screen bg-formBGBlue flex flex-col w-full">
            {/* Breadcrumb */}
            {/* <div className="w-full max-w-7xl">
                <aside className="bg-white border-b rounded-xl border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span>Payroll</span>
                            <span>&gt;</span>
                            <span className="text-gray-900 font-medium">Location Gross Salary</span>
                        </div>
                    </div>
                </aside>
            </div> */}

            {/* Form Card */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-md p-8">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleGeneratePayroll}
                >
                    {({ values, isSubmitting, setFieldValue }) => {
                        return (
                            <Form className="space-y-8">
                                {/* Auto Fields Row */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Office ID
                                        </label>
                                        <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                            {user?.id?.slice(0, 8)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                            {currentDate}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Time
                                        </label>
                                        <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                            {currentTime}
                                        </div>
                                    </div>
                                </div>

                                {/* Payroll Generation Section */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Location Gross Salary - Payable Calculation
                                    </h2>

                                    {/* Selection Fields */}
                                    <div className="grid grid-cols-4 gap-6">
                                        {/* Office/Branch */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Office/Branch *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as="select"
                                                    name="officeId"
                                                    disabled={true}
                                                    className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Office1">Office1</option>
                                                    <option value="Office2">Office2</option>
                                                    <option value="Office3">Office3</option>
                                                    <option value="Office4">Office4</option>
                                                    <option value="Office5">Office5</option>
                                                    <option value="Office6">Office6</option>
                                                    <option value="Office7">Office7</option>
                                                </Field>
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                            <ErrorMessage name="officeId" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Location *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as="select"
                                                    name="locationId"
                                                    className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-100 focus:border-transparent appearance-none"
                                                    onChange={(e) => {
                                                        // Update Formik value and fetch guards for selected location
                                                        setFieldValue && setFieldValue('locationId', e.target.value);
                                                        handleLocationChange(e.target.value);
                                                    }}
                                                >
                                                    <option value="">Select</option>
                                                    {locations.map((location) => (
                                                        <option key={location.id} value={location.id}>
                                                            {location.locationName} - ({location.createdLocationId})
                                                        </option>
                                                    ))}
                                                </Field>
                                                
                                            </div>
                                            <ErrorMessage name="locationId" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        {/* From Date */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                From Date *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    type="date"
                                                    disabled={true}
                                                    name="fromDate"
                                                    className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                />
                                            </div>
                                            <ErrorMessage name="fromDate" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        {/* To Date */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                To Date *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    type="date"
                                                    disabled={true}
                                                    name="toDate"
                                                    className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                />
                                            </div>
                                            <ErrorMessage name="toDate" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>

                                    {/* Service Number and Guard Name Section */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-4 gap-6">
                                            {/* Service Number */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Service No. *
                                                </label>
                                                <div className="relative">
                                                    <Field
                                                        as="select"
                                                        name="serviceNo"
                                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            // set Formik field and sync guardName to the corresponding guard id
                                                            setFieldValue && setFieldValue('serviceNo', val);
                                                            const selected = guards.find(g => String(g.guard?.serviceNumber || g.serviceNumber) === val);
                                                            if (selected) {
                                                                setFieldValue && setFieldValue('guardName', selected.guard?.id || selected.id);
                                                            } else {
                                                                setFieldValue && setFieldValue('guardName', '');
                                                            }
                                                        }}
                                                    >
                                                        <option value="">Select</option>
                                                        {guards.map((guard) => (
                                                            <option key={(guard.guard?.id || guard.id) + '_' + String(guard.guard?.serviceNumber || guard.serviceNumber)} value={String(guard.guard?.serviceNumber || guard.serviceNumber || '')}>
                                                                {guard.guard?.serviceNumber || guard.serviceNumber || 'NA'}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                                <ErrorMessage name="serviceNo" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>

                                            {/* Guard Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Guard Name *
                                                </label>
                                                <div className="relative">
                                                    <Field
                                                        as="select"
                                                        name="guardName"
                                                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setFieldValue && setFieldValue('guardName', val);
                                                            const selected = guards.find(g => (g.guard?.id || g.id) === val);
                                                            if (selected) {
                                                                setFieldValue && setFieldValue('serviceNo', String(selected.guard?.serviceNumber || selected.serviceNumber || ''));
                                                            } else {
                                                                setFieldValue && setFieldValue('serviceNo', '');
                                                            }
                                                        }}
                                                    >
                                                        <option value="">Select</option>
                                                        {guards.map((guard) => (
                                                            <option key={guard.guard?.id || guard.id} value={guard.guard?.id || guard.id}>
                                                                {guard.guard?.fullName || guard.fullName || 'NA'}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                                <ErrorMessage name="guardName" component="div" className="text-red-500 text-sm mt-1" />
                                            </div>

                                            <aside className="flex items-end col-span-2">
                                                <Button variant="blue" isLoading={isLoading} loadingText="Generating..." type="submit">
                                                    Fetch Report
                                                </Button>
                                            
                                            </aside>

                                           
                                        </div>
                                    </div>

                                    {/* Payroll Table */}
                                    <div className="bg-formBGBlue rounded-2xl p-6">
                                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                            <table className="min-w-full bg-white rounded-lg">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="sticky left-0 z-10 bg-gray-50 px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">S.No</th>
                                                        <th className="sticky left-8 z-10 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 min-w-32">Name</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">SERVICE No.</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Client ID</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Location Id</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Location Name</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Category</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Shift</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">P</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">A</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">R</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">L</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Net Salary</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">OverTime Amount</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Allowance Amount</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Guz. H Amount</th>
                                                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200 bg-green-50">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payrollGuards.length > 0 ? payrollGuards.map((employee, index) => {

                                                        return (
                                                            <tr key={employee.id} className="hover:bg-gray-50">
                                                                <td className="sticky left-0 z-10 bg-white px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="sticky left-8 z-10 bg-white px-3 py-2 text-xs text-gray-600 border border-gray-200 min-w-32">
                                                                    {employee.fullName || 'NA'}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.serviceNumber || 'NA'}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.location?.client?.contractNumber || 'NA'}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.location?.createdLocationId || 'NA'}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.location?.locationName || 'NA'}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.guardCategory || 'NA'}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.shift || 'NA'}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs min-w-[45px] text-gray-600 border border-gray-200 text-center">
                                                                    {employee.attendanceStats?.P || 0}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs min-w-[45px] text-gray-600 border border-gray-200 text-center">
                                                                    {employee.attendanceStats?.A || 0}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs min-w-[45px] text-gray-600 border border-gray-200 text-center">
                                                                    {employee.attendanceStats?.R || 0}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs min-w-[45px] text-gray-600 border border-gray-200 text-center">
                                                                    {employee.attendanceStats?.L || 0}
                                                                </td>

                                                                {/* Net Salary */}
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.netSalary?.toFixed(1) || 0}
                                                                </td>
                                                                {/* Overtime Amount given by organizational admin */}
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.guardFinances?.overtimePerHour || 0}
                                                                </td>
                                                                {/* Allowance Amount given by organizational admin */}
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.guardFinances?.allowance || 0}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                                    {employee.guardFinances?.gazettedHoliday || 0}
                                                                </td>
                                                                <td className="px-2 py-2 text-xs min-w-[55px] font-semibold text-green-600 border border-gray-200 text-center bg-green-50">
                                                                    {employee.totalGrossSalary.toFixed(1)}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }) : (
                                                        <tr>
                                                            <td colSpan="20" className="px-4 py-8 text-center text-gray-500">
                                                                No payroll data available. Please select a location, date range, and click "Fetch Report" to generate payroll data.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Legend */}
                                        <div className="mt-4 flex justify-start space-x-6 text-xs text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 bg-green-100 border rounded"></div>
                                                <span>P - Present Days</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 bg-red-100 border rounded"></div>
                                                <span>A - Absent Days</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 bg-yellow-100 border rounded"></div>
                                                <span>L - Leave Days</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-4 h-4 bg-blue-100 border rounded"></div>
                                                <span>OT - Overtime</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default LocationGrossSalaryForm; 