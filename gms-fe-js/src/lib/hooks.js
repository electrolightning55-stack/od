'use client';
import { useSelector } from 'react-redux';


export const useCurrentUser = () => {
    const { currentUser, isFetching, error } = useSelector((state) => state.user ? state.user : null);

    return {
        currentUser,
        isLoading: isFetching,
        isAuthenticated: !!currentUser,
        error,
        user: currentUser?.data?.user || null, // Fixed: Added null check with optional chaining
    };
};


export const useIsAuthenticated = () => {
    const { currentUser } = useSelector((state) => state.user);
    return !!currentUser;
}; 