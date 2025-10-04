'use client'
import React from 'react'
import AdvancesandDeductions from '@/components/DashboardComponents/Payroll/AdvancesandDeductions'
import PayrollSidebar from '@/components/DashboardComponents/Payroll/PayrollSidebar';
import Breadcrumbs from '@/common/DashboardCommon/Breadcrumbs';

const AdvancesDeductionsPage = () => {
    return (
        <div className="min-h-screen bg-formBGBlue">
            {/* Header */}
            {/* <div className='px-4 pt-4'>
                <Breadcrumbs breadcrumbs={[
                    { label: 'Dashboard' },
                    { label: 'Payroll' },
                    { label: 'Advances & Deductions' }
                ]} />
            </div> */}

            <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
                {/* Sidebar */}
                <PayrollSidebar
                    currentStep="advances-deductions"
                    completedSteps={[]}
                    showNavigation={true}
                />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto rounded-xl">
                    <AdvancesandDeductions />
                </div>
            </div>
        </div>
    )
}

export default AdvancesDeductionsPage