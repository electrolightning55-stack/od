'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';
import CNICInput from '@/utils/FormHelpers/CNICField';

const EmployeeNextOfKin = ({ onNext, onPrevious, initialData = {} }) => {
  const validationSchema = Yup.object({
    kinName: Yup.string(),
    kinFatherName: Yup.string(),
    kinRelation: Yup.string(),
    kinCNIC: Yup.string()
      .matches(/^\d{5}-\d{7}-\d{1}$/, 'CNIC format should be 12345-1234567-1'),
    kinContactNumber: Yup.string()
      .matches(/^[\+]?[0-9]{10,15}$/, 'Invalid phone number')
  });

  const initialValues = {
    kinName: initialData.kinName || '',
    kinFatherName: initialData.kinFatherName || '',
    kinRelation: initialData.kinRelation || '',
    kinCNIC: initialData.kinCNIC || '',
    kinContactNumber: initialData.kinContactNumber || ''
  };

  const handleSubmit = (values) => {
    console.log('Employee Next of Kin Information:', values);
    if (onNext) {
      onNext(values);
    }
  };

  const relations = [
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Son',
    'Daughter',
    'Spouse',
    'Uncle',
    'Aunt',
    'Cousin',
    'Friend',
    'Neighbor',
    'Other'
  ];

  return (
    <div className="flex-1 bg-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Next of Kin/ Emergency Contact</h2>
          <div className="text-sm text-gray-500">Step 2 of 8</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
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
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name 
                </label>
                <Field
                  type="text"
                  name="kinName"
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="kinName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father Name 
                </label>
                <Field
                  type="text"
                  name="kinFatherName"
                  placeholder="Enter father's name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="kinFatherName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Relation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation 
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="kinRelation"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Relation</option>
                    {relations.map(relation => (
                      <option key={relation} value={relation}>{relation}</option>
                    ))}
                  </Field>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <ErrorMessage name="kinRelation" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* CNIC Number with auto-dashing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC Number 
                </label>
                <CNICInput name="kinCNIC" />
              </div>

              {/* Contact Number */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number 
                </label>
                <Field
                  type="tel"
                  name="kinContactNumber"
                  placeholder="Enter contact number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="kinContactNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center space-x-4 pt-8">
              <button
                type="button"
                onClick={onPrevious}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Previous
              </button>
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

export default EmployeeNextOfKin;