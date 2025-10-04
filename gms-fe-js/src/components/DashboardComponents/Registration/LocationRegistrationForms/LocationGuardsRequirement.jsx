//Also known as guards requirements
import React, { useEffect, useState, useCallback } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCurrentUser } from '@/lib/hooks';
import { userRequest } from '@/lib/RequestMethods';

const LocationGuardsRequirement = ({ onNext, onPrevious, onSave, initialData = {} }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [createdGuardCategories, setCreatedGuardCategories] = useState([]);
  const [allShifts, setAllShifts] = useState([]);
  // fetchError will be a structured object with possible keys: guardCategories, shifts, message, timestamp
  const [fetchError, setFetchError] = useState(null);

  const validationSchema = Yup.object().shape({
    guards: Yup.array().of(
      Yup.object().shape({
        guardCategoryId: Yup.string().required("Required"),
        quantity: Yup.number()
          .typeError("Must be a number")
          .required("Required")
          .min(1, "Min 1"),
        shiftId: Yup.string().required("Required"),
        chargesPerMonth: Yup.number()
          .typeError("Must be a number")
          .required("Required")
          .min(0, "Cannot be negative"),
        overtimePerHour: Yup.number()
          .typeError("Must be a number")
          .required("Required")
          .min(0, "Cannot be negative"),
        allowance: Yup.number()
          .typeError("Must be a number")
          .required("Required")
          .min(0, "Cannot be negative"),
        gazettedHoliday: Yup.number().typeError("Must be a number").required("Required").min(0, "Cannot be negative")
      })
    )
  });

  // Ensure initial values have a proper guards array
  const defaultInitialValues = {
    guards: [{
      guardCategoryId: '',
      quantity: '',
      shiftId: '',
      chargesPerMonth: '',
      overtimePerHour: '',
      allowance: '',
      gazettedHoliday: ''
    }],
    ...initialData
  };


  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    // Fetch both guard categories and shifts in parallel but capture individual failures
    try {
      const requests = [
        { name: 'guardCategories', promise: userRequest.get('/guard-category/by-organization') },
        { name: 'shifts', promise: userRequest.get('/shifts') }
      ];

      const results = await Promise.allSettled(requests.map(r => r.promise));

      // Map results back to names
      results.forEach((res, idx) => {
        const name = requests[idx].name;
        if (res.status === 'fulfilled') {
          console.log(`✅ ${name} fulfilled:`, res.value?.data);
          const data = res.value?.data?.data;
          if (name === 'guardCategories') {
            if (Array.isArray(data) && data.length > 0) {
              setCreatedGuardCategories(data);
              console.debug(`Guard categories count: ${data.length}`);
            } else {
              console.warn('Guard categories response ok but no data array found', res.value?.data);
              setCreatedGuardCategories([]);
              setFetchError(prev => ({
                ...(prev || {}),
                guardCategories: {
                  status: 'no-data',
                  message: 'No guard categories returned',
                  response: res.value?.data
                },
                timestamp: Date.now()
              }));
            }
          } else if (name === 'shifts') {
            if (Array.isArray(data) && data.length > 0) {
              setAllShifts(data);
              console.debug(`Shifts count: ${data.length}`);
            } else {
              console.warn('Shifts response ok but no data array found', res.value?.data);
              setAllShifts([]);
              setFetchError(prev => ({
                ...(prev || {}),
                shifts: {
                  status: 'no-data',
                  message: 'No shifts returned',
                  response: res.value?.data
                },
                timestamp: Date.now()
              }));
            }
          }
        } else {
          // rejected
          console.error(`❌ ${name} request failed:`, res.reason);
          const status = res.reason?.response?.status;
          const message = res.reason?.response?.data?.message || res.reason?.message || String(res.reason);
          setFetchError(prev => ({
            ...(prev || {}),
            [name]: {
              status: status || 'error',
              message,
              raw: res.reason
            },
            timestamp: Date.now()
          }));
          if (name === 'guardCategories') setCreatedGuardCategories([]);
          if (name === 'shifts') setAllShifts([]);
        }
      });

    } catch (err) {
      // Shouldn't happen often because we use allSettled, but catch unexpected errors
      console.error('Unexpected error while fetching form data:', err);
      setFetchError(err?.message || 'Unexpected error while fetching form data');
      setCreatedGuardCategories([]);
      setAllShifts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  return (
    <div className="flex-1 bg-white p-8 rounded-xl">
      {/* Header */}
      <aside className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Details of Guards/ Employees Requested</h2>
          <div className="text-sm text-gray-500">Step 2 of 4</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-formButtonBlue h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </aside>

      <Formik
        initialValues={defaultInitialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // console.log('Guards Requirement Form Values:', values);
          onSave(values);
          onNext(values);
        }}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="guards">
              {({ push, remove }) => (
                <div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="p-2 text-left text-xs font-medium text-gray-700">Guard Category</th>
                          <th className="p-2 text-left text-xs font-medium text-gray-700">Nos. of Person</th>
                          <th className="p-2 text-left text-xs font-medium text-gray-700">Shift Type</th>
                          <th className="p-2 text-left text-xs font-medium text-gray-700">Charges/Month</th>
                          <th className="p-2 text-left text-xs font-medium text-gray-700">Overtime/Hour</th>
                          <th className="p-2 text-left text-xs font-medium text-gray-700">Allowance</th>
                          <th className="p-2 text-left text-xs font-medium text-gray-700">Gazeted Holiday</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">

                        {values.guards && values.guards.length > 0 && values.guards.map((guard, index) => (
                          <tr key={index}>
                            <td className="p-2 w-48">
                              <div>
                                <Field name={`guards.${index}.guardCategoryId`}>
                                  {({ field, form }) => (
                                    <select
                                      {...field}
                                      className={`w-full px-5 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                        isLoading ? 'cursor-wait opacity-50' : ''
                                      }`}
                                      disabled={isLoading}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        console.log('Selected guard category:', {
                                          value: e.target.value,
                                          category: createdGuardCategories.find(c => c.id === e.target.value)
                                        });
                                      }}
                                    >
                                      <option value="">Select Guard Category</option>
                                      {isLoading ? (
                                        <option disabled>Loading categories...</option>
                                      ) : createdGuardCategories.length > 0 ? (
                                        createdGuardCategories.map((cat) => (
                                          <option className='text-sm' value={cat.id} key={cat.id}>
                                            {cat.categoryName}
                                          </option>
                                        ))
                                      ) : (
                                        <option disabled>No guard categories available</option>
                                      )}
                                    </select>
                                  )}
                                </Field>
                                <ErrorMessage name={`guards.${index}.guardCategoryId`} component="div" className="text-red-500 text-xs" />
                              </div>
                            </td>
                            <td className="p-2 w-24">
                              <Field name={`guards.${index}.quantity`} type="number" placeholder="Enter" className="w-20 px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              <ErrorMessage name={`guards.${index}.quantity`} component="div" className="text-red-500 text-xs" />
                            </td>
                            <td className="p-2 w-40">
                              <div>
                                <Field name={`guards.${index}.shiftId`}>
                                  {({ field, form }) => (
                                    <select
                                      {...field}
                                      className={`w-full px-6 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                        isLoading ? 'cursor-wait opacity-50' : ''
                                      }`}
                                      disabled={isLoading}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        console.log('Selected shift:', {
                                          value: e.target.value,
                                          shift: allShifts.find(s => s.id === e.target.value)
                                        });
                                      }}
                                    >
                                      <option value="">Select Shift</option>
                                      {isLoading ? (
                                        <option disabled>Loading shifts...</option>
                                      ) : allShifts.length > 0 ? (
                                        allShifts.map((shift) => (
                                          <option key={shift.id} value={shift.id}>
                                            {shift.shiftName}
                                          </option>
                                        ))
                                      ) : (
                                        <option disabled>No shifts available</option>
                                      )}
                                    </select>
                                  )}
                                </Field>
                                <ErrorMessage name={`guards.${index}.shiftId`} component="div" className="text-red-500 text-xs" />
                              </div>
                            </td>
                            <td className="p-2 w-24">
                              <Field name={`guards.${index}.chargesPerMonth`} type="number" placeholder="Enter" className="w-20 px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              <ErrorMessage name={`guards.${index}.chargesPerMonth`} component="div" className="text-red-500 text-xs" />
                            </td>
                            <td className="p-2 w-24">
                              <Field name={`guards.${index}.overtimePerHour`} type="number" placeholder="Enter" className="w-20 px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              <ErrorMessage name={`guards.${index}.overtimePerHour`} component="div" className="text-red-500 text-xs" />
                            </td>
                            <td className="p-2 w-24">
                              <Field name={`guards.${index}.allowance`} type="number" placeholder="Enter" className="w-20 px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              <ErrorMessage name={`guards.${index}.allowance`} component="div" className="text-red-500 text-xs" />
                            </td>
                            <td className="p-2 w-24">
                              <Field name={`guards.${index}.gazettedHoliday`} type="number" placeholder="Enter" className="w-20 px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                              <ErrorMessage name={`guards.${index}.gazettedHoliday`} component="div" className="text-red-500 text-xs" />
                            </td>
                            <td className="px-1 py-3">
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    remove(index);
                                  } catch (err) {
                                    console.error('Error removing guard row at index', index, err);
                                    setFetchError(prev => ({ ...(prev || {}), removeError: { index, message: err?.message || String(err), timestamp: Date.now() } }));
                                    return;
                                  }
                                  setTimeout(() => {
                                    try {
                                      const updatedGuards = (values.guards || []).filter((_, i) => i !== index);
                                      onSave({ guards: updatedGuards });
                                    } catch (err) {
                                      console.error('Error calling onSave after remove:', err);
                                      setFetchError(prev => ({ ...(prev || {}), onSaveError: { action: 'remove', message: err?.message || String(err), timestamp: Date.now() } }));
                                    }
                                  }, 0);
                                }}
                                className="text-red-500 text-[13px]"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const newGuard = { guardCategoryId: '', quantity: '', shiftId: '', chargesPerMonth: '', overtimePerHour: '', allowance: '', gazettedHoliday: '' };
                        try {
                          push(newGuard);
                        } catch (err) {
                          console.error('Error pushing new guard row', err);
                          setFetchError(prev => ({ ...(prev || {}), pushError: { message: err?.message || String(err), timestamp: Date.now() } }));
                          return;
                        }
                        setTimeout(() => {
                          try {
                            onSave({ guards: [...(values.guards || []), newGuard] });
                          } catch (err) {
                            console.error('Error calling onSave after add:', err);
                            setFetchError(prev => ({ ...(prev || {}), onSaveError: { action: 'add', message: err?.message || String(err), timestamp: Date.now() } }));
                          }
                        }, 0);
                      }}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => onPrevious()}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-formBgLightBlue focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-formButtonBlue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  // No-op here; Formik handles submit. Keep for potential diagnostics.
                }}
              >
                Next
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LocationGuardsRequirement;