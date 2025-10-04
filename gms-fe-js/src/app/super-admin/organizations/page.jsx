'use client'

import React, { useEffect, useState } from 'react';
import { userRequest } from '@/lib/RequestMethods';
import SuperAdminSidebar from '@/components/DashboardComponents/Sidebar/SuperAdminSidebar';
import { Search, Filter, MapPin, Phone, Mail, Eye, Trash2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OrganizationsListPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleView = (id) => {
        // TODO: Implement view functionality
        console.log('View organization:', id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this organization?')) {
            try {
                await userRequest.delete(`/organizations/${id}`);
                setOrganizations(organizations.filter(org => org.id !== id));
                toast.success('Organization deleted successfully');
            } catch (error) {
                console.error('Error deleting organization:', error);
                toast.error('Failed to delete organization');
            }
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            console.log('Fetching organizations...');
            const response = await userRequest.get('/organizations');
            console.log('API Response:', response.data);
            setOrganizations(response.data.data || []);
            toast.success('Organizations loaded successfully');
        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('Failed to load organizations');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrganizations = organizations.filter(org =>
        org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <SuperAdminSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
                        <p className="mt-2 text-gray-600">Manage all registered organizations</p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center w-96">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search organizations..."
                                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="flex items-center px-4 py-2 text-gray-600 bg-white border rounded-lg hover:bg-gray-50">
                            <Filter size={20} className="mr-2" />
                            Filter
                        </button>
                    </div>

                    {/* Organizations List */}
                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredOrganizations.length === 0 ? (
                            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                                No organizations found
                            </div>
                        ) : (
                            filteredOrganizations.map((org) => (
                                <div key={org.id} className="bg-blue-50/30 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        {/* Organization Name and Logo */}
                                        <div className="flex items-center space-x-3 w-1/3">
                                            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                                {org.organizationLogo ? (
                                                    <img
                                                        src={org.organizationLogo}
                                                        alt={org.organizationName}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg font-medium text-gray-600">
                                                        {org.organizationName[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {org.organizationName}
                                                </h3>
                                                <p className="text-sm text-gray-500">Company Details</p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex space-x-12 w-1/3 justify-center">
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {org.employee?.length || 0}
                                                </p>
                                                <p className="text-sm text-gray-500">Employees</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {org.office?.length || 0}
                                                </p>
                                                <p className="text-sm text-gray-500">Offices</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {org.guard?.length || 0}
                                                </p>
                                                <p className="text-sm text-gray-500">Guards</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 w-1/3 justify-end">
                                            <button 
                                                onClick={() => handleView(org.id)}
                                                className="px-4 py-1 text-blue-600 bg-blue-50 rounded-full text-sm font-medium"
                                            >
                                                View
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(org.id)}
                                                className="px-4 py-1 text-red-600 bg-red-50 rounded-full text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationsListPage;