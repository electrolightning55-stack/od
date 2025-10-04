import { useCurrentUser } from '@/lib/hooks'
import { getCurrentDate, getCurrentTime } from '@/utils/FormHelpers/CurrentDateTime'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import AccountsLocationAllowance from './AccountsLocationAllowance';
import AccountsOfficeAllowance from './AccountsOfficeAllowance';
import DeductionsForm from './AccountsDeductionsForm';

const allowanceTypes = [
  { value: 'relief', label: 'Relief' },
  { value: 'leave', label: 'Leave' },
  { value: 'misc', label: 'Misc.' },
];

const serviceNumbers = [
  { value: '001', label: '001' },
  { value: '002', label: '002' },
  { value: '003', label: '003' },
];

const allowanceSchema = Yup.object({
  serviceNo: Yup.string().required('Service Number is required'),
  allowanceType: Yup.string().required('Allowance Type is required'),
  amount: Yup.number().min(1, 'Amount must be greater than 0').required('Amount is required'),
});


// Guard Wise Allowance Component
const GuardWiseAllowance = () => {
  const initialValues = {
    serviceNo: '',
    allowanceType: '',
    amount: 0,
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log('Guard Wise Allowance:', values);
    resetForm();
    toast.success('Allowance Saved Successfully');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={allowanceSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Service Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Service Number</label>
              <Field as="select" name="serviceNo" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md">
                <option value="">Select</option>
                {serviceNumbers.map((sn) => (
                  <option key={sn.value} value={sn.value}>{sn.label}</option>
                ))}
              </Field>
              <ErrorMessage name="serviceNo" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* Guard/Employee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guard / Employee Name</label>
              <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">Auto</div>
            </div>
            {/* Allowance Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Allowance Type</label>
              <Field as="select" name="allowanceType" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md">
                <option value="">Drop Down (Relief, Leave, Misc.)</option>
                {allowanceTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Field>
              <ErrorMessage name="allowanceType" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <Field type="number" name="amount" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md" min={0} />
              <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>
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
  );
};



const AccountsAllowance = () => {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('allowance'); // allowance or deduction
  const [activeAllowanceType, setActiveAllowanceType] = useState('guard'); // guard, location, office

  return (
    <div className="w-full max-w-7xl bg-white rounded-xl shadow-md mt-8 p-8">
      <aside>
        <h1 className="text-lg font-[500] text-gray-800">
          Post Allowances & Deductions
        </h1>
      </aside>
      <div className="grid grid-cols-4 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office ID
          </label>
          <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
            {user?.id?.slice(0, 8) || 'Auto'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff ID
          </label>
          <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
            {user?.id?.slice(0, 8) || 'Auto'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
            {getCurrentDate()}
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

      {/* Main Tabs - Allowances/Deductions */}
      <div className="flex gap-4 mt-8 mb-6">
        <button
          className={`flex-1 py-3 rounded-md text-lg font-semibold transition-all ${activeTab === 'allowance' ? 'bg-formButtonBlue text-white' : 'bg-gray-200 text-gray-400'}`}
          onClick={() => setActiveTab('allowance')}
        >
          Allowances
        </button>
        <button
          className={`flex-1 py-3 rounded-md text-lg font-semibold transition-all ${activeTab === 'deduction' ? 'bg-formButtonBlue text-white' : 'bg-gray-200 text-gray-400'}`}
          onClick={() => setActiveTab('deduction')}
        >
          Deductions
        </button>
      </div>

      {/* Sub Tabs for Allowances */}
      {activeTab === 'allowance' && (
        <div className="flex gap-4 mb-6">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeAllowanceType === 'guard' ? 'bg-formButtonBlue text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setActiveAllowanceType('guard')}
          >
            Guard Wise
            <div className="text-xs opacity-75 mt-1">For Individual Guards</div>
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeAllowanceType === 'location' ? 'bg-formButtonBlue text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setActiveAllowanceType('location')}
          >
            Location Allowance
            <div className="text-xs opacity-75 mt-1">For All Guards at Location</div>
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeAllowanceType === 'office' ? 'bg-formButtonBlue text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setActiveAllowanceType('office')}
          >
            Office Allowance
            <div className="text-xs opacity-75 mt-1">For All Guards at Office/Branch</div>
          </button>
        </div>
      )}

      {/* Content based on active tab and type */}
      {activeTab === 'allowance' ? (
        <>
          {activeAllowanceType === 'guard' && (
            <GuardWiseAllowance />
          )}
          {activeAllowanceType === 'location' && (
            <AccountsLocationAllowance />
          )}
          {activeAllowanceType === 'office' && (
            <AccountsOfficeAllowance />
          )}
        </>
      ) : (
        <DeductionsForm />
      )}
    </div>
  )
}

export default AccountsAllowance