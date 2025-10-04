'use client';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Calendar, ChevronDown } from 'lucide-react';
import { getCurrentDate, getCurrentTime } from '@/utils/FormHelpers/CurrentDateTime';
import { formatDate, getCurrentDateISO } from '@/utils/FormHelpers/formatDate';
import { useCurrentUser } from '@/lib/hooks';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import CustomDatePickerField from '@/utils/FormHelpers/CustomDatePickerField';


const LocationAttendanceForm = () => {
  const { user } = useCurrentUser();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [assignedGuards, setAssignedGuards] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});

  const validationSchema = Yup.object({
    locationId: Yup.string().required('Location ID is required'),

    // attenadanceDate: Yup.date().required('Attendance date is required'),

  });

  const initialValues = {
    locationId: '',
    // attenadanceDate: '',
  };



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

  useEffect(() => {
    const getAssignedGuardsByLocation = async () => {
      try {
        const res = await userRequest.get(`/location/assigned-guard/${selectedLocation.id}`)
        // console.log("guards assigned to this location", res.data.data);
        setAssignedGuards(res.data.data);
        if (res.data.data.length === 0) {
          toast.error("No guards assigned to this location");
        }
      } catch (error) {
        console.log(error);
      }
    }
    selectedLocation && getAssignedGuardsByLocation();
  }, [selectedLocation]);

  const handleLocationChange = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    setSelectedLocation(location);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const currentDateISO = getCurrentDateISO();

      if (!attendanceData || Object.keys(attendanceData).length === 0 || !assignedGuards || assignedGuards.length === 0) {
        toast.error("Please select attendance for all guards");
        return;
      }

      // Prepare attendance data for submission
      const attendancePayload = assignedGuards.map((assignedGuard) => ({
        locationId: selectedLocation.id,
        guardId: assignedGuard.guard.id,
        shiftId: assignedGuard.requestedGuard.Shift.id,
        type: attendanceData[assignedGuard.guard.id] || "A", // default to "A" if not selected
        date: currentDateISO,
      }));


      const res = await userRequest.post('/attendance/guard', attendancePayload);
      console.log("attendance submitted", res.data.data);

      toast.success('Attendance submitted successfully');

      // Reset form and state
      setSelectedLocation(null);
      setAttendanceData({});
      setSubmitting(false);
      resetForm();
    } catch (error) {
      console.log(error);
      const errMess = error?.response?.data?.message;
      toast.error(errMess);
      setSubmitting(false);
    }
  };

  const handleCancel = (resetForm) => {
    setSelectedLocation(null);
    setAttendanceData({});
    resetForm();
  };

  return (
    <div className="min-h-screen bg-formBGBlue flex flex-col w-full px-4 pt-4">
      {/* Breadcrumb */}
      <div className="w-full max-w-7xl">
        <aside className="bg-white border-b rounded-xl border-gray-200">
          <div className="px-6 py-4">
            <article className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span>Attendance</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-medium">Location Attendance</span>
            </article>
          </div>
        </aside>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-md mt-8 p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, resetForm, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Auto Fields Row */}
              <div className="grid grid-cols-4 gap-6">
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

              {/* Daily Location Attendance Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Daily Location Attendance</h2>

                <div className="grid grid-cols-3  gap-6">
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
                        className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${errors.locationId && touched.locationId
                          ? 'border-red-500'
                          : 'border-gray-200'
                          }`}
                      >
                        <option value="">Select</option>
                        {locations.map((location) => (
                          <option className='text-sm' key={location.id} value={location.id}>
                            {location.createdLocationId} -({location.locationName} )
                          </option>
                        ))}
                      </Field>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <ErrorMessage name="locationId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Location Name
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="locationName"
                        readOnly
                        disabled
                        className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:opacity-100 disabled:text-black ${errors.locationName && touched.locationName
                          ? 'border-red-500'
                          : 'border-gray-200'
                          }`}
                      >

                        {selectedLocation && (
                          <option value={selectedLocation.locationName}>
                            {selectedLocation.locationName || "No Location Selected"}
                          </option>
                        )}
                      </Field>

                    </div>
                    <ErrorMessage name="locationName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Date Picker to mark the attendance */}

                  <aside>

                    <CustomDatePickerField name="attenadanceDate" />
                    {/* <ErrorMessage name="attenadanceDate" component="div" className="text-red-500 text-sm mt-1" /> */}


                  </aside>
                </div>

                {/* Attendance Table */}
                {assignedGuards && assignedGuards.length > 0 && assignedGuards.map((assignedGuard, index) => (
                  <div className="bg-formBGBlue rounded-2xl p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">S.No.</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Service No.</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Guard Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Shift</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700">Attendance</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">

                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                            <td className="py-3 px-4 text-gray-600">{assignedGuard.guard.serviceNumber}</td>
                            <td className="py-3 px-4 text-gray-600">{assignedGuard.guard.fullName}</td>
                            <td className="py-3 px-4 text-gray-600">{assignedGuard.requestedGuard.Shift.shiftName}</td>
                            {/* //Send shift id to the payload */}
                            <td className="py-3 px-4">
                              <div className="flex justify-center space-x-4">
                                {['P', 'A', 'R', 'L'].map((type) => (
                                  <label key={type} className="flex items-center space-x-1">
                                    <input
                                      type="radio"
                                      name={`attendance-${index}`}
                                      value={type}
                                      checked={attendanceData[assignedGuard.guard.id] === type}
                                      onChange={() =>
                                        setAttendanceData((prev) => ({
                                          ...prev,
                                          [assignedGuard.guard.id]: type,
                                        }))
                                      }
                                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm text-gray-600">{type}</span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}


                {/* Buttons */}
                <div className="flex justify-center space-x-4 pt-8">
                  <button
                    type="button"
                    onClick={() => handleCancel(resetForm)}
                    className="px-7 py-2 border-2 border-formButtonBlue text-formButtonBlue rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2 bg-formButtonBlue text-white rounded-md hover:bg-formButtonBlueHover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"

                    className="px-7 py-2 border-2 border-formButtonBlue text-formButtonBlue rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    Request Approval
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LocationAttendanceForm;