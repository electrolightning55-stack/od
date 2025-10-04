'use client'
import React from 'react'
import EmployeeListing from '@/components/DashboardComponents/Reports/EmployeesListings/EmployeeListing'


const EmployeesListingPage = () => {
  return (
      <div className="min-h-screen bg-formBGBlue flex flex-col w-full px-4 pt-4">
       
          <div className="w-full max-w-7xl">
              <aside className="bg-white border-b rounded-xl border-gray-200">
                  <div className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Dashboard</span>
                          <span>&gt;</span>
                          <span>Reports</span>
                          <span>&gt;</span>
                          <span className="text-gray-900 font-medium">Employee Listings</span>
                      </div>
                  </div>
              </aside>
          </div>

          <EmployeeListing />
      </div>
  )
}

export default EmployeesListingPage