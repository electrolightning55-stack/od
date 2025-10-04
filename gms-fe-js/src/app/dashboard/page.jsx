'use client';
import React from 'react';
import { useCurrentUser } from '@/lib/hooks';

const DashboardPage = () => {

    const { user } = useCurrentUser();

    return (
        <div className="bg-white min-h-screen">
            <div className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900">Marlboro Security</h1>
                {user && (
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back, {user.name || 'User'}!
                    </p>
                )}
            </div>
            <div className="px-8 py-8">
                <p className="text-gray-600">Welcome to the dashboard overview.</p>

                
                
            </div>
        </div>
    );
};

export default DashboardPage; 