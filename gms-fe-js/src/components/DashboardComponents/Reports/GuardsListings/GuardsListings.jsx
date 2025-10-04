'use client'
import { userRequest } from '@/lib/RequestMethods'
import { downloadBulkCSVTemplate, handleFileBulkUpload, handleSubmitBulkUpload, validateBulkUploadFile } from '@/services/GuardServices/GuardBulkUpload'
import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Papa from 'papaparse';

const GuardsListings = () => {

    const [guardsByLocation, setGuardsByLocation] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchFilters, setSearchFilters] = useState({
        serviceNo: '',
        cnic: '',
        locationId: ''
    });
    const [guardBulkUploadFile, setGuardBulkUploadFile] = useState(null)

    // CSV Modal State (Wizard)
    const [csvModalOpen, setCsvModalOpen] = useState(false);
    const [csvWizardStep, setCsvWizardStep] = useState(1); // 1 = preview, 2 = office select
    const [csvData, setCsvData] = useState([]);
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [csvEditData, setCsvEditData] = useState([]);
    const [csvError, setCsvError] = useState('');
    const fileInputRef = useRef(null);
    // Office selection state
    const [offices, setOffices] = useState([]);
    const [selectedOfficeId, setSelectedOfficeId] = useState("");

    useEffect(() => {

        const getGuardsByLocation = async () => {
            try {
                setIsLoading(true);
                const res = await userRequest.get("/guards/by-organization");
                setGuardsByLocation(res.data.data);
                console.log(res.data.data)
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        getGuardsByLocation();
    }, []);

    // Calculate pagination for actual data
    const totalGuards = guardsByLocation?.length || 0
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = Math.min(startIndex + rowsPerPage, totalGuards)
    const currentGuards = guardsByLocation?.slice(startIndex, endIndex) || []
    const totalPages = Math.ceil(totalGuards / rowsPerPage)

    const handleInputChange = (field, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSearch = () => {
        // Implement search logic here
        console.log('Search filters:', searchFilters)
    }

    const checkCNICExpiry = (cnicExpiry) => {
        if (!cnicExpiry) return false;
        const currentDate = new Date();
        const cnicExpiryDate = new Date(cnicExpiry);
        return cnicExpiryDate < currentDate;
    }

    const renderStars = (rating) => {
        const ratingValue = rating || 0;
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={`text-sm ${index < ratingValue ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
            </span>
        ))
    }

    // Reset to first page when rows per page changes
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    }

    // Handle file upload using the service
    const handleFileUpload = (e) => {
        setCsvModalOpen(true);
        setCsvWizardStep(1);
        setCsvData([]);
        setCsvHeaders([]);
        setCsvEditData([]);
        setCsvError('');
        setGuardBulkUploadFile(null);
        setSelectedOfficeId("");
        if (e && e.target && e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors && results.errors.length > 0) {
                        setCsvError('CSV parsing error: ' + results.errors[0].message);
                        setCsvData([]);
                        setCsvHeaders([]);
                        setCsvEditData([]);
                        return;
                    }
                    setCsvData(results.data);
                    setCsvHeaders(results.meta.fields || []);
                    setCsvEditData(results.data.map(row => ({ ...row })));
                    setCsvError('');
                },
                error: (err) => {
                    setCsvError('CSV parsing error: ' + err.message);
                    setCsvData([]);
                    setCsvHeaders([]);
                    setCsvEditData([]);
                }
            });
        }
    }

    const closeCsvModal = () => {
        setCsvModalOpen(false);
        setCsvWizardStep(1);
        setCsvData([]);
        setCsvHeaders([]);
        setCsvEditData([]);
        setCsvError('');
        setSelectedOfficeId("");
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCsvCellEdit = (rowIdx, field, value) => {
        setCsvEditData(prev => {
            const updated = [...prev];
            updated[rowIdx] = { ...updated[rowIdx], [field]: value };
            return updated;
        });
    };

    // Fetch offices for office selection step (only when needed)
    useEffect(() => {
        if (csvModalOpen && csvWizardStep === 2 && offices.length === 0) {
            const fetchOffices = async () => {
                try {
                    const res = await userRequest.get("/organizations/get-offices");
                    setOffices(res.data.data || []);
                } catch (error) {
                    toast.error("Failed to fetch offices");
                    setOffices([]);
                }
            };
            fetchOffices();
        }
    }, [csvModalOpen, csvWizardStep, offices.length]);

    // Wizard: Step 2 submit
    const handleCsvOfficeSubmit = async () => {
        if (!csvEditData.length) return;
        if (!selectedOfficeId) {
            setCsvError('Please select an office.');
            return;
        }
        try {
            setIsLoading(true);
            await handleSubmitBulkUpload(csvEditData, setGuardBulkUploadFile, selectedOfficeId);
            setIsLoading(false);
            closeCsvModal();
            // Refresh the guards list after successful upload
            const res = await userRequest.get("/guards/by-organization");
            setGuardsByLocation(res.data.data);
            toast.success('Guards uploaded successfully');
        } catch (err) {
            setIsLoading(false);
            setCsvError(err?.response?.data?.message || err.message || 'Failed to upload CSV data.');
        }
    };
    // Handle bulk upload submission using the service
    const handleBulkUploadSubmit = async () => {
        try {
            // Validate file before submission
            const validation = validateBulkUploadFile(guardBulkUploadFile);
            if (!validation.isValid) {
                toast.error(validation.error);
                return;
            }

            await handleSubmitBulkUpload(guardBulkUploadFile, setGuardBulkUploadFile, "bba9bc6d-70d2-4d83-aa80-03e1f6c454f2");
            toast.success('File uploaded successfully');

            // Refresh the guards list after successful upload
            const res = await userRequest.get("/guards/by-organization");
            setGuardsByLocation(res.data.data);
        } catch (error) {
            const errMess = error?.response?.data?.message || error.message || 'Upload failed';
            toast.error(errMess);
        }
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-md mt-8 p-4">

            {/* CSV Upload Modal (Wizard) */}
            {csvModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
                        <button onClick={closeCsvModal} className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl">&times;</button>
                        <h2 className="text-lg font-semibold mb-4">Bulk Guard Upload</h2>
                        {/* Stepper */}
                        <div className="flex items-center mb-6">
                            <div className={`flex-1 h-1 rounded ${csvWizardStep === 1 ? 'bg-green-700' : 'bg-green-400'}`}></div>
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-700 text-white font-bold ml-2 mr-2">1</div>
                            <span className="mr-4">Preview & Edit</span>
                            <div className={`flex-1 h-1 rounded ${csvWizardStep === 2 ? 'bg-green-700' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${csvWizardStep === 2 ? 'bg-green-700 text-white' : 'bg-gray-300 text-gray-700'} font-bold ml-2 mr-2`}>2</div>
                            <span>Select Office</span>
                        </div>
                        {csvWizardStep === 1 && (
                            <>
                                <input
                                    type="file"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="mb-4"
                                />
                                {csvError && <div className="text-red-500 mb-2">{csvError}</div>}
                                {csvHeaders.length > 0 && (
                                    <div className="overflow-x-auto max-h-96 mb-4">
                                        <table className="min-w-full divide-y divide-gray-800 ">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {csvHeaders.map((header) => (
                                                        <th key={header} className="px-4 py-2 text-xs font-medium uppercase tracking-wider border-b">{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {csvEditData.map((row, rowIdx) => (
                                                    <tr key={rowIdx}>
                                                        {csvHeaders.map((field) => (
                                                            <td key={field} className="border px-2 py-1">
                                                                <input
                                                                    type="text"
                                                                    value={row[field] || ''}
                                                                    onChange={e => handleCsvCellEdit(rowIdx, field, e.target.value)}
                                                                    className="w-full px-1 py-0.5 border rounded"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={closeCsvModal}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                                        onClick={() => setCsvWizardStep(2)}
                                        disabled={isLoading || !csvEditData.length}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                        {csvWizardStep === 2 && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Office</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedOfficeId}
                                        onChange={e => setSelectedOfficeId(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {offices.map((office) => (
                                            <option key={office.id} value={office.id}>
                                                {`${office.branchName} (ID: ${office.branchCode})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {csvError && <div className="text-red-500 mb-2">{csvError}</div>}
                                <div className="flex justify-between gap-2">
                                    <button
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={() => setCsvWizardStep(1)}
                                        disabled={isLoading}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                                        onClick={handleCsvOfficeSubmit}
                                        disabled={isLoading || !selectedOfficeId}
                                    >
                                        {isLoading ? 'Uploading...' : 'Submit'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}


            <aside className="flex justify-between items-center p-4 bg-white rounded-md">
                <h1 className="text-xl font-semibold">Search Guards</h1>

                <article className="relative flex items-center gap-3 flex-wrap">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        id="bulkUpload"
                    />

                    <label
                        htmlFor="bulkUpload"
                        className="flex items-center gap-2 px-3 py-3 bg-green-100 hover:bg-green-200 text-green-800 font-medium rounded-md cursor-pointer transition"
                    >
                        <img
                            src="https://img.icons8.com/?size=100&id=BEMhRoRy403e&format=png&color=000000"
                            alt="Excel Upload"
                            className="w-5 h-5"
                        />
                        <span className="text-sm">Upload CSV</span>
                        {guardBulkUploadFile && (
                            <span className="text-sm text-black font-normal">
                                {guardBulkUploadFile.name}
                            </span>
                        )}
                    </label>

                    <button
                        onClick={downloadBulkCSVTemplate}
                        className="px-3 py-3 text-sm bg-white border font-[500] border-green-800 text-green-800 rounded-md"
                    >
                        Download Template
                    </button>

                    {guardBulkUploadFile && (
                        <button
                            onClick={handleBulkUploadSubmit}
                            className="px-3 py-3 text-sm bg-green-800 text-white font-medium rounded-md"
                        >
                            Submit
                        </button>
                    )}
                </article>

            </aside>



            {/* Search Form */}
            <aside className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 p-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service No.
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                        placeholder='Enter'
                        value={searchFilters.serviceNo}
                        onChange={(e) => handleInputChange('serviceNo', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNIC
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                        placeholder='Enter'
                        value={searchFilters.cnic}
                        onChange={(e) => handleInputChange('cnic', e.target.value)}
                    />
                </div>
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location ID
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                            placeholder='Enter'
                            value={searchFilters.locationId}
                            onChange={(e) => handleInputChange('locationId', e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                    </button>
                </div>
            </aside>

            {/* Table */}
            <aside className={`border border-black rounded-lg overflow-hidden`}>
                {/* Table Header */}
                <aside className="bg-gray-50 px-6 py-5 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-[15px] text-black">All Guards</h2>
                    <span className="text-sm text-gray-500">
                        {totalGuards > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} of <span className='text-gray-900'>{totalGuards}</span>
                    </span>
                </aside>

                {/* Horizontally scrollable table container */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800 ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[200px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/name.png" className='w-4 h-4' alt="" />
                                        Name
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[150px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/cnic.png" className='w-4 h-4' alt="" />
                                        CNIC
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[200px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/location.png" className='w-4 h-4' alt="" />
                                        Deployed
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[150px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/category.png" className='w-4 h-4' alt="" />
                                        Assigned Category
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[150px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/originalCnic.png" className='w-4 h-4' alt="" />
                                        Original CNIC
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[100px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-500">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4">
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentGuards.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No guards found
                                    </td>
                                </tr>
                            ) : (
                                currentGuards.map((guard, index) => (
                                    <tr key={guard.id} className={`${index % 2 === 0 ? 'bg-tableBgGray' : 'bg-white'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img src={'https://cdn-icons-png.flaticon.com/512/8631/8631487.png'} className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium" alt="" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{guard.fullName}</div>
                                                    <div className="text-sm text-gray-900">{guard.serviceNumber}</div>
                                                    <div className="flex items-center space-x-1">
                                                        {renderStars(guard.rating)}
                                                        <span className="text-xs text-gray-900 ml-1">{guard.rating || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-gray-900 text-sm 
                                                    ${checkCNICExpiry(guard.cnicExpiry) ? 'text-red-500' : 'text-green-500 font-[400]'}`}>{guard.cnicNumber}</span>
                                                <span className="text-gray-500 text-xs">
                                                    {checkCNICExpiry(guard.cnicExpiry) ? 'Expired' : 'Valid'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm flex flex-col items-center gap-1">
                                                <span className='text-gray-900'>{guard.assignedGuard?.location?.locationName || 'N/A'}</span>
                                                <span className='text-gray-500'>{guard.location?.a || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {guard.guardCategory?.categoryName || 'NA'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex px-3 py-2 text-xs font-semibold rounded-md ${guard.guardDocuments?.originalCNICSubmitted === true
                                                    ? 'bg-green-100 text-green-800 border border-green-400'
                                                    : 'bg-red-100 text-red-800 border border-red-400'
                                                    }`}>
                                                    {guard.guardDocuments?.originalCNICSubmitted === true ? '✓ Yes' : '✗ No'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button className="text-gray-600 hover:bg-gray-100 transition-colors duration-150">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-600 hover:bg-gray-100 transition-colors duration-150">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <span>Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                {totalGuards > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} of {totalGuards}
                            </span>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-3 py-1 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

        </div>
    )
}

export default GuardsListings