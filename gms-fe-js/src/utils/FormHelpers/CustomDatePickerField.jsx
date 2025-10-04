'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import { useField, useFormikContext } from 'formik';
import 'react-datepicker/dist/react-datepicker.css';
import {isSameDay } from 'date-fns';

// Dummy example of marked dates
const markedDates = [
    new Date('2025-07-01'),
    new Date('2025-07-02'),
    new Date('2025-07-03'),
    new Date('2025-07-04'),
    new Date('2025-07-05'),
    new Date('2025-07-06'),
    new Date('2025-07-07'),
    new Date('2025-07-08'),
    new Date('2025-07-09'),
    new Date('2025-07-10'),
    new Date('2025-07-11'),
    new Date('2025-07-12'),
    new Date('2025-07-13'),
    new Date('2025-07-14'),
    new Date('2025-07-15'),
];


const isMarkedDate = (date) => {
    return markedDates.some((marked) => isSameDay(marked, date));
};

const CustomDatePickerField = ({ name }) => {
    const [field, , helpers] = useField(name);
    const { setFieldValue } = useFormikContext();

    return (
        <div className='w-full'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
            </label>
            <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(val) => setFieldValue(name, val)}
                dayClassName={(date) =>
                    isMarkedDate(date)
                        ? 'bg-green-100 text-green-900 font-semibold'
                        : 'bg-red-200 text-red-900'
                }
                className="w-full px-4 py-3 bg-formBgLightBlue border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholderText="Select a date"
                calendarClassName="custom-calendar"
            />
        </div>
    );
};

export default CustomDatePickerField;
