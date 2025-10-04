'use client';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ChevronDown } from 'lucide-react';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/FormHelpers/formatDate';
import { getCurrentDate, getCurrentTime } from '@/utils/FormHelpers/CurrentDateTime';
import { useCurrentUser } from '@/lib/hooks';

const AssignSuperVisor = () => {
    const { user } = useCurrentUser();

    const [allAssignedGuards, setAllAssignedGuards] = useState([]);
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [assignedSupervisor, setAssignedSupervisor] = useState(null);

    const validationSchema = Yup.object({
        guardId: Yup.string().required('Service No. is required'),
        clientId: Yup.string().required('Client ID is required'),
        locationId: Yup.string().required('Location ID is required'),

    });

    const initialValues = {

    clientId: '',
    locationId: '',
    guardId: '',

    };

    // Mock data for the table
    const assignments = [
        {
            sNo: '01',
            clientId: 'K001-001',
            locationId: 'K001-001',
            deploymentDate: '1/1/2025',
            deployedTill: 'Deployed Till',
            totalWorkingDays: '36',
            action: 'Disable'
        },

    ];

    useEffect(() => {

        console.log(selectedSupervisorId);
    }, [selectedClient, selectedSupervisorId]);

    useEffect(() => {


        // Fetch all assigned guards for service number select box
        const getAssignedGuards = async () => {
            try {
                const res = await userRequest.get("/guards/by-organization");
                setAllAssignedGuards(res.data.data);
            } catch (error) {
                console.log(error);
            }
        }

        const getClients = async () => {
            try {
                const res = await userRequest.get("/clients/by-organization");
                setClients(res.data.data);

            } catch (error) {
                console.log(error)
            }
        }

        const getAssignedSupervisor = async () => {
            const res = await userRequest.get(`/employee/get-assigned-supervisors/${selectedSupervisorId}`)
            //the selected supervisor id means the document id of the employee same name
            console.log(res.data.data);
            setAssignedSupervisor(res.data.data);
        }

    getAssignedGuards();
        getClients();
        selectedSupervisorId && getAssignedSupervisor();

    }, [selectedSupervisorId])

    const getSelectedSupervisorName = () => {
        const guard = allAssignedGuards.find(guard => guard.id === selectedSupervisorId);
        return guard?.fullName || "Select Service No.";
    }

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        const client = clients.find((client) => client.id === clientId);
        setSelectedClient(client);

    }


    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        // Handle form submission
        // Prepare payload for guard supervisor assignment
        const payload = {
            guardId: values.guardId,
            clientId: values.clientId,
            locationId: values.locationId
        };
        try {
            const res = await userRequest.post(`/guards/promote-to-supervisor/${values.guardId}`, payload);
            console.log('Successfully assigned supervisor', res.data);
            toast.success('Successfully assigned supervisor');
        } catch (error) {
            const errMessage = error?.response?.data?.message;
            console.log(errMessage);
            toast.error(errMessage);
        }
        setSelectedSupervisorId('');
        setSubmitting(false);
        resetForm();
    };

    const handleCancel = (resetForm) => {
        setSelectedSupervisorId('');
        resetForm();
    };

    const changeSupervisorActiveStatus = async (assignedSupervisorId, isActive) => {
        try {
            const res = await userRequest.patch(`/employee/update-assigned-supervisor/${assignedSupervisorId}?assignedSupervisorId=${assignedSupervisorId}`, {
                isActive: !isActive
            });
            console.log(res.data);
            toast.success('Successfully updated supervisor active status');

            setAssignedSupervisor((prev) => ({ ...prev, isActive: !isActive }));
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-formBGBlue flex flex-col w-full px-4 pt-4">
            {/* Breadcrumb */}
            <div className="w-full max-w-7xl">
                <aside className="bg-white border-b rounded-xl border-gray-200">
                    <div className="px-6 py-4">
                        <article className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <span>&gt;</span>
                            <span>Deployment</span>
                            <span>&gt;</span>
                            <span className="text-gray-900 font-medium">Assign Supervisor</span>
                        </article>
                    </div>
                </aside>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-md mt-8 p-8">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting, resetForm, setFieldValue }) => (
                        <Form className="space-y-8">
                            {/* Auto Fields Row */}
                            <div className="grid grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Office ID
                                    </label>
                                    <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                        {user?.id?.slice(0, 8)}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Staff ID
                                    </label>
                                    <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                        Auto
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                        {formatDate(getCurrentDate())}
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

                            {/* Tag Supervisor Section */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium text-gray-900">Tag Supervisor with Locations</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service No.
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="guardId"
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    setSelectedSupervisorId(selectedId);
                                                    setFieldValue('guardId', selectedId);
                                                }}
                                                className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${errors.guardId && touched.guardId
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <option value="">Select</option>
                                                {/* showing assigned guard service number but sending guard id     */}
                                                {allAssignedGuards?.map((guard) => (
                                                    <option key={guard.id} value={guard.id}>{guard.serviceNumber}</option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <ErrorMessage name="guardId" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Supervisor Name
                                        </label>
                                        <div className="relative">
                                            <div className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md text-gray-800">
                                                {getSelectedSupervisorName()}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Form Section */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Client ID
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="clientId"
                                                className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${errors.clientId && touched.clientId
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                    }`}
                                                onChange={(e) => {
                                                    setFieldValue('clientId', e.target.value);
                                                    handleClientChange(e);

                                                }}
                                            >
                                                <option value="">Select</option>
                                                {/* sending client id but showing contract number */}
                                                {clients?.map((client) => (
                                                    <option key={client.id} value={client.id}>{client.contractNumber}</option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <ErrorMessage name="clientId" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location ID
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="locationId"
                                                className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${errors.locationId && touched.locationId
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <option value="">Select</option>

                                                {selectedClient?.location?.map((location) => (
                                                    <option key={location.id} value={location.id}>{location.locationName}</option>
                                                ))}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <ErrorMessage name="locationId" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-center space-x-4 pt-8">
                                    <button
                                        type="button"
                                        onClick={() => handleCancel(resetForm)}
                                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* Table - Outside Formik */}
                {assignedSupervisor && assignedSupervisor?.id && (
                    <>
                        <h2 className="text-lg font-medium text-gray-900 pt-5 pb-2 pl-2">Assigned Supervisor Details
                        </h2>

                        <div className="rounded-2xl bg-formBGBlue p-6">


                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">S.NO</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Client ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Location ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Deployment Date</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Deployed Till</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Total Working Days</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white'>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-gray-600">1</td>
                                        <td className="py-3 px-4 text-gray-600">{assignedSupervisor?.client?.contractNumber}</td>
                                        <td className="py-3 px-4 text-gray-600">{assignedSupervisor?.location?.createdLocationId}</td>
                                        <td className="py-3 px-4 text-gray-600">{formatDate(assignedSupervisor?.deploymentDate)}</td>
                                        <td className="py-3 px-4 text-gray-600">{(assignedSupervisor?.deploymentTill !== null ? formatDate(assignedSupervisor?.deploymentTill) : "Present")}</td>
                                        <td className="py-3 px-4 text-gray-600 ">{assignedSupervisor?.totalWorkingDays}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => changeSupervisorActiveStatus(assignedSupervisor.id, assignedSupervisor.isActive)}
                                                className={`px-2 py-1 bg-[#FF3B30] text-white text-[11px] rounded-[100px]  ${assignedSupervisor?.isActive ? 'bg-red-600' : 'bg-green-600'} ${assignedSupervisor.isActive ? 'hover:bg-red-500' : 'hover:bg-green-500'}`}>
                                                {assignedSupervisor?.isActive ? "Disable" : "Enable"}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AssignSuperVisor;