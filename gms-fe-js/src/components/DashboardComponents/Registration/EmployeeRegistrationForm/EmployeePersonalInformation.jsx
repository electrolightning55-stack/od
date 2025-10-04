'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown, Calendar } from 'lucide-react';
import CNICInput from '@/utils/FormHelpers/CNICField';
import { CalculateAge } from '@/utils/FormHelpers/CalculateAge';
import { eyeColors, bloodGroups, religions, religionSects } from '@/constants/FormConstantFields';

const EmployeePersonalInformation = ({ onNext, initialData = {} }) => {
  const validationSchema = Yup.object({
    registrationDate: Yup.date().required('Registration Date is required'),
    fullName: Yup.string().required('Full Name is required'),
    fatherName: Yup.string(),
    cnicNumber: Yup.string()
      .matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC format should be 12345-1234567-1')
      .required('CNIC Number is required'),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of Birth must be in the past')
      .required('Date of Birth is required'),
    cnicIssueDate: Yup.date().required('CNIC Issue Date is required'),
    cnicExpiryDate: Yup.date().required('CNIC Expiry Date is required'),
    contactNumber: Yup.string()
      .matches(/^[\+]?[0-9]{10,15}$/, 'Invalid phone number')
      .required('Contact Number is required'),
    currentAddress: Yup.string(),
    permanentAddress: Yup.string(),
    religion: Yup.string(),
    religionSect: Yup.string(),
    weight: Yup.number().positive('Weight must be positive'),
    height: Yup.number().positive('Height must be positive').required('Height is required'),
    bloodGroup: Yup.string(),
    bloodPressure: Yup.string(),
    heartBeat: Yup.string(),
    eyeColor: Yup.string(),
    disability: Yup.string(),
    eobiNumber: Yup.string(),
    sessiNumber: Yup.string()
  });

  const initialValues = {
    registrationDate: initialData.registrationDate || new Date().toISOString().split('T')[0],
    fullName: initialData.fullName || '',
    fatherName: initialData.fatherName || '',
    cnicNumber: initialData.cnicNumber || '',
    dateOfBirth: initialData.dateOfBirth || '',
    cnicIssueDate: initialData.cnicIssueDate || '',
    cnicExpiryDate: initialData.cnicExpiryDate || '',
    contactNumber: initialData.contactNumber || '',
    currentAddress: initialData.currentAddress || '',
    permanentAddress: initialData.permanentAddress || '',
    religion: initialData.religion || '',
    religionSect: initialData.religionSect || '',
    weight: initialData.weight || '',
    height: initialData.height || '',
    bloodGroup: initialData.bloodGroup || '',
    bloodPressure: initialData.bloodPressure || '',
    heartBeat: initialData.heartBeat || '',
    eyeColor: initialData.eyeColor || '',
    disability: initialData.disability || '',
    eobiNumber: initialData.eobiNumber || '',
    sessiNumber: initialData.sessiNumber || ''
  };

  const handleSubmit = (values) => {
    console.log('Employee Personal Information:', values);
    if (onNext) {
      onNext(values);
    }
  };

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
                  Registration Date <span className="text-red-500">*</span>
                </label>
                <Field
                  type="date"
                  name="registrationDate"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="registrationDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="fatherName"
                  placeholder="Enter father's name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="fatherName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* CNIC Number with auto-dashing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Number <span className="text-red-500">*</span>
                </label>
                <CNICInput name="cnicNumber" />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Field
                  type="date"
                  name="dateOfBirth"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
                {values.dateOfBirth && (
                  <div className="text-xs text-gray-500 mt-1">
                    Age: {CalculateAge(values.dateOfBirth)} years
                  </div>
                )}
              </div>

              {/* CNIC Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Issue Date <span className="text-red-500">*</span>
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
                  CNIC Expiry Date <span className="text-red-500">*</span>
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
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="tel"
                  name="contactNumber"
                  placeholder="Enter contact number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Current Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="currentAddress"
                  rows={3}
                  placeholder="Enter current address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="currentAddress" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Permanent Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="permanentAddress"
                  rows={3}
                  placeholder="Enter permanent address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="permanentAddress" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Religion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="religion"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Religion</option>
                    {religions.map(religion => (
                      <option key={religion} value={religion}>{religion}</option>
                    ))}
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="religion" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Religion Sect */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion Sect <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="religionSect"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Sect</option>
                    {religionSects.map(sect => (
                      <option key={sect} value={sect}>{sect}</option>
                    ))}
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="religionSect" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <Field
                  type="number"
                  name="weight"
                  placeholder="Enter weight in kg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="weight" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <Field
                  type="number"
                  name="height"
                  placeholder="Enter height in cm"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="height" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="bloodGroup"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="bloodGroup" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure <span className="text-red-500">*</span>
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
                  Heart Beat <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="heartBeat"
                  placeholder="e.g., 72 bpm"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="heartBeat" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eye Color <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="eyeColor"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Eye Color</option>
                    {eyeColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="eyeColor" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Disability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disability <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="disability"
                  placeholder="None or specify disability"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="disability" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* EOBI Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EOBI Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="eobiNumber"
                  placeholder="Enter EOBI number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="eobiNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* SESSI Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SESSI Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="sessiNumber"
                  placeholder="Enter SESSI number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="sessiNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
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

export default EmployeePersonalInformation;