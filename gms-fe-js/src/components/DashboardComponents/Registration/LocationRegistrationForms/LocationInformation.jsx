import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { userRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';

const LocationInformation = ({ onNext, onPrevious, onSave, initialData = {} }) => {
  const [myClients, setMyClients] = useState(null);
  const [myOffices, setMyOffices] = useState(null);
  const [locationTypes, setMyLocationTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const validationSchema = Yup.object({
    clientId: Yup.string().required('Client is required'),
    officeId: Yup.string().required('Office ID is required'),
    locationName: Yup.string().required('Location Name is required'), 
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    provinceState: Yup.string().required('Province/State is required'),
    country: Yup.string().required('Country is required'),
    GPScoordinate: Yup.string(),
    locationTypeId: Yup.string(),
    authorizedPersonName: Yup.string().required('Authorized Person Name is required'),
    authorizedPersonNumber: Yup.string().required('Authorized Person Number is required'),
    authorizedPersonDesignation: Yup.string().required('Authorized Person Designation is required'),
  });

  // Sample clients data (replace with actual data from your API)
  const sampleClients = [
    { id: 1, name: "ABC Corporation" },
    { id: 2, name: "XYZ Industries" },
    { id: 3, name: "Global Tech Solutions" },
    { id: 4, name: "Metro Security Services" },
    { id: 5, name: "Citywide Protection" }
  ];

  // Ensure initial values have all required fields with default empty strings
  const defaultInitialValues = {
    clientId: '',
    officeId: '',
    locationName: '',
    address: '',
    city: '',
    provinceState: '',
    country: '',
    GPScoordinate: '',
    locationTypeId: '',
    authorizedPersonName: '',
    authorizedPersonNumber: '',
    authorizedPersonDesignation: '',
    ...initialData
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch location types first
        console.log('🔍 Starting location types fetch...');
        const locationTypesRes = await userRequest.get("/location-type");
        console.log('📥 Raw API Response:', locationTypesRes);
        console.log('📦 Response Data Structure:', JSON.stringify(locationTypesRes.data, null, 2));
        
        if (locationTypesRes.data?.data?.length > 0) {
          console.log('✅ Found existing location types:', locationTypesRes.data.data.length);
          console.log('📋 Types:', locationTypesRes.data.data.map(t => ({ id: t.id, type: t.type })));
          setMyLocationTypes(locationTypesRes.data.data);
        } else {
          console.log('⚠️ No location types found, creating defaults...');
          setMyLocationTypes([]);
          try {
            const defaultTypes = [
              { type: 'Office' },
              { type: 'Warehouse' },
              { type: 'Factory' },
              { type: 'Retail' },
              { type: 'Residential' }
            ];
            
            console.log('🔧 Creating default types:', defaultTypes);
            const createdTypes = await Promise.all(
              defaultTypes.map(type => userRequest.post('/location-type', type))
            );
            console.log('✨ Created types response:', createdTypes.map(res => res.data));
            
            // Fetch all types again after creation
            console.log('🔄 Re-fetching all location types...');
            const newTypesRes = await userRequest.get("/location-type");
            if (newTypesRes.data?.data?.length > 0) {
              console.log('✅ Successfully loaded new types:', newTypesRes.data.data.length);
              setMyLocationTypes(newTypesRes.data.data);
            } else {
              console.error('❌ Still no location types after creation!');
              toast.error('Failed to load location types');
            }
          } catch (error) {
            console.error('❌ Error managing location types:', error);
            toast.error('Failed to set up location types');
          }
        }

        // Fetch clients
        const clientsRes = await userRequest.get("/clients/by-organization");
        setMyClients(clientsRes.data.data || []);

        // Fetch offices
        const officesRes = await userRequest.get("/organizations/get-offices");
        setMyOffices(officesRes.data.data || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch form data');
        // Set empty arrays as fallback
        setMyLocationTypes([]);
        setMyClients([]);
        setMyOffices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [])

  return (
    <div className="flex-1 bg-white p-8 rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Location Information</h2>
          <div className="text-sm text-gray-500">Step 1 of 4</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-formButtonBlue h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>
      </div>
      <Formik
        initialValues={defaultInitialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // console.log('Location Information Form Values:', values); 
          onSave(values);
          onNext(values);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field name="clientId">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
                    <select {...field} className="w-full px-4 py-3 bg-gray-50 cursor-pointer border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      {myClients?.map(client => (
                        <option key={client.id} value={client.id} >
                          {`${client.companyName} (ID: ${client.id.slice(0, 8)}...)`}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage name="clientId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
              <Field name="officeId">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Office ID</label>
                    <select {...field} className="w-full px-4 py-3 bg-gray-50 cursor-pointer border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      {myOffices?.map(office => (
                        <option key={office.id} value={office.id} >
                          {`${office.branchName} (ID: ${office.id.slice(0, 8)}...)`}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage name="officeId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
             
              <Field name="locationName">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                    <input {...field} placeholder="Enter Location Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="locationName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
              <Field name="address">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input {...field} placeholder="Enter Address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
              <Field name="city">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input {...field} placeholder="Enter City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
              <Field name="provinceState">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province/State</label>
                    <input {...field} placeholder="Enter Province/State" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="provinceState" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
              <Field name="country">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      {...field}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Country</option>
                      <option value="Pakistan">Pakistan</option>
                    </select>
                    <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>

              <Field name="GPScoordinate">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GPS Coordinate</label>
                    <input {...field} placeholder="Enter GPS Coordinate" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="GPScoordinate" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
              <Field name="locationTypeId">
                {({ field, form }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Type
                      {isLoading && <span className="ml-2 text-gray-400">(Loading...)</span>}
                    </label>
                    <div className="relative">
                      <select 
                        {...field} 
                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                          isLoading ? 'cursor-wait opacity-50' : ''
                        }`}
                        disabled={isLoading}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(e);
                          console.log('🎯 Location type selected:', {
                            value,
                            matchingType: locationTypes.find(t => t.id === value),
                            availableTypes: locationTypes.map(t => ({ id: t.id, type: t.type }))
                          });
                        }}
                      >
                        <option value="">Select Location Type</option>
                        {isLoading ? (
                          <option disabled>Loading location types...</option>
                        ) : locationTypes && locationTypes.length > 0 ? (
                          locationTypes.map(type => {
                            console.log('🏷️ Rendering type option:', { id: type.id, type: type.type });
                            return (
                              <option key={type.id} value={type.id}>
                                {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
                              </option>
                            );
                          })
                        ) : (
                          <option disabled>Setting up location types...</option>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                    <ErrorMessage name="locationTypeId" component="div" className="text-red-500 text-sm mt-1" />
                    {field.value && locationTypes.length > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        Selected: {locationTypes.find(t => t.id === field.value)?.type || 'Loading...'}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <Field name="authorizedPersonName">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Authorized Person Name</label>
                    <input {...field} placeholder="Enter Authorized Person Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="authorizedPersonName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
              <Field name="authorizedPersonNumber">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authorized Person Number
                    </label>

                    <div className="flex w-full">
             
                      <div className="flex items-center px-3 bg-gray-50 border border-gray-200 border-r-0 rounded-l-md">
                        <img
                          src="https://img.freepik.com/premium-vector/pakistan-circle-flag-logo-icon-computer-vector-illustration-design_1143296-2001.jpg?semt=ais_hybrid&w=740"
                          alt="Pakistan Flag"
                          className="w-5 h-5 object-cover rounded-full mr-1"
                        />
                        <span className="text-sm text-gray-700">+92</span>
                      </div>

                      {/* Input field */}
                      <input
                        {...field}
                        placeholder="3001234567"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Error message */}
                    <ErrorMessage
                      name="authorizedPersonNumber"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                )}
              </Field>
              <Field name="authorizedPersonDesignation">
                {({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Authorized Person Designation</label>
                    <input {...field} placeholder="Enter Designation" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <ErrorMessage name="authorizedPersonDesignation" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                )}
              </Field>
            </div>
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

export default LocationInformation;
