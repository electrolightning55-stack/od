"use client"
import { createContext, useState } from "react";

const PayrollContext = createContext();

export const PayrollProvider = ({ children }) => {

    const [globalPayrollFilters, setGlobalPayrollFilters] = useState(null);
    const [globalLockDate, setGlobalLockDate] = useState(null);


    return (
        <PayrollContext.Provider value={{ globalPayrollFilters, setGlobalPayrollFilters, globalLockDate, setGlobalLockDate }}>
            {children}
        </PayrollContext.Provider>
    );
}

export default PayrollContext;