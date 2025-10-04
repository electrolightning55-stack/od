/**
 * Simple utility functions for processing deduction data
 */

/**
 * Process deductions and calculate totals by type
 * @param {Array} deductions - Array of deduction objects
 * @returns {Object} - Totals for each deduction type
 */
export const calculateDeductionTotals = (deductions = []) => {
    const totals = {
        sessiPessiFund: 0,
        eobiFund: 0,
        insurance: 0,
        advances: 0,
        loanRepayment: 0,
        penalty: 0,
        miscCharges: 0
    };

    deductions.forEach(deduction => {
        const type = deduction.deductionType;
        const amount = parseFloat(deduction.amount) || 0;

        if (totals.hasOwnProperty(type)) {
            totals[type] += amount;
        }
    });

    return totals;
};

/**
 * Transform only deduction data for table display
 * @param {Array} apiData - Raw API data
 * @returns {Array} - Data with calculated deduction totals
 */
export const transformDeductionData = (apiData = []) => {
    return apiData.map((guard) => {
        const deductionTotals = calculateDeductionTotals(guard.deductions);

        return {
            ...guard, // Keep all original data
            deductionTotals // Add calculated deduction totals
        };
    });
};
