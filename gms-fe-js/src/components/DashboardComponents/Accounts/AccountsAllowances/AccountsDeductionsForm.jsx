import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { userRequest } from '@/lib/RequestMethods';
import { deductionTypes } from '@/constants/FormConstantFields';
import { getCurrentDateISO } from '@/utils/FormHelpers/formatDate';

// Deductions Form Component
const DeductionsForm = () => {
    const [guards, setGuards] = useState([]);
    const [selectedGuardId, setSelectedGuardId] = useState('');
    const deductionSchema = Yup.object({
        guardId: Yup.string().required('Guard Service Number is required'),
        deductionType: Yup.string().required('Deduction Type is required'),
        amount: Yup.number().min(1, 'Amount must be greater than 0').required('Amount is required'),
    });


    const initialValues = {
        guardId: '',
        deductionType: '',
        amount: 0,
    };


    useEffect(() => {
        const getGuardsByOrganization = async () => {
            try {
                const res = await userRequest.get("/guards/by-organization");
                setGuards(res.data.data);
                console.log("guards", guards)

            } catch (error) {
                console.log(error)
            }
        }

        getGuardsByOrganization();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        console.log('Deduction:', values);
        const deductionPayload = {
            guardId: values.guardId,
            deductionType: values.deductionType,
            amount: values.amount,
            date: getCurrentDateISO(),
        }

        try {
            const res = await userRequest.post('/accounts/guard-deduction/create', deductionPayload);
            console.log("res", res)
            toast.success(`Deduction of ${values.amount} for ${values.deductionType} Saved Successfully`);
            resetForm();
        } catch (error) {
            console.log(error)
            toast.error('Deduction Not Saved');
        }

    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={deductionSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, resetForm, setFieldValue }) => (
                <Form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Service Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service Number</label>
                            <Field as="select"
                                name="guardId"
                                onChange={(e) => {
                                    const guardId = e.target.value;
                                    setFieldValue('guardId', guardId);
                                    setSelectedGuardId(guardId);
                                }}
                                className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md">
                                <option value="" className='text-[12px]'>Select</option>
                                {guards.map((guard) => (
                                    <option key={guard.id} value={guard.id}>{guard.serviceNumber} - {guard.fullName}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="guardId" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        {/* Guard/Employee Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Guard / Employee Name</label>
                            <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-black">
                                {selectedGuardId ? guards.find(guard => guard.id === selectedGuardId)?.fullName : 'Auto'}
                            </div>
                        </div>
                        {/* Deduction Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Deduction Type</label>
                            <Field as="select" name="deductionType" className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md">
                                <option value="" disabled>Select</option>
                                {deductionTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="deductionType" component="div" className="text-red-500 text-sm mt-1" />
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
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default DeductionsForm;  