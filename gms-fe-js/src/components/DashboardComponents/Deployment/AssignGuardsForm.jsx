'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/FormHelpers/formatDate';
import { getCurrentDate, getCurrentTime } from '@/utils/FormHelpers/CurrentDateTime';
import { useCurrentUser } from '@/lib/hooks';


// Initial form values
const initialValues = {
    guardId: '',
    clientId: '',
    locationId: '',
    guardCategoryId: '',
    requestedGuardId: '',
};

// Validation schema
const validationSchema = Yup.object({
    guardId: Yup.string().required('Guard selection is required'),
    clientId: Yup.string().required('Client selection is required'),
    locationId: Yup.string().required('Location selection is required'),
    guardCategoryId: Yup.string().required('Guard category selection is required'),
});

const AssignGuardsForm = () => {
    const { user } = useCurrentUser();
    const [guards, setGuards] = useState([]);
    console.log(guards)
    const [selectedGuardId, setSelectedGuardId] = useState(null);
    const [clients, setClients] = useState([]);
    console.log(clients)
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [requestedGuards, setRequestedGuards] = useState([]);
    const [selectedRequestedGuard, setSelectedRequestedGuard] = useState(null);
    const [assignedGuardForLocation, setAssignedGuardForLocation] = useState(null);


    // Fetch guards data on component mount
    useEffect(() => {
        const getGuardsByOrganization = async () => {
            try {
                const res = await userRequest.get("/guards/by-organization");
                setGuards(res.data.data);
            } catch (error) {
                console.error("Error fetching guards:", error);
                toast.error("Failed to fetch guards data");
            }
        };
        getGuardsByOrganization();
    }, []);

    // Fetch clients data on component mount
    useEffect(() => {
        const getClients = async () => {
            try {
                console.log('Fetching clients...');
                const token = localStorage.getItem('token'); // Check if token exists
                console.log('Token exists:', !!token);
                
                const res = await userRequest.get("/clients/by-organization");
                console.log('Client response:', res);
                
                if (res.data && res.data.data) {
                    console.log('Client data:', res.data.data);
                    if (Array.isArray(res.data.data)) {
                        setClients(res.data.data);
                    } else {
                        console.error('Client data is not an array:', res.data.data);
                        toast.error('Invalid client data format received');
                    }
                } else {
                    console.error('Invalid response format:', res.data);
                    toast.error('Invalid response format from server');
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
                if (error.response) {
                    console.error("Error status:", error.response.status);
                    console.error("Error data:", error.response.data);
                    
                    // Handle specific error cases
                    if (error.response.status === 401) {
                        toast.error("Session expired. Please login again.");
                        // Consider redirecting to login here
                    } else {
                        toast.error(error.response.data.message || "Failed to fetch clients data");
                    }
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    toast.error("No response from server");
                } else {
                    console.error("Error setting up request:", error.message);
                    toast.error("Error setting up request");
                }
            }
        };
        getClients();
    }, []);

    // Fetch assigned guard data when selectedGuardId changes
    useEffect(() => {
        const getAssignedGuardForLocation = async () => {
            if (!selectedGuardId) {
                setAssignedGuardForLocation(null);
                return;
            }
            try {
                const res = await userRequest.get(`/guards/assigned-guard/${selectedGuardId}`);
                setAssignedGuardForLocation(res.data.data);
            } catch (error) {
                setAssignedGuardForLocation(null);
            }
        };
        getAssignedGuardForLocation();
    }, [selectedGuardId]);

    // Fetch requested guards when location changes
    useEffect(() => {
        const requestedGuardsByLocationId = async () => {
            if (!selectedLocationId) {
                setRequestedGuards([]);
                return;
            }

            try {
                const res = await userRequest.get(`/location/requested-guards/${selectedLocationId}`);
                setRequestedGuards(res.data.data);
            } catch (error) {
                console.error("Error fetching requested guards:", error);
                toast.error("Failed to fetch requested guards");
                setRequestedGuards([]);
            }
        };
        
        requestedGuardsByLocationId();
    }, [selectedLocationId]);


    const handleSubmit = async (values, { setSubmitting, resetForm }) => {

        const assignGuardsPayload = {
            guardId: values.guardId,
            locationId: values.locationId,
            guardCategoryId: values.guardCategoryId,
            requestedGuardId: selectedRequestedGuard?.id,
            guardCategoryId: selectedRequestedGuard?.guardCategory?.id,
        }

        try {

            const res = await userRequest.post('/guards/assign-guard', assignGuardsPayload);

            toast.success('Guard assigned successfully');


            resetForm();
        } catch (error) {
            console.log('Error:', error);
            const errorMessage = await error?.response?.data?.message;
            if (errorMessage === "requestedGuardId must be unique.") {
                toast.error("Guard already assigned to this location");
            }
            else {
                toast.error(`Error: ${errorMessage}`);
            }

        }

        setSubmitting(false);

    };

    const handleCancel = (resetForm) => {
        // Reset form
        resetForm();
    };

    const handleClientChange = (e, setFieldValue) => {
        const clientId = e.target.value;
        const client = clients.find((client) => client.id === clientId);
        setSelectedClient(client);
        setFieldValue('clientId', clientId);
        // Reset location when client changes
        setSelectedLocationId(null);
        setFieldValue('locationId', '');
        setRequestedGuards([]);

    }


    // Render assignment info for selected guard
    const renderAssignmentInfo = () => {
        if (!assignedGuardForLocation) return null;
        const assignment = assignedGuardForLocation;
        // Find client and location names from IDs
        let clientName = 'N/A';
        let locationName = 'N/A';
        if (assignment.clientId && Array.isArray(clients)) {
            const clientObj = clients.find(c => c.id === assignment.clientId);
            clientName = clientObj?.companyName || clientObj?.contractNumber || assignment.clientId || 'N/A';
        }
        if (assignment.locationId && selectedClient && Array.isArray(selectedClient.locations)) {
            const locationObj = selectedClient.locations.find(l => l.id === assignment.locationId);
            locationName = locationObj?.locationName || assignment.locationId || 'N/A';
        }
        const deploymentDate = assignment.deploymentDate ? new Date(assignment.deploymentDate) : null;
        const deploymentTill = assignment.deploymentTill ? new Date(assignment.deploymentTill) : null;
        let totalWorkingDays = '';
        if (deploymentDate) {
            const endDate = deploymentTill || new Date();
            const diffTime = Math.abs(endDate - deploymentDate);
            totalWorkingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return (
            <div className="my-6">
                <table className="w-full border-collapse bg-gray-50 rounded-xl overflow-hidden">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="py-2 px-4">Client</th>
                            <th className="py-2 px-4">Location Name</th>
                            <th className="py-2 px-4">Deployment Date</th>
                            <th className="py-2 px-4">Deployed Till</th>
                            <th className="py-2 px-4">Total Working Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white">
                            <td className="py-2 px-4 text-center">{clientName}</td>
                            <td className="py-2 px-4 text-center">{locationName}</td>
                            <td className="py-2 px-4 text-center">{deploymentDate ? deploymentDate.toLocaleDateString() : 'N/A'}</td>
                            <td className="py-2 px-4 text-center">{deploymentTill ? deploymentTill.toLocaleDateString() : 'Till Date'}</td>
                            <td className="py-2 px-4 text-center">{totalWorkingDays}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

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
                            <span className="text-gray-900 font-medium">Assign Guard</span>
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
                    {({ values, errors, touched, isSubmitting, resetForm, setFieldValue }) => (
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
                                    <label className="block text-sm font-medium text-themeGray mb-2">
                                        Time
                                    </label>
                                    <div className="px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-500">
                                        {getCurrentTime()}
                                    </div>
                                </div>
                            </div>

                            {/* Tag Guard Section */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium text-gray-900">Tag Guard with Location</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SERVICE. No.
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="guardId"
                                                onChange={(e) => {
                                                    const guardId = e.target.value;
                                                    setFieldValue('guardId', guardId);
                                                    setSelectedGuardId(guardId);
                                                }}
                                                className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                                    errors.guardId && touched.guardId
                                                        ? 'border-red-500'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <option value="">Select Service Number</option>
                                                {Array.isArray(guards) && guards.length > 0 ? (
                                                    guards.map((guard) => (
                                                        <option key={guard.id} value={guard.id}>
                                                            {guard.serviceNumber}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>No guards available</option>
                                                )}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            {errors.guardId && touched.guardId && (
                                                <div className="text-red-500 text-sm mt-1">{errors.guardId}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guard Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                readOnly
                                                value={guards?.find((guard) => guard.id === values.guardId)?.fullName || ''}
                                                className="w-full px-4 py-3 bg-formBgLightBlue border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Guard name will appear here"
                                            />
                                            {errors.guardId && touched.guardId && (
                                                <div className="text-red-500 text-sm mt-1">{errors.guardId}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Assignment Info Table */}
                                {renderAssignmentInfo()}

                                {/* Bottom Form Section */}
                                <div className="grid grid-cols-3 gap-6">
                                    {/* clientId field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Client ID
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="clientId"
                                                onChange={(e) => {
                                                    const clientId = e.target.value;
                                                    console.log('Selected client ID:', clientId);
                                                    
                                                    // Find the selected client with its locations
                                                    const client = clients.find((c) => c.id === clientId);
                                                    console.log('Found client:', client);
                                                    
                                                    // Update form and state
                                                    setFieldValue('clientId', clientId);
                                                    setSelectedClient(client);
                                                    
                                                    // Reset location-related states
                                                    setFieldValue('locationId', '');
                                                    setFieldValue('guardCategoryId', '');
                                                    setSelectedLocationId(null);
                                                    setSelectedRequestedGuard(null);
                                                    setRequestedGuards([]);
                                                }}
                                                className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                                    errors.clientId && touched.clientId
                                                        ? 'border-red-500'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <option value="">Select Client</option>
                                                {Array.isArray(clients) ? (
                                                    clients.length > 0 ? (
                                                        clients.map((client) => {
                                                            console.log('Rendering client:', client);
                                                            return (
                                                                <option key={client.id} value={client.id} className='text-sm'>
                                                                    {client.contractNumber ? String(client.contractNumber) : 'N/A'} ({client.companyName || 'Unknown'})
                                                                </option>
                                                            );
                                                        })
                                                    ) : (
                                                        <option disabled>No clients available</option>
                                                    )
                                                ) : (
                                                    <option disabled>Loading clients...</option>
                                                )}
                                            </Field>

                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            {errors.clientId && touched.clientId && (
                                                <div className="text-red-500 text-sm mt-1">{errors.clientId}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location ID
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="locationId"
                                                disabled={!selectedClient}
                                                onChange={(e) => {
                                                    const locationId = e.target.value;
                                                    console.log('Selected location ID:', locationId);
                                                    
                                                    // Update form and state
                                                    setFieldValue('locationId', locationId);
                                                    setSelectedLocationId(locationId);
                                                    
                                                    // Reset category-related states
                                                    setFieldValue('guardCategoryId', '');
                                                    setSelectedRequestedGuard(null);
                                                    
                                                    console.log('Updated location state:', {
                                                        locationId,
                                                        selectedClient,
                                                        selectedLocation: selectedClient?.location?.find(l => l.id === locationId)
                                                    });
                                                }}
                                                className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                                    errors.locationId && touched.locationId
                                                        ? 'border-red-500'
                                                        : 'border-gray-200'
                                                } ${!selectedClient ? 'cursor-not-allowed opacity-50' : ''}`}
                                            >
                                                <option value="">Select Location</option>
                                                {selectedClient ? (
                                                    Array.isArray(selectedClient.location) && selectedClient.location.length > 0 ? (
                                                        selectedClient.location.map((location) => {
                                                            console.log('Rendering location:', location);
                                                            return (
                                                                <option key={location.id} value={location.id}>
                                                                    {location.locationName} - ({location.createdLocationId || 'N/A'})
                                                                </option>
                                                            );
                                                        })
                                                    ) : (
                                                        <option disabled>No locations available for this client</option>
                                                    )
                                                ) : (
                                                    <option disabled>Select a client first</option>
                                                )}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            {errors.locationId && touched.locationId && (
                                                <div className="text-red-500 text-sm mt-1">{errors.locationId}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assign Category
                                        </label>
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="guardCategoryId"
                                                disabled={!selectedLocationId}
                                                onChange={(e) => {
                                                    const guardCategoryId = e.target.value;
                                                    setFieldValue('guardCategoryId', guardCategoryId);
                                                    
                                                    // Find the selected requested guard
                                                    const selectedGuard = requestedGuards.find(
                                                        guard => guard.guardCategory.id === guardCategoryId
                                                    );
                                                    setSelectedRequestedGuard(selectedGuard);
                                                }}
                                                className={`w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                                    errors.guardCategoryId && touched.guardCategoryId
                                                        ? 'border-red-500'
                                                        : 'border-gray-200'
                                                } ${!selectedLocationId ? 'cursor-not-allowed opacity-50' : ''}`}
                                            >
                                                <option value="">Select Category</option>
                                                {selectedLocationId && Array.isArray(requestedGuards) && requestedGuards.length > 0 ? (
                                                    requestedGuards.map((requestedGuard) => (
                                                        <option
                                                            key={requestedGuard.guardCategory.id}
                                                            value={requestedGuard.guardCategory.id}
                                                        >
                                                            {requestedGuard.guardCategory.categoryName} 
                                                            ({requestedGuard.guardCount} guards requested)
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>
                                                        {selectedLocationId ? 'No guard categories requested' : 'Select a location first'}
                                                    </option>
                                                )}
                                            </Field>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            {errors.guardCategoryId && touched.guardCategoryId && (
                                                <div className="text-red-500 text-sm mt-1">{errors.guardCategoryId}</div>
                                            )}
                                        </div>
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
                {assignedGuardForLocation && assignedGuardForLocation?.id && (
                    <>
                        <h2 className="text-lg font-medium text-gray-900 pt-5 pb-2 pl-2">Assigned Guard Details
                        </h2>

                        <div className="rounded-2xl bg-formBGBlue p-6">


                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Client ID</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Location ID</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Deployment Date</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Deployed Till</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Total Working Days</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white rounded-2xl'>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-3 px-4 text-gray-600">{assignedGuardForLocation?.location?.clientId.slice(0, 4)}</td>
                                            <td className="py-3 px-4 text-gray-600">{assignedGuardForLocation?.location?.createdLocationId}</td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {formatDate(assignedGuardForLocation?.deploymentDate)}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {formatDate(assignedGuardForLocation?.deploymentTill)}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{assignedGuardForLocation?.totalWorkingDays}</td>
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

export default AssignGuardsForm;