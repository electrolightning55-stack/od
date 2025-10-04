'use client';

import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Default options for all toasts
                duration: 5000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    maxWidth: '500px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                // Success toast styling
                success: {
                    style: {
                        background: '#10b981',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10b981',
                    },
                },
                // Error toast styling  
                error: {
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#ef4444',
                    },
                },
                // Loading toast styling
                loading: {
                    style: {
                        background: '#3b82f6',
                        color: '#fff',
                    },
                },
                // Warning toast styling
                warning: {
                    style: {
                        background: '#f59e0b',
                        color: '#fff',
                    },
                },
            }}
        />
    );
};

export default ToasterProvider; 