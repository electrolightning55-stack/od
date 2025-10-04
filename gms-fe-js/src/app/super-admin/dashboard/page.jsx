
'use client'

import React from 'react';
import SuperAdminSidebar from '@/components/DashboardComponents/Sidebar/SuperAdminSidebar';

const SuperAdminDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <SuperAdminSidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
                    <div className="mt-4">
                        <p>Welcome to the Super Admin Dashboard</p>
                        {/* Add your dashboard content here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
