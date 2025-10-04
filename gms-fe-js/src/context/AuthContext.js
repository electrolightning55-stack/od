"use client"
import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [users, setUsers] = useState(null);

    return (
        <AuthContext.Provider value={{ users, setUsers }}>
            {children}
        </AuthContext.Provider>
    );


}