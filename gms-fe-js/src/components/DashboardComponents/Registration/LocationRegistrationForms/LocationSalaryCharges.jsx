import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { userRequest } from '@/lib/RequestMethods';

const LocationSalaryCharges = ({ onNext, onPrevious, onSave, initialData = {}, guardsData = [] }) => {

  const [createdGuardCategories, setCreatedGuardCategories] = useState(null);
  // Use guardsData from previous step if available, otherwise fallback to initialData or defaultGuardTypes
  const defaultGuardTypes = [
    {
      guardCategoryId: 'N/A',
      chargesPerMonth: '0',
      overtimePerHour: '0',
      allowance: '0',
      gazettedHoliday: '0',
      finSalaryPerMonth: '',
      finGazettedHoliday: '',
      finOvertimePerHour: '',
      finAllowance: ''
    },

  ];

  // Map guardsData to the structure needed for charges if guardsData is available
  const mappedGuards = guardsData.length > 0
    ? guardsData.map(g => ({
      guardCategoryId: g.guardCategoryId,
      chargesPerMonth: g.chargesPerMonth,
      overtimePerHour: g.overtimePerHour,
      allowance: g.allowance,
      gazettedHoliday: g.gazettedHoliday,
      // Finance fields (to be filled by user)
      finSalaryPerMonth: '',
      finGazettedHoliday: '',
      finOvertimePerHour: '',
      finAllowance: ''
    }))
    : null;


  const validationSchema = Yup.object().shape({
    charges: Yup.array().of(
      Yup.object().shape({
        finSalaryPerMonth: Yup.number().required('Required'),
        finGazettedHoliday: Yup.number().required('Required'),
        finOvertimePerHour: Yup.number().required('Required'),
        finAllowance: Yup.number().required('Required'),
      })
    )
  });


  useEffect(() => {

    const getCreatedGuardCategories = async () => {

      const res = await userRequest.get("/guard-category/by-organization");
      setCreatedGuardCategories(res.data.data);

    }

    getCreatedGuardCategories();

  }, []);

  function GuardCategoryName({ guardCategoryId }) {
    const [name, setName] = useState("Loading...");

    useEffect(() => {
      async function fetchCategory() {
        try {
          const res = await userRequest.get(`guard-category/${guardCategoryId}`);
          setName(res.data.data.categoryName);
        } catch (error) {
          setName("Empty");
        }
      }
      fetchCategory();
    }, [guardCategoryId]);

    return <span>{name}</span>;
  }


  return (
    <div className="flex-1 bg-white p-8 rounded-[9px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Salary/Charges Breakup for Office Use (Guards)</h2>
          <div className="text-sm text-gray-500">Step 3 of 4</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-formButtonBlue h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>
      <Formik
        initialValues={initialData.charges ? initialData : { charges: mappedGuards || defaultGuardTypes }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // console.log('Salary Charges Form Values:', values);
          onSave(values);
          onNext(values);
        }}
      >
        {({ values }) => (
          <Form>
            <FieldArray name="charges">
              {() => (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-gray-700">Guard Category</th>
                        <th className="p-2 text-left text-xs font-medium text-gray-700">Charges/Month</th>
                        <th className="p-2 text-left text-xs font-medium text-gray-700">Overtime/Hour</th>
                        <th className="p-2 text-left text-xs font-medium text-gray-700">Allowance</th>
                        <th className="p-2 text-left text-xs font-medium text-gray-700">Gazeted Holiday</th>
                        <th className="p-2 text-left text-xs font-medium text-blue-700">Finance - Salary/Month</th>
                        <th className="p-2 text-left text-xs font-medium text-blue-700">Finance - Overtime/Hour</th>
                        <th className="p-2 text-left text-xs font-medium text-blue-700">Finance - Allowance</th>
                        <th className="p-2 text-left text-xs font-medium text-blue-700">Finance - Gazetted Holiday</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {values.charges && values.charges.length > 0 && values.charges.map((charge, index) => (
                        <tr key={index}>
                          <td className="p-2">
                            <div className="flex items-center text-sm bg-formBgLightGreen px-1 py-2 rounded-[9px]">
                              {/* <span>{charge.guardCategoryId}</span> */}
                              {/* //We are sending guardCateforyId to api but to display user we are displaying the id */}
                              <GuardCategoryName guardCategoryId={charge.guardCategoryId} />
                            </div>
                          </td>
                          <td className="p-2  ">
                            <div className="flex items-center text-sm bg-formBgLightGreen px-1 py-2 rounded-[9px]">
                              <span>{charge.chargesPerMonth}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center text-sm bg-formBgLightGreen px-1 py-2 rounded-[9px]">
                              <span>{charge.overtimePerHour}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center text-sm bg-formBgLightGreen px-1 py-2 rounded-[9px]">
                              <span>{charge.allowance}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center text-sm bg-formBgLightGreen px-1 py-2 rounded-[9px]">
                              <span>{charge.gazettedHoliday}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <Field
                              name={`charges.${index}.finSalaryPerMonth`}
                              type="number"
                              placeholder="Enter"
                              className="w-full px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`charges.${index}.finSalaryPerMonth`} component="div" className="text-red-500 text-xs" />
                          </td>

                          <td className="p-2">
                            <Field
                              name={`charges.${index}.finOvertimePerHour`}
                              type="number"
                              placeholder="Enter "
                              className="w-full px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`charges.${index}.finOvertimePerHour`} component="div" className="text-red-500 text-xs" />
                          </td>
                          <td className="p-2">
                            <Field
                              name={`charges.${index}.finAllowance`}
                              type="number"
                              placeholder="Enter"
                              className="w-full px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`charges.${index}.finAllowance`} component="div" className="text-red-500 text-xs" />
                          </td>
                          <td className="p-2">
                            <Field
                              name={`charges.${index}.finGazettedHoliday`}
                              type="number"
                              placeholder="Enter "
                              className="w-full px-2 py-2 text-sm bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <ErrorMessage name={`charges.${index}.finGazettedHoliday`} component="div" className="text-red-500 text-xs" />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </FieldArray>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => onPrevious()}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-formButtonBlue text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default LocationSalaryCharges;
