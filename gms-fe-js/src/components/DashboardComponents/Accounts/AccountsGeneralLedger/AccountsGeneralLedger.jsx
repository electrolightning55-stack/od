'use client'
import React, { useState } from 'react'
import { formatDate } from '@/utils/FormHelpers/formatDate';
const AccountsGeneralLedger = () => {



    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchFilters, setSearchFilters] = useState({
        serviceNo: '',
        cnic: '',
        locationId: ''
    });

    const sampleLedgerData = [
        {
            date: '2021-01-01',
            id: 1,
            details: 'Details/Description',
            voucherNo: '123456',
            debit: '0',
            credit: '1200',
            balance: '1200',
            narration: 'Narration Data'
        },
        {
            date: '2021-01-02',
            details: 'Details/Description',
            id: 2,
            voucherNo: '123457',
            debit: '0',
            credit: '1200',
            balance: '1200',
            narration: 'Narration Data'
        },
        
        
    ]
    const [generalLedgerData, setGeneralLedgerData] = useState(sampleLedgerData)
    // Calculate pagination for actual data
    const totalData = generalLedgerData?.length || 0
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = Math.min(startIndex + rowsPerPage, totalData)
    const totalPages = Math.ceil(totalData / rowsPerPage)

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


    // Reset to first page when rows per page changes
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-md mt-8 p-4">
            <aside className="flex justify-between items-center p-4 bg-white rounded-md">
                <h1 className="text-xl">General Ledger</h1>
            </aside>
            {/* Search Form */}
            <aside className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 p-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Branch
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                        placeholder='Enter'
                        value={searchFilters.branch}
                        onChange={(e) => handleInputChange('branch', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                        placeholder='Enter'
                        value={searchFilters.accountType}
                        onChange={(e) => handleInputChange('accountType', e.target.value)}
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                        placeholder='Enter'
                        type='date'
                        value={searchFilters.fromDate}
                        onChange={(e) => handleInputChange('fromDate', e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date
                    </label>
                    <input
                        className="w-full px-4 py-3 bg-formBgLightGreen border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                        placeholder='Enter'
                        type='date'
                        value={searchFilters.toDate}
                        onChange={(e) => handleInputChange('toDate', e.target.value)}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="px-2 py-3 max-w-[100px] bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-end gap-2 whitespace-nowrap self-end"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                </button>

            </aside>

            {/* Table */}
            <aside className={`border border-black rounded-lg overflow-hidden`}>
                {/* Table Header */}
                <aside className="bg-gray-50 px-6 py-5 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-[15px] text-black">All Guards</h2>
                    {/* <span className="text-sm text-gray-500">
                        {totalGuards > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} of <span className='text-gray-900'>{totalGuards}</span>
                    </span> */}
                </aside>

                {/* Horizontally scrollable table container */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800 ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/name.png" className='w-4 h-4' alt="" />
                                        Date
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[150px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/name.png" className='w-4 h-4' alt="" />
                                        Details/Description
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/name.png" className='w-4 h-4' alt="" />
                                        Voucher No.
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[150px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/location.png" className='w-4 h-4' alt="" />
                                        Debit
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[120px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/location.png" className='w-4 h-4' alt="" />
                                        Credit
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[100px]">
                                    <span className='flex items-center gap-2'>
                                        <img src="/icons/listingIcons/location.png" className='w-4 h-4' alt="" />
                                        Balance
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider min-w-[100px]">
                                    Narration
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
                            ) : generalLedgerData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                generalLedgerData.map((guard, index) => (
                                    <tr key={guard.id} className={`${index % 2 === 0 ? 'bg-tableBgGray' : 'bg-white'}`}>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <aside className="flex items-center space-x-3">
                                                <div className="text-sm text-center  font-medium text-gray-900">{formatDate(guard.date)}</div>

                                            </aside>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex flex-col items-center gap-1">
                                                <span>
                                                    {guard.details}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold">
                                                {guard.voucherNo || 'NA'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                               <span className='text-sm'>{guard.debit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <span>{guard.credit}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <span>{guard.balance}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <span>{guard.narration}</span>
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
                                {totalData > 0 ? `${startIndex + 1} - ${endIndex}` : '0'} of {totalData}
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





export default AccountsGeneralLedger