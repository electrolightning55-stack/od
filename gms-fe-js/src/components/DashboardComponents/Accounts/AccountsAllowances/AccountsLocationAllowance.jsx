import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  location: Yup.string().required('Location is required'),
  allowanceMonth: Yup.string().required('Allowance Month is required'),
  amountReceived: Yup.number().min(1, 'Amount must be greater than 0').required('Amount is required'),
  amountPayable: Yup.number().min(1, 'Amount must be greater than 0').required('Amount is required'),
});

// Sample data for the table
const sampleGuards = [
  { id: 1, serviceNo: '00251', guardName: 'Zaffar Khan', attendanceDays: 15, allowancePercentage: 50, payableAllowance: 1000 },
  { id: 2, serviceNo: '00251', guardName: 'Zaffar Khan', attendanceDays: 20, allowancePercentage: 70, payableAllowance: 1400 },
  { id: 3, serviceNo: '00251', guardName: 'Zaffar Khan', attendanceDays: 30, allowancePercentage: 100, payableAllowance: 2000 },
];

const AccountsLocationAllowance = () => {
  const [guardData, setGuardData] = useState(sampleGuards);
  const [showTable, setShowTable] = useState(false);

  const initialValues = {
    location: '',
    allowanceMonth: '',
    amountReceived: '',
    amountPayable: '',
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log('Location Allowance:', values);
    resetForm();
    toast.success('Location Allowance Saved Successfully');
  };

  const calculateTotal = () => {
    setShowTable(true);
    toast.success('Allowance calculated successfully');
  };

  return (
    <div className="space-y-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Select Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Location</label>
                <Field as="select" name="location" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md">
                  <option value="">Select</option>
                  <option value="location1">Location 1</option>
                  <option value="location2">Location 2</option>
                  <option value="location3">Location 3</option>
                </Field>
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Allowance Month */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allowance Month</label>
                <Field type="text" name="allowanceMonth" placeholder="Drop down list month name" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md" />
                <ErrorMessage name="allowanceMonth" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                <div className="px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md text-gray-500">Type</div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Amount Received from Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Received from Client</label>
                  <Field type="number" name="amountReceived" placeholder="For client invoice Rs. 3000" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md" />
                  <ErrorMessage name="amountReceived" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Amount Payable to Guards */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Payable to Guards</label>
                  <Field type="number" name="amountPayable" placeholder="For guards Rs. 2000" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md" />
                  <ErrorMessage name="amountPayable" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={calculateTotal}
                className="px-8 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Calculate
              </button>
            </div>

            {/* Guards Table */}
            {showTable && (
              <div className="bg-formBGBlue rounded-2xl p-6">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Service No.</th>
                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Guard Name</th>
                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Attendance Days</th>
                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Allowance Percentage</th>
                        <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Payable Allowance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guardData.map((guard, index) => (
                        <tr key={guard.id} className="hover:bg-gray-50">
                          <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                            {guard.serviceNo}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                            {guard.guardName}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                            {guard.attendanceDays}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                            {guard.allowancePercentage}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                            {guard.payableAllowance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <button
                type="button"
                className="px-8 py-2 border border-formButtonBlue text-formButtonBlue rounded-md hover:bg-blue-50"
                onClick={() => resetForm()}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2 bg-formButtonBlue text-white rounded-md hover:bg-formButtonBlueHover disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AccountsLocationAllowance