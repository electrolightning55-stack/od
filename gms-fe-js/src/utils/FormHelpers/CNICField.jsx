// components/CNICInput.js


import React from 'react';
import { useField, ErrorMessage } from 'formik';

const CNICInput = ({ label = 'CNIC Number', ...props }) => {
    const [field, meta, helpers] = useField(props);

    const formatCNIC = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 13); // Max 13 digits
        let formatted = digits;

        if (digits.length > 5) {
            formatted = digits.slice(0, 5) + '-' + digits.slice(5);
        }
        if (digits.length > 12) {
            formatted = formatted.slice(0, 13) + '-' + formatted.slice(13);
        }

        return formatted;
    };

    const handleChange = (e) => {
        const formatted = formatCNIC(e.target.value);
        helpers.setValue(formatted);
    };

    return (
        <div>
           
            <input
                {...field}
                {...props}
                value={field.value}
                onChange={handleChange}
                placeholder="Enter CNIC Number (12345-1234567-1)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm mt-1" />
        </div>
    );
};

export default CNICInput;
