'use client'
import { userRequest } from '@/lib/RequestMethods'
import React, { useEffect, useState } from 'react'

const EmployeesListings = () => {
  
  const [employeeByLocation, setEmployeeByLocation] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchFilters, setSearchFilters] = useState({
    serviceNo: '',
    cnic: '',
    locationId: ''
  })

  useEffect(() => {

    const getEmployeeByLocation = async () => {
      try {
        setIsLoading(true);
        const res = await userRequest.get("/employee/by-organization");
        setEmployeeByLocation(res.data.data);
        console.log(res.data.data)
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getEmployeeByLocation();
  }, []);

  // Calculate pagination for actual data
  const totalEmployees = employeeByLocation?.length || 0
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalEmployees)
  const currentEmployees = employeeByLocation?.slice(startIndex, endIndex) || []
  const totalPages = Math.ceil(totalEmployees / rowsPerPage)

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

  return (
    <div className="w-full bg-white rounded-xl shadow-md mt-8 p-4">
      <h1 className='text-xl p-4'>Search Employees</h1>

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
          <h2 className="text-[15px] text-black">All Employees</h2>
          <span className="text-sm text-gray-500">
            {totalEmployees > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} of <span className='text-gray-900'>{totalEmployees}</span>
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
                    Office
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[150px]">
                  <span className='flex items-center gap-2'>
                    <img src="/icons/listingIcons/category.png" className='w-4 h-4' alt="" />
                    Designation
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
              ) : currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                currentEmployees.map((employee, index) => (
                  <tr key={employee.id} className={`${index % 2 === 0 ? 'bg-tableBgGray' : 'bg-white'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img src={'https://cdn-icons-png.flaticon.com/512/8118/8118456.png'} className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium" alt="" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                          <div className="text-sm text-gray-900">{employee.serviceNumber}</div>
                          <div className="flex items-center space-x-1">
                            {renderStars(employee.rating)}
                            <span className="text-xs text-gray-900 ml-1">{employee.rating || 0}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-gray-900 text-sm 
                          ${checkCNICExpiry(employee.cnicExpiryDate) ? 'text-red-500' : 'text-green-500 font-[400]'}`}>{employee.cnicNumber}</span>
                        <span className="text-gray-500 text-xs">
                          {checkCNICExpiry(employee.cnicExpiryDate) ? 'Expired' : 'Valid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm flex flex-col items-center gap-1">
                        <span className='text-gray-900'>{employee.assignedGuard?.location?.locationName || 'N/A'}</span>
                        <span className='text-gray-500'>{employee.location?.a || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {employee.guardCategory?.categoryName || 'NA'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-3 py-2 text-xs font-semibold rounded-md ${employee.guardDocuments?.originalCNICSubmitted === true
                          ? 'bg-green-100 text-green-800 border border-green-400'
                          : 'bg-red-100 text-red-800 border border-red-400'
                          }`}>
                          {employee.guardDocuments?.originalCNICSubmitted === true ? '✓ Yes' : '✗ No'}
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
                {totalEmployees > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} of {totalEmployees}
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

export default EmployeesListings