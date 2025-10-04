"use client"
import React from 'react'
import Sidebar from '@/components/DashboardComponents/Sidebar/Sidebar'

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 mt-16">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout