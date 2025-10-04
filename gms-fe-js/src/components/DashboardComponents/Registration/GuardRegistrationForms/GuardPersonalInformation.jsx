'use client';
import React, { useEffect, useState } from 'react';
import { Formik, Form, useField, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, Calendar } from 'lucide-react';
import CNICInput from '@/utils/FormHelpers/CNICField';
import { CalculateAge } from '@/utils/FormHelpers/CalculateAge';
import { userRequest } from '@/lib/RequestMethods';
import { maxDOB, minDOB } from '@/utils/FormHelpers/AgeLimitCalculator';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const GuardPersonalInformation = ({ onNext, initialData = {} }) => {
  const [offices, setOffices] = useState(null);
  const authData = useSelector((state) => state.user);

  const validationSchema = Yup.object({
    officeId: Yup.string().required("Branch name is required"), //branch name is required
    registrationDate: Yup.date(),
    serviceNumber: Yup.number().required('Service Number is required'), //service number is required
    fullName: Yup.string().required('Full Name is required'),//required
    fatherName: Yup.string(),
    cnicNumber: Yup.string()
      .matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC format should be 12345-1234567-1')
      .required('CNIC Number is required'), //cnic required
    dateOfBirth: Yup.date()
      .required('Date of Birth is required')
      .max(maxDOB, 'You must be at least 21 years old')
      .min(minDOB, 'You must be younger than 55 years old'), //date of birth is required
    cnicIssueDate: Yup.date().required('CNIC Issue Date is required'), //required
    cnicExpiryDate: Yup.date().required('CNIC Expiry Date is required'), //required
    contactNumber: Yup.string()
      .matches(/^[\+]?[0-9]{10,15}$/, 'Invalid phone number')
      .required('Contact Number is required'), //contact is required
    currentAddress: Yup.string(),
    currentAreaPoliceStation: Yup.string(),
    currentAreaPoliceContact: Yup.string(),
    permanentAddress: Yup.string(),
    permanentAreaPoliceStation: Yup.string(),
    permanentAreaPoliceContact: Yup.string(),
    religion: Yup.string(),
    religionSect: Yup.string(),
    weight: Yup.number().positive('Weight must be positive'),
    height: Yup.number()
      .required('Height is required')
      .min(5.6, 'Height must be greater than 5.6 ft'), //height required shold be above 5.6ft or above
    bloodGroup: Yup.string(),
    bloodPressure: Yup.string(),
    heartBeat: Yup.string(),
    eyeColor: Yup.string(),
    disability: Yup.string(),
    eobiNumber: Yup.string(),
    sessiNumber: Yup.string()
  });

  const initialValues = {
    officeId: initialData.officeId || "",
    registrationDate: initialData.registrationDate || new Date().toISOString().split('T')[0],
    serviceNumber: initialData.serviceNumber || null,
    fullName: initialData.fullName || '',
    fatherName: initialData.fatherName || '',
    cnicNumber: initialData.cnicNumber || '',
    dateOfBirth: initialData.dateOfBirth || '',
    cnicIssueDate: initialData.cnicIssueDate || '',
    cnicExpiryDate: initialData.cnicExpiryDate || '',
    contactNumber: initialData.contactNumber || '',
    currentAddress: initialData.currentAddress || '',
    currentAreaPoliceStation: initialData.currentAreaPoliceStation || '',
    currentAreaPoliceContact: initialData.currentAreaPoliceContact || '',
    permanentAddress: initialData.permanentAddress || '',
    permanentAreaPoliceStation: initialData.permanentAreaPoliceStation || '',
    permanentAreaPoliceContact: initialData.permanentAreaPoliceContact || '',
    religion: initialData.religion || '',
    religionSect: initialData.religionSect || '',
    weight: initialData.weight || '',
    height: initialData.height || '',
    bloodGroup: initialData.bloodGroup || '',
    bloodPressure: initialData.bloodPressure || '120/80',
    heartBeat: initialData.heartBeat || '',
    eyeColor: initialData.eyeColor || '',
    disability: initialData.disability || '',
    eobiNumber: initialData.eobiNumber || '',
    sessiNumber: initialData.sessiNumber || '',
    ...initialData
  };

  const handleSubmit = (values) => {
    console.log('Personal Information:', values);
    if (onNext) {
      onNext(values);
    }
  };

  useEffect(() => {
    const getAllOffices = async () => {
      try {
        // Check if we have a token before making the request
        const token = authData.token || authData.currentUser?.data?.token;
        
        if (!token) {
          console.error('No authentication token found');
          toast.error('Please log in again to continue.');
          return;
        }

      // Make the request with timeout
      const res = await userRequest.get("/organizations/get-offices", { 
        timeout: 10000, // 10 second timeout
      });      // Log the complete response for debugging
      console.log("Complete office response:", {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data
      });
      
      if (res.data?.data) {
        console.log("Successfully fetched offices:", res.data.data);
        if (Array.isArray(res.data.data)) {
          setOffices(res.data.data);
        } else {
          console.error("Unexpected data format:", res.data.data);
          toast.error("Invalid data format received from server");
          setOffices([]);
        }
      } else {
        console.warn("API returned success but no data:", res.data);
        toast.error("No office data available. Please contact your administrator.");
        setOffices([]);
      }
    } catch (error) {
      // Detailed error logging
      // Log error without sensitive information
      console.error("Failed to fetch offices:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        endpoint: '/organizations/get-offices'
      });      // User-friendly error messages based on error type
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please check your connection and try again.");
      } else if (!error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        switch (error.response.status) {
          case 401:
            toast.error("Your session has expired. Please log in again.");
            // You might want to redirect to login here
            break;
          case 403:
            toast.error("You don't have permission to view office data. Please contact your administrator.");
            break;
          case 404:
            toast.error("Office data not found. Please contact support.");
            break;
          case 500:
            toast.error("Server error. Our team has been notified.");
            break;
          default:
            toast.error(
              error.response?.data?.message || 
              "Unable to load office data. Please try again later."
            );
        }
      }
      
      setOffices([]); // Set empty array as fallback
    }
  }


    getAllOffices();

  }, []);

  return (
    <div className="flex-1 bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <div className="text-sm text-gray-500">Step 1 of 8</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12.5%' }}></div>
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
              {/* Registration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Date
                </label>
                <Field
                  type="date"
                  name="registrationDate"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="registrationDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Branch Name  */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Branch
                </label>
                <Field
                  as="select"
                  name="officeId"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {offices?.map((office) => (
                    <option key={office.id} value={office.id}>
                      {`${office.branchName} (ID: ${office.branchCode})`}
                    </option>
                  ))}

                </Field>
                <ErrorMessage name="officeId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Service Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Number
                </label>
                <Field
                  type="number"
                  name="serviceNumber"
                  placeholder="Enter your service number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="serviceNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Field
                  type="text"
                  name="fullName"
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father Name
                </label>
                <Field
                  type="text"
                  name="fatherName"
                  placeholder="Enter Father Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="fatherName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* CNIC Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Number
                </label>
                <CNICInput name="cnicNumber" type="text" />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <Field
                  type="date"
                  name="dateOfBirth"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* moved the error message from date of birth input to the age input  */}
              
              </div>

              {values.dateOfBirth && (
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="text"
                    readOnly
                    value={CalculateAge(values?.dateOfBirth)}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none"
                  />
                  <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" /> 
                </div>
              )}



              {/* Dynamically Show Age */}


              {/* CNIC Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Issue Date
                </label>
                <Field
                  type="date"
                  name="cnicIssueDate"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="cnicIssueDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* CNIC Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Expiry Date
                </label>
                <Field
                  type="date"
                  name="cnicExpiryDate"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="cnicExpiryDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                    <img src="https://img.freepik.com/premium-vector/pakistan-circle-flag-logo-icon-computer-vector-illustration-design_1143296-2001.jpg?semt=ais_hybrid&w=740" alt="PK" className="w-5 h-3 mr-1 object-cover" />
                    <span className="text-sm">+92</span>
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </div>
                  <Field
                    type="text"
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Religion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="religion"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="Islam">Islam</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Hinduism">Hinduism</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="religion" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Current Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Address
              </label>
              <Field
                type="text"
                name="currentAddress"
                placeholder="Enter Current Address"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="currentAddress" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Area Police Station */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Area Police Station
                </label>
                <Field
                  type="text"
                  name="currentAreaPoliceStation"
                  placeholder="Enter Current Area Police Station"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="currentAreaPoliceStation" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Current Area Police Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Area Police Contact
                </label>
                <Field
                  type="text"
                  name="currentAreaPoliceContact"
                  placeholder="Enter Current Area Police Contact"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="currentAreaPoliceContact" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Permanent Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permanent Address
              </label>
              <Field
                type="text"
                name="permanentAddress"
                placeholder="Enter Permanent Address"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="permanentAddress" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Permanent Area Police Station */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Area Police Station
                </label>
                <Field
                  type="text"
                  name="permanentAreaPoliceStation"
                  placeholder="Enter Permanent Area Police Station"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="permanentAreaPoliceStation" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Permanent Area Police Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Area Police Contact
                </label>
                <Field
                  type="text"
                  name="permanentAreaPoliceContact"
                  placeholder="Enter Permanent Area Police Contact"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="permanentAreaPoliceContact" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Religion Sect */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion Sect
                </label>
                <Field
                  type="text"
                  name="religionSect"
                  placeholder="Enter Religion Sect"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="religionSect" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <Field
                  type="number"
                  name="weight"
                  placeholder="Enter Weight"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="weight" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (ft)
                </label>
                <Field
                  type="number"
                  name="height"
                  placeholder="Enter Height"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="height" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="bloodGroup"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="bloodGroup" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure
                </label>
                <Field
                  type="text"
                  name="bloodPressure"
                  placeholder="e.g., 120/80"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="bloodPressure" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Heart Beat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Beat (BPM)
                </label>
                <Field
                  type="text"
                  name="heartBeat"
                  placeholder="Enter Heart Beat"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="heartBeat" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eye Color
                </label>
                <Field
                  type="text"
                  name="eyeColor"
                  placeholder="Enter Eye Color"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="eyeColor" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Disability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disability
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="disability"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="None">None</option>
                    <option value="Physical">Physical</option>
                    <option value="Mental">Mental</option>
                    <option value="Visual">Visual</option>
                    <option value="Hearing">Hearing</option>
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="disability" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* EOBI Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EOBI Number
                </label>
                <Field
                  type="text"
                  name="eobiNumber"
                  placeholder="Enter EOBI Number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="eobiNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* SESSI Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SESSI Number
                </label>
                <Field
                  type="text"
                  name="sessiNumber"
                  placeholder="Enter SESSI Number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="sessiNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 pt-8">
              <button
                type="button"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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

export default GuardPersonalInformation;