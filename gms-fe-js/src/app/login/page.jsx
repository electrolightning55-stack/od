'use client'
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import * as yup from 'yup';
import { publicRequest } from '@/lib/RequestMethods';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slices/userSlice';

// Yup validation schema
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Your email is invalid.')
        .required('Email is required'),
    password: yup
        .string()
        .min(4, 'Password must be at least 4 characters.')
        .required('Password is required')
});

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateField = async (name, value) => {
        try {
            await yup.reach(loginSchema, name).validate(value);
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
            return true;
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [name]: error.message
            }));
            return false;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }

        // Clear API error when user modifies input
        if (apiError) {
            setApiError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError('');

        // First validate the form with Yup
        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const validationErrors = {};
            if (validationError.inner) {
                validationError.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
            }
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        // Make API call
        try {
            const res = await publicRequest.post('/auth/login', formData, { headers: { 'Content-Type': 'application/json' } });



            // Validate response structure
            if (res.data && res.data.data && res.data.data.token) {
                // Store token
                localStorage.setItem("token", res.data.data.token);

                // Get user data from the response
                const userData = res.data.data.user;  // Get the user object from response
                console.log('Full user data:', userData); 
                
                localStorage.setItem("user", JSON.stringify(userData));
                dispatch(loginSuccess(res.data));

                // Set session persistence based on checkbox
                if (keepSignedIn) {
                    localStorage.setItem("keepSignedIn", "true");
                }

                // Check if user is superadmin
                const isSuperAdmin = userData.isSuperAdmin;
                const userRole = userData.role;
                console.log('User Role:', userRole, 'Is SuperAdmin:', isSuperAdmin);
                
                if (isSuperAdmin) {
                    console.log('Redirecting to super admin dashboard');
                    router.push('/super-admin/dashboard');
                } else {
                    console.log('Redirecting to regular dashboard');
                    router.push('/dashboard');
                }
                
                toast.success('Login successful!');
            } else {
                // Handle unexpected response structure
                console.error('Unexpected response structure:', res.data);
                setApiError('Login successful but received unexpected response format.');
            }

        } catch (apiError) {
            console.error('Login API error:', apiError);

            let errorMessage = 'An error occurred during login.';

            if (apiError.response) {
                const status = apiError.response.status;
                const data = apiError.response.data;

                switch (status) {
                    case 401:
                        errorMessage = 'Invalid email or password.';
                        break;
                    case 403:
                        errorMessage = 'Account access denied.';
                        break;
                    case 422:
                        errorMessage = 'Invalid input data.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        if (data && data.message) {
                            errorMessage = data.message;
                        }
                }
            } else if (apiError.request) {
                errorMessage = 'Network error. Please check your connection.';
            }

            setApiError(errorMessage);

            // Show error toast
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <section className="flex items-center justify-center h-screen">
            {/* Left Side - Hero Section with Banner Image */}

            {/* Right Side - Login Form */}
            <div className="">
                <div className="w-full ">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
                        <p className="mt-2 text-gray-600">Sign in to your account to start using Dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* API Error Display */}
                        {apiError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{apiError}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={(e) => validateField(e.target.name, e.target.value)}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className='mb-4'>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                        } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Keep Me Signed In & Forgot Password */}
                        {/* <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="keepSignedIn"
                                    checked={keepSignedIn}
                                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                                    disabled={isLoading}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                                />
                                <label htmlFor="keepSignedIn" className="ml-2 text-sm text-gray-700">
                                    Keep Me Signed In
                                </label>
                            </div>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                                Forgot Password?
                            </a>
                        </div> */}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;