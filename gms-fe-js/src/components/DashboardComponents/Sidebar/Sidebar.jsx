'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ALL_FEATURES } from '@/constants/sidebar-features';

const Sidebar = () => {
    // Get user state from Redux
    const { currentUser } = useSelector(state => state.user);
    const features = currentUser?.features || [];
    const isSuperAdmin = currentUser?.isSuperAdmin || false;
    
    // Debug logging
    console.log("Sidebar Redux state:", { 
        userEmail: currentUser?.email,
        features,
        isSuperAdmin 
    });
    
    // Filter features based on permissions
    const visibleFeatures = useMemo(() => {
        // Early return for superadmin
        if (isSuperAdmin) {
            console.log("Superadmin: showing all features");
            return ALL_FEATURES;
        }

        // Validate features array
        if (!Array.isArray(features) || features.length === 0) {
            console.warn(`No features found for user: ${currentUser?.email}`);
            return [];
        }

        // Filter features based on permissions
        const filtered = ALL_FEATURES.filter(f => {
            const hasFeature = features.includes(f.key);
            console.log(`Feature check: ${f.key} = ${hasFeature}`);
            return hasFeature;
        });

        console.log(`Filtered ${filtered.length} visible features for user`);
        return filtered;
    }, [features, isSuperAdmin, currentUser?.email]);

    const [expandedSections, setExpandedSections] = useState(() => {
        // Initialize expanded state for each feature, with first one expanded
        return ALL_FEATURES.reduce((acc, feature, index) => ({
            ...acc,
            [feature.key.toLowerCase().replace(/\s+/g, '')]: index === 0
        }), {});
    });

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className={`transition-all duration-200 ${sidebarOpen ? 'w-[270px]' : 'w-[60px]'} h-screen bg-white border-r border-gray-200 overflow-y-auto`}>
            <div className="p-3">
                {/* Sidebar Toggle Arrow */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md mb-4"
                >
                    <ChevronLeft className={`h-5 w-5 transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`} />
                    {sidebarOpen && <span className="ml-2">Collapse Sidebar</span>}
                </button>

                {/* Show message if no features available */}
                {visibleFeatures.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-md">
                        <p className="font-medium mb-1">No Features Available</p>
                        <p className="text-xs">
                            {isSuperAdmin 
                                ? "Error loading features. Please try again."
                                : "No features have been assigned to your account. Please contact your administrator."}
                        </p>
                    </div>
                ) : (
                    // Render features if available
                    visibleFeatures.map((feature) => {
                        const sectionKey = feature.key.toLowerCase().replace(/\s+/g, '');
                        const isExpanded = expandedSections[sectionKey];
                        const Icon = feature.icon;

                    return (
                        <div key={feature.key} className="mb-2">
                            <button
                                onClick={() => toggleSection(sectionKey)}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <Icon className="mr-3 h-4 w-4" />
                                    {sidebarOpen && feature.label}
                                </div>
                                {sidebarOpen && (isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))
                                }
                            </button>
                            {sidebarOpen && isExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                    {feature.items.map((item) => (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                        >
                                            -{item.label}
                                        </Link>
                                    ))}
                         </div>
)}
</div>

                )}))}

                {/* Dashboards Section */}
                <div className="mb-6">
                    <h3 className={`text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen ? 'hidden' : ''}`}>
                        Dashboards
                    </h3>
                    <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        <img src='/icons/overview.png' className="mr-3 h-4 w-4" />
                        {sidebarOpen && 'Overview'}
                    </Link>
                </div>

                <div>
                    <h3 className={`text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 ${!sidebarOpen ? 'hidden' : ''}`}>
                        Pages
                    </h3>


                    {/* Setup Section */}
                    {(isSuperAdmin || features.includes("setup")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('setup')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/setup.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Setup'}
                                </div>
                                {sidebarOpen && (expandedSections.setup ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.setup && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/setup/create-office"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Create Office
                                    </Link>
                                    <Link
                                        href="/dashboard/setup/create-user"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Create User
                                    </Link>
                                    <Link
                                        href="/dashboard/setup/add-guards-category"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Add Guards Category
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Registration Section */}
                    {(isSuperAdmin || features.includes("registration")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('registration')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/registration.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Registration'}
                                </div>
                                {sidebarOpen && (expandedSections.registration ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.registration && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/registration/guards-registration"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Guards Registration
                                    </Link>
                                    <Link
                                        href="/dashboard/registration/employee-registration"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Employee Registration
                                    </Link>
                                    <Link
                                        href="/dashboard/registration/clients-registration"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Clients Registration
                                    </Link>
                                    <Link
                                        href="/dashboard/registration/location-registration"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Location Registration
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Deployment Section */}
                    {(isSuperAdmin || features.includes("deployment")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('deployment')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/deployment.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Deployment'}
                                </div>
                                {sidebarOpen && (expandedSections.deployment ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.deployment && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/deployment/assign-guards"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Assign Guards
                                    </Link>
                                    <Link
                                        href="/dashboard/deployment/assign-supervisor"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Assign Supervisor
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attendance Section */}
                    {(isSuperAdmin || features.includes("attendance")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('attendance')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/deployment.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Attendance'}
                                </div>
                                {sidebarOpen && (expandedSections.attendance ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.attendance && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/attendance/location-attendance"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Location Attendance
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Payroll Section */}
                    {(isSuperAdmin || features.includes("payroll")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('payroll')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/payroll.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Pay Roll'}
                                </div>
                                {sidebarOpen && (expandedSections.payroll ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.payroll && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/payroll/location-attendance-sheet"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Generate Payroll
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Accounts & Finance Section */}
                    {(isSuperAdmin || features.includes("accounts_finance")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('finance')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/finance.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Accounts & Finance'}
                                </div>
                                {sidebarOpen && (expandedSections.finance ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.finance && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/accounts-finance/bills"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Bills
                                    </Link>
                                    <Link
                                        href="/dashboard/accounts-finance/quotations"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Quotations
                                    </Link>
                                    <Link
                                        href="/dashboard/accounts-finance/tax-calculation"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Tax Calculation
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reports Section */}
                    {(isSuperAdmin || features.includes("reports")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('reports')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/reports.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Reports'}
                                </div>
                                {sidebarOpen && (expandedSections.reports ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.reports && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/reports/attendance-reports"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Attendance Reports
                                    </Link>
                                    <Link
                                        href="/dashboard/reports/salary-reports"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Salary Reports
                                    </Link>
                                    <Link
                                        href="/dashboard/reports/account-reports"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Account Reports
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Support Section */}
                    {(isSuperAdmin || features.includes("support")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('support')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/support.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Support'}
                                </div>
                                {sidebarOpen && (expandedSections.support ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.support && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/support/messages"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Messages
                                    </Link>
                                    <Link
                                        href="/dashboard/support/notifications"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Notifications
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Documents Section */}
                    {(isSuperAdmin || features.includes("documents")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('documents')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/documents.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Documents'}
                                </div>
                                {sidebarOpen && (expandedSections.documents ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.documents && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/documents/official"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Official Documents
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Section */}
                    {(isSuperAdmin || features.includes("settings")) && (
                        <div className="mb-2">
                            <button
                                onClick={() => toggleSection('settings')}
                                className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <div className="flex items-center">
                                    <img src='/icons/settings.png' className="mr-3 h-4 w-4" />
                                    {sidebarOpen && 'Settings'}
                                </div>
                                {sidebarOpen && (expandedSections.settings ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                ))}
                            </button>
                            {sidebarOpen && expandedSections.settings && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <Link
                                        href="/dashboard/settings/profile"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Profile Settings
                                    </Link>
                                    <Link
                                        href="/dashboard/settings/organization"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -Organization Settings
                                    </Link>
                                    <Link
                                        href="/dashboard/settings/user-management"
                                        className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        -User Management
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sales Monitor */}
                    <div className="mb-2">
                        <button
                            onClick={() => toggleSection('salesMonitor')}
                            className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <div className="flex items-center">
                                <img src='/icons/accounts.png' className="mr-3 h-4 w-4" />
                                {sidebarOpen && 'Sales Monitor'}
                            </div>
                            {sidebarOpen && (expandedSections.salesMonitor ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            ))}
                        </button>
                        {sidebarOpen && expandedSections.salesMonitor && (
                            <div className="ml-6 mt-1 space-y-1">
                                <Link
                                    href="/dashboard/sales-monitor/leads"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Leads
                                </Link>
                                <Link
                                    href="/dashboard/sales-monitor/qualify"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Qualify
                                </Link>
                                <Link
                                    href="/dashboard/sales-monitor/meetings"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Meetings
                                </Link>
                                <Link
                                    href="/dashboard/sales-monitor/proposals"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Proposals
                                </Link>
                                <Link
                                    href="/dashboard/sales-monitor/opportunity"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Opportunity
                                </Link>
                                <Link
                                    href="/dashboard/sales-monitor/opportunity"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Closed & Won
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Performance Manager */}
                    <div className="mb-2">
                        <button
                            onClick={() => toggleSection('performanceManager')}
                            className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <div className="flex items-center">
                                <img src='/icons/accounts.png' className="mr-3 h-4 w-4" />
                                {sidebarOpen && 'Performance Manager'}
                            </div>
                            {sidebarOpen && (expandedSections.performanceManager ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            ))}
                        </button>
                        {sidebarOpen && expandedSections.performanceManager && (
                            <div className="ml-6 mt-1 space-y-1">
                                <Link
                                    href="/dashboard/performance-manager/initiate-event"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Inititate Event
                                </Link>
                                <Link
                                    href="/dashboard/performance-manager/profile-rating"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Profile Rating
                                </Link>

                            </div>
                        )}
                    </div>

                    {/* Inventory Management */}
                    <div className="mb-2">
                        <button
                            onClick={() => toggleSection('inventoryManagement')}
                            className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <div className="flex items-center">
                                <img src='/icons/accounts.png' className="mr-3 h-4 w-4" />
                                {sidebarOpen && 'Inventory Management'}
                            </div>
                            {sidebarOpen && (expandedSections.inventoryManagement ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            ))}
                        </button>
                        {sidebarOpen && expandedSections.inventoryManagement && (
                            <div className="ml-6 mt-1 space-y-1">
                                <Link
                                    href="/dashboard/inventory-management/vendors"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Vendors
                                </Link>
                                <Link
                                    href="/dashboard/inventory-management/create-po"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Create PO
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Complaints */}
                    <div className="mb-2">
                        <button
                            onClick={() => toggleSection('complaints')}
                            className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <div className="flex items-center">
                                <img src='/icons/accounts.png' className="mr-3 h-4 w-4" />
                                {sidebarOpen && 'Complaints'}
                            </div>
                            {sidebarOpen && (expandedSections.complaints ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            ))}
                        </button>
                        {sidebarOpen && expandedSections.complaints && (
                            <div className="ml-6 mt-1 space-y-1">
                                <Link
                                    href="/dashboard/complaints/complaints"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Complaints List
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Notifications & Announcements */}
                    <div className="mb-2">
                        <button
                            onClick={() => toggleSection('notifications')}
                            className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <div className="flex items-center">
                                <img src='/icons/accounts.png' className="mr-3 h-4 w-4" />
                                {sidebarOpen && 'Notifications'}
                            </div>
                            {sidebarOpen && (expandedSections.notifications ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            ))}
                        </button>
                        {sidebarOpen && expandedSections.notifications && (
                            <div className="ml-6 mt-1 space-y-1">
                                <Link
                                    href="/dashboard/notifications-announcements/notifications"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Notifications List
                                </Link>
                                <Link
                                    href="/dashboard/notifications-announcements/add-new-notification"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Add new Notification
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* View Reports */}
                    <div className="mb-2">
                        <button
                            onClick={() => toggleSection('viewReports')}
                            className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <div className="flex items-center">
                                <img src='/icons/accounts.png' className="mr-3 h-4 w-4" />
                                {sidebarOpen && 'View Reports'}
                            </div>
                            {sidebarOpen && (expandedSections.viewReports ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            ))}
                        </button>
                        {sidebarOpen && expandedSections.viewReports && (
                            <div className="ml-6 mt-1 space-y-1">
                                <Link
                                    href="/dashboard/reports/offices"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Offices
                                </Link>
                                <Link
                                    href="/dashboard/reports/employees"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Employees
                                </Link>
                                <Link
                                    href="/dashboard/reports/guards"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Guards
                                </Link>
                                <Link
                                    href="/dashboard/reports/clients"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Clients
                                </Link>
                                <Link
                                    href="/dashboard/reports/location"
                                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    -Location
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 