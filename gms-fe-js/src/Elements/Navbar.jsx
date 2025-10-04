"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
    User,
    Grid3x3,
    Star,
    LayoutDashboard,
    Search,
    Sun,
    Bell,
    Settings,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { useCurrentUser } from '@/lib/hooks';
import { signOut } from '@/redux/slices/userSlice';
import { persistor } from '@/redux/store';
import Link from 'next/link';


const Navbar = () => {
    const { user, isAuthenticated } = useCurrentUser();
    const dispatch = useDispatch();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        dispatch(signOut());
        await persistor.purge();
        localStorage.removeItem("token");
        router.push('/');
    };

    const navItems = [
        { icon: Grid3x3, label: 'Home', href: '/' },
        ...(user ? [{ icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }] : []),
    ];




    return (
        <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">

            <div className="max-w-[99%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section - Logo/Brand */}
                    <div className="flex items-center space-x-8">

                        <div className="flex items-center space-x-4">
                            {isAuthenticated && user && (
                                <article className="flex items-center space-x-3">
                                    {/* Profile Icon */}
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-md">
                                        <User className="w-5 h-5 text-white" />
                                    </div>

                                    {/* User Info */}
                                    <aside className="flex flex-col">
                                        {/* Name + Role */}
                                        <article className="flex items-center space-x-2">
                                            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                                                {user.userName || 'User'}
                                            </h3>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.userRoles?.[0]?.role?.roleName || 'User'}
                                            </span>
                                        </article>

                                        {/* Email */}
                                        <p className="text-xs text-gray-500">
                                            {user.email || 'user@example.com'}
                                        </p>
                                    </aside>
                                </article>
                            )}
                        </div>



                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link key={item.label} href={item.href}>
                                    <motion.button
                                        whileHover={{ backgroundColor: '#f3f4f6' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </motion.button>
                                </Link>
                            ))}
                        </div>
                    </div>



                    {/* Right Section - Desktop */}
                    <div className="hidden md:flex items-center space-x-3">


                        {/* Action Icons */}
                        <div className="flex items-center space-x-1">


                            {/* Sign Out Button */}
                            {isAuthenticated && (
                                <motion.button
                                    whileHover={{ backgroundColor: '#fef2f2', scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSignOut}
                                    className="p-2.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200 ml-2"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white border-t border-gray-200 shadow-lg"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {/* Mobile User Info */}
                            {isAuthenticated && user && (
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-md">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {user.userName || 'User'}
                                            </h3>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.userRoles?.[0]?.role?.roleName || 'User'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {user.email || 'user@example.com'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Navigation Items */}
                            {/* {navItems.map((item, index) => (
                                <motion.button
                                    key={item.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-full flex items-center justify-between p-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </motion.button>
                            ))} */}

                            {/* Mobile Search */}
                            <div className="pt-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Create Office Button - Mobile */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md"
                            >
                                Create Office
                            </motion.button>

                            {/* Mobile Action Items */}
                            <div className="pt-2 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-2">
                                    {rightItems.slice(1).map((item, index) => (
                                        <motion.button
                                            key={item.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                                        >
                                            <item.icon className="w-5 h-5 text-gray-500" />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Mobile Sign Out Button */}
                                {isAuthenticated && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={handleSignOut}
                                        className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 mt-3 border border-red-200 hover:border-red-300"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Sign Out</span>
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;