'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { useCurrentUser } from '@/lib/hooks';
import PayrollContext from '@/context/PayrollContext';
import { formatDate } from '@/utils/FormHelpers/formatDate';
import { DateInISOFormat } from '@/utils/FormHelpers/dateHelpers';


const PayrollSetAllowances = () => {
    //context
    const { user } = useCurrentUser();
    const { globalPayrollFilters } = useContext(PayrollContext);
    console.log(globalPayrollFilters)
    //states
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [locations, setLocations] = useState([]);
    const [payrollData, setPayrollData] = useState([]);
    const [allowanceValues, setAllowanceValues] = useState({});
    const [isExistingAllowance, setIsExistingAllowance] = useState(false);
    const [lockDate, setLockDate] = useState(null);
    const [loading, setLoading] = useState(false);
    // Validation schema
    const validationSchema = Yup.object({
        locationId: Yup.string(),
        officeId: Yup.string(),
        serviceNo: Yup.string(),
        fromDate: Yup.string(),
        toDate: Yup.string()
    });

    // Initial values
    const initialValues = {
        locationId: '',
        officeId: '',
        serviceNo: '',
        fromDate: '',
        toDate: ''
    };

    useEffect(() => {
        const now = new Date();
        const date = now.toLocaleDateString('en-GB');
        const time = now.toLocaleTimeString('en-US');
        setCurrentDate(date);
        setCurrentTime(time);
    }, []);

    useEffect(() => {
        const getLockStatus = async () => {
            setLoading(true);
        
            const startDate = DateInISOFormat(globalPayrollFilters?.fromDate);
            try {
                const res = await userRequest.get(`/payroll/lock/status/${globalPayrollFilters?.locationId}?startDate=${startDate}`);
                
                setLockDate(res.data.data);
               
            } catch (error) {
                const errMsg = error?.response?.data?.message;
                toast.error(errMsg);
                console.log(error)
            } finally {
                setLoading(false);
            }

        }

        if (globalPayrollFilters?.locationId && globalPayrollFilters?.fromDate) {
            getLockStatus();
        }
    }, [globalPayrollFilters?.locationId, globalPayrollFilters?.fromDate]);


    useEffect(() => {
        const getLocationsByOrganization = async () => {
            try {
                const res = await userRequest.get('/location/by-organization');

                setLocations(res.data.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
                toast.error('Failed to fetch locations');
            }
        };

        getLocationsByOrganization();
    }, []);

    useEffect(() => {
        //check if there is already allwoance set 
        const checkExisitngAllowanceByLocation = async () => {
            try {
                const res = await userRequest.get(`/payroll/allowance/guard/${globalPayrollFilters?.locationId}?from=${globalPayrollFilters?.fromDate}&to=${globalPayrollFilters?.toDate}`)
                console.log("res.data", res.data)

               
                if (res.data.data.result.length > 0) {
                    //if exsitign allwoance set we we will disable save button
                    setIsExistingAllowance(true);

                } else {
                    setIsExistingAllowance(false);
                }
            } catch (error) {
                console.error('Error fetching allowance:', error);
                toast.error('Failed to fetch allowance');
            }
        }
        checkExisitngAllowanceByLocation();
    }, [lockDate])

        // useEffect(() => {
        //     console.log("selectedLocation", globalPayrollFilters?.locationId)
        //     console.log("selectedFromDate", globalPayrollFilters?.fromDate)
        //     console.log("selectedToDate", globalPayrollFilters?.toDate)
            
        // }, [globalPayrollFilters])

    const handleGetAllowanceData = async () => {
        try {
            setPayrollData([]);
            setAllowanceValues({});
            const res = await userRequest.get(`/payroll/allowance/guard/${globalPayrollFilters?.locationId}?from=${globalPayrollFilters?.fromDate}&to=${globalPayrollFilters?.toDate}`);

            if (res.data && res.data.data.result.length > 0) {
                toast.success('Guard data loaded successfully');
                setPayrollData(res.data.data.result);

                // Initialize allowance values for each guard with existing values from API
                const initialValues = {};
                res.data.data.result.forEach(guard => {
                    initialValues[guard.id] = {
                        overTimeCount: guard.allowances?.overTimeCount || 0,
                        allowancePercentage: guard.allowances?.allowancePercentage || 0,
                        holidayCount: guard.allowances?.holidayCount || 0
                    };
                });
                setAllowanceValues(initialValues);
            } else {
                toast.error('No guard data available');
            }
        } catch (error) {
            console.error('Error fetching guard data:', error);
            toast.error('Failed to load guard data');
        }
    };

    const handleInputChange = (guardId, field, value) => {
        // Validate allowance percentage to not exceed 100
        if (field === 'allowancePercentage' && parseFloat(value) > 100) {
            toast.error('Allowance percentage cannot exceed 100%');
            return;
        }

        setAllowanceValues(prev => ({
            ...prev,
            [guardId]: {
                ...prev[guardId],
                [field]: value === '' ? 0 : parseFloat(value) || 0
            }
        }));
    };

    const handleSaveAllowances = async () => {
        try {
            // Validate that we have guards to save
            if (!payrollData.length) {
                toast.error('No guard data to save. Please load guards first.');
                return;
            }
            // Prepare payload for each guard according to API specification
            const payload = payrollData.map((guard) => ({
                guardId: guard.id,
                requestedGuardId: guard.requestedGuardId,
                locationPayrollDurationId: lockDate.id,
                allowancePercentage: allowanceValues[guard.id]?.allowancePercentage || 0,
                holidayCount: allowanceValues[guard.id]?.holidayCount || 0,
                overTimeCount: allowanceValues[guard.id]?.overTimeCount || 0
            }));

            const res = await userRequest.post('/payroll/create/guard/allowance', payload);
            console.log("allowances saved", res.data)
            toast.success('Allowances saved successfully for all guards');


        } catch (error) {
            console.error('Error saving allowances:', error);
            toast.error('Failed to save allowances');
        }
    };

    return (
        <div >
            {/* Breadcrumb */}

            {/* Form Card */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-md p-8">
              
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

                <aside className="bg-white py-6 rounded-xl flex justify-between items-center ">
                    <h2 className="text-lg font-medium text-gray-900">
                        Allowances Management - Location Wise
                    </h2>
                   
                    {lockDate?.isLocked ? (
                        <article className="flex flex-col items-end text-sm text-gray-600">
                            <aside className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>
                                    Attendance status: <strong className="text-red-600">Locked</strong>
                                </span>
                            </aside>
                            <span className="text-xs text-gray-500 italic mb-1">
                                Locked from {formatDate(lockDate.startDate)} to {formatDate(lockDate.endDate)}.
                            </span>
                            {isExistingAllowance && (
                                <aside className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>
                                        Allowance status: <strong className="text-green-600">{isExistingAllowance ? 'Saved' : 'Not set'}</strong>
                                    </span>
                                </aside>
                            )}
                          
                           
                           
                        </article>
                    ) : lockDate === null || lockDate === undefined ? (
                        <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {loading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <span>Please complete the previous section to proceed with allowances.</span>
                    )}
                            
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Please lock attendance to proceed with the allowance section.</span>
                        </div>
                    )}
                </aside>




                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleGetAllowanceData}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-8">

                            {/* Payroll Generation Section */}
                            <div className="space-y-6">


                                {/* Selection Fields */}
                                <div className="grid grid-cols-4 gap-6">

                                    {/* Office/Branch */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Office/Branch *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type="text"
                                                name="officeId"
                                                className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                placeholder="Enter Office/Branch"
                                            />
                                        </div>
                                        <ErrorMessage name="officeId" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <aside>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Location *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                disabled={true}
                                                name="locationId"
                                                value={globalPayrollFilters?.locationId}
                                                className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:opacity-100 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select</option>
                                                {locations.map((location) => (
                                                    <option key={location.id} value={location.id}>{location.locationName} - ({location.createdLocationId}) </option>
                                                ))}
                                            </Field>
                                            
                                        </div>
                                        <ErrorMessage name="locationId" component="div" className="text-red-500 text-sm mt-1" />
                                    </aside>

                                    {/* from date picker */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            From Date *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type="date"
                                                name="fromDate"
                                                value={globalPayrollFilters?.fromDate}
                                                disabled={true}
                                                className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                            />
                                        </div>
                                        <ErrorMessage name="fromDate" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>


                                    {/* to date picker */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            To Date *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type="date"
                                                name="toDate"
                                                value={globalPayrollFilters?.toDate}
                                                className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                disabled={true}
                                            />
                                        </div>
                                        <ErrorMessage name="toDate" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>


                                </div>

                                {/* Location Selection Section */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 gap-6">

                                        {/* Service No. */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Service No. *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    type="text"
                                                    name="serviceNo"
                                                    className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                    placeholder="Enter Service No."
                                                />
                                            </div>
                                        </div>
                                        <ErrorMessage name="serviceNo" component="div" className="text-red-500 text-sm mt-1" />

                                        {/* Select guard name */}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Guard Name *
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as="select"
                                                    name="guardName"
                                                    className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                                    placeholder="Enter Guard Name"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">Guard 1</option>
                                                    <option value="2">Guard 2</option>
                                                    <option value="3">Guard 3</option>
                                                    <option value="4">Guard 4</option>
                                                    <option value="5">Guard 5</option>
                                                </Field>

                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <ErrorMessage name="guardName" component="div" className="text-red-500 text-sm mt-1" />

                                        <div className="flex flex-col justify-end">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-2 py-3 bg-formButtonBlue text-white text-sm rounded-md hover:bg-formButtonBlueHover focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Fetching...' : 'Fetch Report'}
                                            </button>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <button
                                                type="button"
                                                onClick={handleSaveAllowances}
                                                disabled={payrollData.length === 0 || isExistingAllowance}
                                                title={isExistingAllowance ? 'Allowance already set for this location' : ''}
                                                className="px-2 py-3 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Save
                                            </button>
                                        </div>
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

                                                    <th className="px-2 py-2 text-xs font-medium text-blue-700 border border-gray-200 bg-blue-50">Over Time <br />Count</th>
                                                    <th className="px-2 py-2 text-xs font-medium text-blue-700 border border-gray-200 bg-blue-50">Allowance <br />% (Max 100)</th>
                                                    <th className="px-2 py-2 text-xs font-medium text-blue-700 border border-gray-200 bg-blue-50">Gazetted <br />Holiday</th>


                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payrollData.length > 0 ? payrollData.map((employee, index) => (
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

                                                        {/* Over Time Count Input */}
                                                        <td className="px-2 py-2 border min-w-32 border-gray-200 bg-blue-50">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                                value={allowanceValues[employee.id]?.overTimeCount || ''}
                                                                onChange={(e) => handleInputChange(employee.id, 'overTimeCount', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        {/* Allowance Percentage Input */}
                                                        <td className="px-2 py-2 border min-w-32 border-gray-200 bg-blue-50">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                                value={allowanceValues[employee.id]?.allowancePercentage || ''}
                                                                onChange={(e) => handleInputChange(employee.id, 'allowancePercentage', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        {/* % Input */}
                                                        <td className="px-2 py-2 border min-w-32 border-gray-200 bg-blue-50">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="1"
                                                                value={allowanceValues[employee.id]?.holidayCount || ''}
                                                                onChange={(e) => handleInputChange(employee.id, 'holidayCount', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                placeholder="0"
                                                            />
                                                        </td>


                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="20" className="px-4 py-8 text-center text-gray-500">
                                                            No guard data available. Please select a location, date range and click "Load Guards" to fetch guard data.
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
                                            <span>Editable Fields - Over Time Count, Allowance %, Holiday Count</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default PayrollSetAllowances