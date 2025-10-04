export const formatDate = (dateString) => {
    if (!dateString) return "—"; // fallback for null/empty
    const date = new Date(dateString);
    //jan 1, 2021
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const getCurrentDateISO = () => {
    return new Date().toISOString();
};

