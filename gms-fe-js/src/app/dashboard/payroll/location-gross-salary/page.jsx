'use client'
import LocationGrossSalaryForm from '@/components/DashboardComponents/Payroll/LocationGrossSalary'
import PayrollSidebar from '@/components/DashboardComponents/Payroll/PayrollSidebar';
import Breadcrumbs from '@/common/DashboardCommon/Breadcrumbs';
import React from 'react'

const LocationGrossSalaryPage = () => {
    return (
        <div className="min-h-screen bg-formBGBlue">
            {/* Header */}
            {/* <div className='px-4 pt-4'>
                <Breadcrumbs breadcrumbs={[
                    { label: 'Dashboard' },
                    { label: 'Payroll' },
                    { label: 'Location Gross Salary' }
                ]} />
            </div> */}

            <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
                {/* Sidebar */}
                <PayrollSidebar
                    currentStep="location-gross-salary"
                    completedSteps={[]}
                    showNavigation={true}
                />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto rounded-xl">
                    <LocationGrossSalaryForm />
                </div>
            </div>
        </div>
    )
}

export default LocationGrossSalaryPage