'use client';
import React from 'react'
import PayrollSetAllowances from '@/components/DashboardComponents/Payroll/PayrollSetAllowances'
import PayrollSidebar from '@/components/DashboardComponents/Payroll/PayrollSidebar';
import Breadcrumbs from '@/common/DashboardCommon/Breadcrumbs'

const SetGuardAllowance = () => {
  return (
    <div className="min-h-screen bg-formBGBlue">
      {/* Header */}
      {/* <div className='px-4 pt-4'>
        <Breadcrumbs breadcrumbs={[
          { label: 'Dashboard' },
          { label: 'Payroll' },
          { label: 'Set Guard Allowance' }
        ]} />
      </div> */}

      <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
        {/* Sidebar */}
        <PayrollSidebar
          currentStep="set-guard-allowance"
          completedSteps={[]}
          showNavigation={true}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto rounded-xl">
          <PayrollSetAllowances />
        </div>
      </div>
    </div>
  )
}

export default SetGuardAllowance