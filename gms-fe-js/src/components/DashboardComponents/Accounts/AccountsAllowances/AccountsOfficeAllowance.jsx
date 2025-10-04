import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    office: Yup.string().required('Office/Branch is required'),
    allowanceMonth: Yup.string().required('Allowance Month is required'),
    amountReceived: Yup.number().min(1, 'Amount must be greater than 0').required('Amount is required'),
    amountPayable: Yup.number().min(1, 'Amount must be greater than 0').required('Amount is required'),
});

// Sample data for multiple locations and guards
const sampleOfficeData = [
    { id: 1, locationId: 'LOC001', locationName: 'Location A', serviceNo: '00251', guardName: 'Ahmad Ali', attendanceDays: 22, allowancePercentage: 80, payableAllowance: 1600 },
    { id: 2, locationId: 'LOC001', locationName: 'Location A', serviceNo: '00252', guardName: 'Hassan Khan', attendanceDays: 25, allowancePercentage: 90, payableAllowance: 1800 },
    { id: 3, locationId: 'LOC002', locationName: 'Location B', serviceNo: '00253', guardName: 'Zaffar Khan', attendanceDays: 28, allowancePercentage: 95, payableAllowance: 1900 },
    { id: 4, locationId: 'LOC002', locationName: 'Location B', serviceNo: '00254', guardName: 'Ali Raza', attendanceDays: 20, allowancePercentage: 75, payableAllowance: 1500 },
    { id: 5, locationId: 'LOC003', locationName: 'Location C', serviceNo: '00255', guardName: 'Muhammad Usman', attendanceDays: 30, allowancePercentage: 100, payableAllowance: 2000 },
];

const AccountsOfficeAllowance = () => {
    const [officeData, setOfficeData] = useState(sampleOfficeData);
    const [showTable, setShowTable] = useState(false);

    const initialValues = {
        office: '',
        allowanceMonth: '',
        amountReceived: '',
        amountPayable: '',
    };

    const handleSubmit = (values, { resetForm }) => {
        console.log('Office Allowance:', values);
        resetForm();
        toast.success('Office Allowance Saved Successfully');
    };

    const calculateTotal = () => {
        setShowTable(true);
        toast.success('Office allowance calculated successfully');
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
                            {/* Select Office/Branch */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Office/Branch</label>
                                <Field as="select" name="office" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md">
                                    <option value="">Select</option>
                                    <option value="office1">Main Office</option>
                                    <option value="office2">Branch Office A</option>
                                    <option value="office3">Branch Office B</option>
                                </Field>
                                <ErrorMessage name="office" component="div" className="text-red-500 text-sm mt-1" />
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
                                    <Field type="number" name="amountReceived" placeholder="For all clients invoice Rs. 10000" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md" />
                                    <ErrorMessage name="amountReceived" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Amount Payable to Guards */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount Payable to Guards</label>
                                    <Field type="number" name="amountPayable" placeholder="For all guards Rs. 8800" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md" />
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

                        {/* Office Guards Table */}
                        {showTable && (
                            <div className="bg-formBGBlue rounded-2xl p-6">
                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                    <table className="min-w-full bg-white rounded-lg">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">
                                                    <input type="checkbox" className="rounded" />
                                                </th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Location ID</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Location Name</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Service No.</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Guard Name</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Attendance Days</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Allowance Percentage</th>
                                                <th className="px-2 py-2 text-xs font-medium text-gray-700 border border-gray-200">Payable Allowance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {officeData.map((guard, index) => (
                                                <tr key={guard.id} className="hover:bg-gray-50">
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        <input type="checkbox" className="rounded" />
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {guard.locationId}
                                                    </td>
                                                    <td className="px-2 py-2 text-xs text-gray-600 border border-gray-200 text-center">
                                                        {guard.locationName}
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

export default AccountsOfficeAllowance