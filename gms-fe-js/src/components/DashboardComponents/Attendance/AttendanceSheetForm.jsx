'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CalendarDaysIcon, ChevronDown, Clock3, Download, Edit2, Lock, Printer, PrinterCheck, Send, Unlock } from 'lucide-react';
import { getCurrentDate, getCurrentTime } from '@/utils/FormHelpers/CurrentDateTime';
import { useCurrentUser } from '@/lib/hooks';
import { formatDate } from '@/utils/FormHelpers/formatDate';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { DateInISOFormat } from '@/utils/FormHelpers/dateHelpers';
import PayrollContext from '@/context/PayrollContext';



const AttendanceSheetForm = () => {
  //context
  const { user } = useCurrentUser();
  const { globalPayrollFilters, setGlobalPayrollFilters, globalLockDate, setGlobalLockDate } = useContext(PayrollContext);
  //states
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [fetchedAttendance, setFetchedAttendance] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [existingPayrollLockDate, setExistingPayrollLockDate] = useState(null);

  // Day labels for the header
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate dynamic date range based on API response
  const generateDateRange = (fromDate, toDate) => {
    const dates = [];
    const start = new Date(fromDate);
    const end = new Date(toDate);

    const current = new Date(start);
    while (current <= end) {
      dates.push({
        date: new Date(current),
        day: current.getDate(),
        dayName: dayLabels[current.getDay()],
        month: current.getMonth() + 1,
        year: current.getFullYear(),
        fullDate: current.toISOString().split('T')[0]
      });
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  // Get calendar days based on date range from API response
  const calendarDays = dateRange ? generateDateRange(dateRange.from, dateRange.to) : [];

  // Use fetched attendance data instead of mock data
  const employees = fetchedAttendance || [];

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

    getLocationsByOrganzation();
  }, []);

  // Validation Schema
  const validationSchema = Yup.object({
    locationId: Yup.string().required('Location ID is required'),
    startDate: Yup.string().required('Start Date is required'),
    endDate: Yup.string().required('End Date is required'),
    serviceNo: Yup.string(),
    officeId: Yup.string()
  });

  // Initial Values
  const initialValues = {
    locationId: globalPayrollFilters?.locationId || '',
    startDate: globalPayrollFilters?.fromDate || '',
    endDate: globalPayrollFilters?.toDate || '',
    serviceNo: '',
    officeId: '',
  };

  useEffect(() => {
    const getLockStatus = async () => {

      const startDate = DateInISOFormat(selectedStartDate);
      try {
        const res = await userRequest.get(`/payroll/lock/status/${selectedLocation?.id}?startDate=${startDate}`);
        console.log(res.data);
        setIsLocked(res.data.data.isLocked);
        setExistingPayrollLockDate(res.data.data);
        setGlobalLockDate(res.data.data);
        const toastMsg = res.data.data.isLocked ? 'Attendance is Locked' : 'Attendance is Open';
        toast.success(toastMsg);
      } catch (error) {
        const errMsg = error?.response?.data?.message;
        toast.error(errMsg);
        console.log(error)
      }
    }

    if (selectedLocation && selectedStartDate) {
      getLockStatus();
    }
  }, [selectedStartDate, selectedLocation]);

  useEffect(() => {
    if (selectedLocation && selectedStartDate && selectedEndDate) {
      console.log("selectedLocation", selectedLocation)
      console.log("selectedStartDate", selectedStartDate)
      console.log("selectedEndDate", selectedEndDate)
      setGlobalPayrollFilters({
        locationId: selectedLocation?.id,
        fromDate: selectedStartDate,
        toDate: selectedEndDate
      })
    }
  }, [selectedLocation, selectedStartDate, selectedEndDate])

  const handleLockAttendance = async () => {
    try {
      if (!selectedEndDate) {
        toast.error('Please select end date');
        return;
      }
      if (!selectedStartDate) {
        toast.error('Please select start date');
        return;
      }
      if (!selectedLocation) {
        toast.error('Please select a location');
        return;
      }
      const startDate = DateInISOFormat(selectedStartDate);
      const endDate = DateInISOFormat(selectedEndDate);
      const res = await userRequest.post(`/payroll/lock/attendance-for-payroll`, {
        locationId: selectedLocation?.id,
        startDate: startDate,
        endDate: endDate
      });
      console.log(res.data);
      


      if (res.data) {
        setIsLocked(true);
        setShowLockModal(false);
        toast.success('Attendance locked successfully');
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || 'Failed to lock attendance');
      console.log(error);
    }
  };

  const fetchAttendance = async (values, { setSubmitting }) => {
    const { locationId, startDate, endDate } = values;

    try {
      const res = await userRequest.get(`/attendance/location/guard/${locationId}?from=${startDate}&to=${endDate}`);

      // Store both attendance data and date range
      if (res.data.data) {
        setFetchedAttendance(res.data.data.result || []);
        setDateRange(res.data.data.dateRange);
        toast.success('Attendance fetched successfully');
      } else {
        toast.error('No attendance found');
      }
    } catch (error) {
      console.log(error);
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg);
    }

    setSubmitting(false);
  };

  const handleLocationChange = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    setSelectedLocation(location);
  };

  const getTotalDaysFromSelectedDateRange = () => {
    if (!globalPayrollFilters?.fromDate || !globalPayrollFilters?.toDate) {
      return 0;
    }
    if (globalPayrollFilters?.fromDate > globalPayrollFilters?.toDate) {
      return 0;
    }
    const startDate = new Date(globalPayrollFilters?.fromDate);
    const endDate = new Date(globalPayrollFilters?.toDate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  // useEffect(() => {
  //   if (selectedLocation) {
  //     console.log(selectedLocation.id)
  //   }
  // }, [selectedLocation]);

  // Update attendance data when fetched attendance changes
  // useEffect(() => {
  //   if (fetchedAttendance.length > 0) {
  //     console.log('Fetched attendance updated:', fetchedAttendance);
  //   }
  // }, [fetchedAttendance]);

  const renderAttendanceCell = (employee, dayInfo) => {
    // Find attendance record for this specific date
    const attendanceRecord = employee.guardAttendance?.find(record => {
      const recordDate = new Date(record.date);
      const dayDate = new Date(dayInfo.fullDate);
      return recordDate.toDateString() === dayDate.toDateString();
    });

    const value = attendanceRecord?.type || '';
    const cellClass = `w-8 h-8 text-xs text-center flex items-center justify-center border border-gray-200 rounded ${value === 'P' ? 'bg-green-100 text-green-800' :
      value === 'A' ? 'bg-red-100 text-red-800' :
        value === 'L' ? 'bg-yellow-100 text-yellow-800' :
          value === 'R' ? 'bg-blue-100 text-blue-800' :
            'bg-white'
      }`;

    return (
      <td key={dayInfo.fullDate} className="p-1">
        <div className={cellClass}>
          {value}
        </div>
      </td>
    );
  };

  return (
    <div className="min-h-screen bg-formBGBlue flex flex-col w-full">

      <div className="w-full max-w-7xl bg-white rounded-xl shadow-md p-8">
        {/* Auto Fields Row */}
        <div className="grid grid-cols-4 gap-6">
          <aside>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office ID
            </label>
            <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
              {user?.id?.slice(0, 8)}
            </div>
          </aside>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor ID
            </label>
            <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
              Auto
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
              {formatDate(getCurrentDate())}
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

        {/* Monthly Attendance Sheet Section */}
        <div className="space-y-6">
          {/* Top-Section */}

          <aside className="bg-white py-5 rounded-xl flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Location Attendance Sheet</h2>

            {selectedLocation && selectedStartDate && (
              <article className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {isLocked ? (
                    <>
                      <Lock className="w-4 h-4 text-red-500" />
                      <span>Lock status: <strong className="text-red-600">Locked</strong></span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-green-500" />
                      <span>Lock status: <strong className="text-green-600">Unlocked</strong></span>
                    </>
                  )}
                </div>
                {!isLocked && (
                  <button
                    onClick={() => setShowLockModal(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-red-500 border border-red-500 text-white text-sm rounded-lg hover:text-red-500 transition-all hover:bg-white hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    Lock
                  </button>
                )}
              </article>
            )}

          </aside>

          {existingPayrollLockDate && (
            <aside className="bg-white p-5 rounded-xl shadow-md border border-gray-200 text-center space-y-3">

              {/* Attendance Range */}
              {existingPayrollLockDate?.startDate && existingPayrollLockDate?.endDate && (
                <p className="flex items-center justify-center gap-2 text-gray-700 text-sm">
                  <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                  Attendance is locked from{" "}
                  <span className="font-semibold text-gray-900">
                    {formatDate(existingPayrollLockDate.startDate)}
                  </span>
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {formatDate(existingPayrollLockDate.endDate)}
                  </span>
                </p>
              )}

              {/* Next Unlock */}
              {existingPayrollLockDate?.nextUnlockTime && (
                <p className="flex items-center justify-center gap-2 text-gray-700 text-sm">
                  <Clock3 className="w-4 h-4 text-purple-500" />
                  Next Unlock:{" "}
                  <span className="font-semibold text-gray-900">
                    {formatDate(existingPayrollLockDate.nextUnlockTime)}
                  </span>
                </p>
              )}
            </aside>
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={fetchAttendance}
          >
            {({ setFieldValue, isSubmitting, errors, touched }) => (
              <Form className="space-y-8">
                <div className="grid grid-cols-5 gap-6">
                  {/* Select Office/Branch */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Office/Branch
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="officeId"
                        className="w-full cursor-pointer px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="1">Office 1</option>
                        <option value="2">Office 2</option>
                        <option value="3">Office 3</option>
                        <option value="4">Office 4</option>
                        <option value="5">Office 5</option>
                        <option value="6">Office 6</option>
                        <option value="7">Office 7</option>
                        <option value="8">Office 8</option>
                      </Field>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <ErrorMessage name="officeId" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Select Location ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Location ID
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="locationId"
                        onChange={(e) => {
                          const locationId = e.target.value;
                          setFieldValue('locationId', locationId);
                          handleLocationChange(locationId);
                        }}
                        className={`w-full px-5 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${errors.locationId && touched.locationId ? 'border-red-500' : 'border-gray-200'}`}
                      >
                        <option value="">Select</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>{location.createdLocationId} - ({location.locationName})</option>
                        ))}
                      </Field>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <ErrorMessage name="locationId" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Start Date picker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Field
                        type="date"
                        onChange={(e) => {
                          setFieldValue('startDate', e.target.value);
                          setSelectedStartDate(e.target.value);
                        }}
                        name="startDate"
                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      />
                    </div>
                    <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* End Date picker */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Field
                        type="date"
                        name="endDate"
                        onChange={(e) => {
                          setFieldValue('endDate', e.target.value);
                          setSelectedEndDate(e.target.value);
                        }}
                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      />
                    </div>
                    <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Total Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Days
                    </label>
                    <div className="relative">
                      <Field
                        type="text"
                        name="totalDays"
                        disabled={true}
                        value={getTotalDaysFromSelectedDateRange() || 0}
                        className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      />
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">


                  {/* Select Service No. */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Service No.
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="serviceNo"
                        className="w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="1">Service 1</option>
                        <option value="2">Service 2</option>
                        <option value="3">Service 3</option>
                        <option value="4">Service 4</option>
                        <option value="5">Service 5</option>
                      </Field>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guard Name
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        className="w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="1">Guard  1</option>
                        <option value="2">Guard 2</option>
                        <option value="3">Guard 3</option>
                        <option value="4">Guard 4</option>
                        <option value="5">Guard 5</option>
                      </Field>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>


                  </div>
                  {/* Fetch Report and Edit buttons */}
                  <div className="flex items-end justify-between gap-6 col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-3 bg-formButtonBlue text-white text-sm rounded-lg hover:bg-formButtonBlueHover focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Fetching...' : 'Fetch Report'}
                    </button>

                    {/* Action buttons */}
                    <div className="flex justify-end items-center">
                      <aside className="flex gap-2">
                        <button type="button" className="flex items-center gap-2 px-3 py-[5px] font-[500] text-[12px] border border-gray-300 rounded-2xl hover:bg-gray-50">
                          <Send className="w-4 h-4" />
                          Post
                        </button>

                        <button type="button" className="flex items-center gap-2 px-3 py-[5px] font-[500] text-[12px] border border-gray-300 rounded-2xl hover:bg-gray-50">
                          <PrinterCheck className="w-4 h-4" />
                          Print
                        </button>

                        <button type="button" className="flex items-center gap-2 px-3 py-[5px] font-[500] text-[12px] border border-gray-300 rounded-2xl hover:bg-gray-50">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </aside>
                    </div>

                  </div>


                </div>



                {/* Monthly Attendance Table */}
                {dateRange && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Attendance Period</h3>
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">From:</span> {formatDate(new Date(dateRange.from))}
                      <span className="mx-3 font-medium">To:</span> {formatDate(new Date(dateRange.to))}
                      <span className="mx-3 font-medium">Total Days:</span> {dateRange.totalDays}
                    </div>
                  </div>
                )}
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

                          {/* Dynamic date range days */}
                          {calendarDays.map((dayInfo) => (
                            <th key={dayInfo.fullDate} className="px-1 py-2 text-xs font-medium text-gray-700 border border-gray-200 w-10">
                              <div className="text-center">
                                <div className="text-xs">{dayInfo.day}</div>
                                <div className="text-xs text-gray-500">{dayInfo.dayName}</div>
                                {/* Show month if it changes within the range */}
                                {dayInfo.day === 1 && (
                                  <div className="text-xs text-blue-600 font-medium">
                                    {new Date(0, dayInfo.month - 1).toLocaleString('default', { month: 'short' })}
                                  </div>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee, index) => (
                          <tr key={employee.id} className="hover:bg-gray-50">
                            <td className="sticky left-0 z-10 bg-white px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                              {index + 1}
                            </td>
                            <td className="sticky left-8 z-10 bg-white px-3 py-2 text-xs text-gray-600 border border-gray-200 min-w-32">
                              {employee.fullName}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                              {employee.serviceNumber}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                              {employee.attendanceStats?.P || 0}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                              {employee.attendanceStats?.A || 0}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                              {employee.attendanceStats?.R || 0}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                              {employee.attendanceStats?.L || 0}
                            </td>

                            {/* Attendance cells for each day */}
                            {calendarDays.map(dayInfo => renderAttendanceCell(employee, dayInfo))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex justify-start space-x-6 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-green-100 border rounded"></div>
                      <span>P - Present</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-red-100 border rounded"></div>
                      <span>A - Absent</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-blue-100 border rounded"></div>
                      <span>R - Rest/Holiday</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-yellow-100 border rounded"></div>
                      <span>L - Leave</span>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">Confirm Lock</h3>
            </div>

            {selectedStartDate && selectedEndDate && selectedLocation &&
              <p className='text-gray-600 mb-6'>You are locking attendance for the period of <br /> {formatDate(selectedStartDate)} to {formatDate(selectedEndDate)} for the location {selectedLocation.locationName}</p>
            }

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLockModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLockAttendance}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Lock Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceSheetForm;