import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LocationSetupInvoice = ({ onNext, onPrevious, onSave, initialData = {}, onComplete }) => {
  const validationSchema = Yup.object().shape({
    taxes: Yup.array().of(
      Yup.object().shape({
        taxType: Yup.string().required('Tax type is required'),
        percentage: Yup.number().nullable(),
        amount: Yup.number().nullable(),
        addInvoice: Yup.boolean(),
      }).test('percentage-or-amount', 'Please fill either percentage or amount, not both', function (value) {
        const { percentage, amount } = value;
        const hasPercentage = percentage !== null && percentage !== '' && !isNaN(percentage);
        const hasAmount = amount !== null && amount !== '' && !isNaN(amount);

        if (hasPercentage && hasAmount) {
          return this.createError({ message: 'Please fill either percentage or amount, not both' });
        }
        if (!hasPercentage && !hasAmount) {
          return this.createError({ message: 'Please fill either percentage or amount' });
        }
        return true;
      })
    )
  });

  // Ensure initial values have a proper taxes array
  const defaultInitialValues = {
    taxes: [{ taxType: '', percentage: '', amount: '', addInvoice: true }],
    ...initialData
  };

  const handleFieldChange = (setFieldValue, index, field, value) => {
    // Ensure only numeric values
    if (value !== '' && isNaN(value)) {
      return;
    }

    // If user is entering percentage, clear amount and vice versa
    if (field === 'percentage' && value !== '') {
      setFieldValue(`taxes.${index}.amount`, '');
    } else if (field === 'amount' && value !== '') {
      setFieldValue(`taxes.${index}.percentage`, '');
    }

    setFieldValue(`taxes.${index}.${field}`, value);
  };

  return (
    <div className="flex-1 bg-white p-8 rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Setup Invoice</h2>
          <div className="text-sm text-gray-500">Step 4 of 4</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-formButtonBlue h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
      <Formik
        initialValues={defaultInitialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // console.log('Setup Invoice Form Values:', values);
          onSave(values);
          if (onComplete) {
            onComplete(values);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <FieldArray name="taxes">
              {({ push, remove }) => (
                <div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tax Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Percentage %</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount in Figure</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Add in Invoice</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {values.taxes && values.taxes.length > 0 && values.taxes.map((tax, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <Field name={`taxes.${index}.taxType`} type="text" placeholder="GST" className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              <ErrorMessage name={`taxes.${index}.taxType`} component="div" className="text-red-500 text-sm mt-1" />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                placeholder="18"
                                value={tax.percentage || ''}
                                onChange={(e) => handleFieldChange(setFieldValue, index, 'percentage', e.target.value)}
                                className={`w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${tax.amount ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!!tax.amount}
                              />
                              <ErrorMessage name={`taxes.${index}.percentage`} component="div" className="text-red-500 text-sm mt-1" />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                placeholder="150"
                                value={tax.amount || ''}
                                onChange={(e) => handleFieldChange(setFieldValue, index, 'amount', e.target.value)}
                                className={`w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${tax.percentage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!!tax.percentage}
                              />
                              <ErrorMessage name={`taxes.${index}.amount`} component="div" className="text-red-500 text-sm mt-1" />
                            </td>
                            <td className="px-4 py-3">
                              <Field name={`taxes.${index}.addInvoice`} type="checkbox" className="w-4 h-4 text-formButtonBlue border-gray-300 rounded focus:ring-blue-500" />
                            </td>
                            <td className="px-4 py-3">
                              <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => push({ taxType: '', percentage: '', amount: '', addInvoice: true })}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-formBgLightGreen"
                    >
                      + Add Row
                    </button>
                  </div>
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
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LocationSetupInvoice;