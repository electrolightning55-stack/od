'use client';
import React from 'react';
import AttendanceSheetForm from '@/components/DashboardComponents/Attendance/AttendanceSheetForm';
import PayrollSidebar from '@/components/DashboardComponents/Payroll/PayrollSidebar';
import Breadcrumbs from '@/common/DashboardCommon/Breadcrumbs';

const LocationAttendanceSheetPage = () => {
    return (
        <div className="min-h-screen bg-formBGBlue">
            {/* Header */}
            {/* <div className='px-4 pt-4'>
                <Breadcrumbs breadcrumbs={[
                    { label: 'Dashboard' },
                    { label: 'Payroll' },
                    { label: 'Location Attendance Sheet' }
                ]} />
            </div> */}

            <div className="flex h-[calc(100vh-73px)] p-4 gap-5">
                {/* Sidebar */}
                <PayrollSidebar
                    currentStep="location-attendance-sheet"
                    completedSteps={[]}
                    showNavigation={true}
                />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto rounded-xl">
                    <AttendanceSheetForm />
                </div>
            </div>
        </div>
    );
};

export default LocationAttendanceSheetPage; 