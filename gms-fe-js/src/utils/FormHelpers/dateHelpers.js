// Extract year and month from a date string (format: YYYY-MM-DD)
export const getYearAndMonth = (dateString) => {
    const date = new Date(dateString);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // JavaScript months are 0-based
    };
};

// Get number of days in a given month/year
export const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate(); // Month is 1-based
};

export const DateInISOFormat = (date) => {
    if (!date) return null;
    try {
        return new Date(date).toISOString(); // full ISO string
    } catch (err) {
        console.error('Invalid date input:', date);
        return null;
    }
};
