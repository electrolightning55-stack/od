'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ListChecks } from 'lucide-react';

const SuperAdminSidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        {
            title: 'Add Organization',
            icon: <Building2 size={20} />,
            path: '/super-admin/add-organization',
        },
        {
            title: 'All Organizations',
            icon: <ListChecks size={20} />,
            path: '/super-admin/organizations',
        },
    ];

    return (
        <aside className={`bg-white h-screen border-r ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
            <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {isOpen && <h2 className="text-xl font-semibold">Super Admin</h2>}
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-3">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link href={item.path}
                                    className={`flex items-center gap-x-3 px-3 py-2 rounded-lg transition-colors
                                        ${pathname === item.path 
                                            ? 'bg-gray-900 text-white' 
                                            : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {item.icon}
                                    {isOpen && <span>{item.title}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default SuperAdminSidebar;