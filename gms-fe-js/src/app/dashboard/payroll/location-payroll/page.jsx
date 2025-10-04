'use client';
import React from 'react'
import PayrollSidebar from '@/components/DashboardComponents/Payroll/PayrollSidebar';
import LocationPayroll from '@/components/DashboardComponents/Payroll/LocationPayroll';


const GeneratePayRollPage = () => {
  return (
    <div className="min-h-screen bg-formBGBlue">

      <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
        {/* Sidebar */}
        <PayrollSidebar
          currentStep="location-payroll"
          completedSteps={[]}
          showNavigation={true}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto rounded-xl">
          <LocationPayroll />
        </div>
      </div>
    </div>
  )
}

export default GeneratePayRollPage