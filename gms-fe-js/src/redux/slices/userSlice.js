import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",

    initialState: {
        currentUser: null,
        token: null,
        isFetching: false,
        error: false
    },

    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        loginSuccess: (state, action) => {
            const payload = action.payload;
            state.isFetching = false;
            
            // Ensure we have data in the payload
            if (!payload?.data) {
                console.error('Login success called with invalid payload:', payload);
                state.error = 'Invalid login response';
                return;
            }

            const { token, user } = payload.data;

            // Store token
            state.token = token;
            
            // Store user data with features
            state.currentUser = {
                ...user,
                features: user.features || []  // Ensure features array exists
            };
            
            // Log warning if no features found
            if (!user.features?.length) {
                console.warn('User has no features assigned:', user.email);
            }

            // Set isSuperAdmin from user data
            state.currentUser.isSuperAdmin = user.isSuperAdmin || false;
            
            // Clear any previous errors
            state.error = false;
            
            // Log final state for debugging
            console.log('Redux user state after login:', {
                email: user.email,
                features: state.currentUser.features,
                isSuperAdmin: state.currentUser.isSuperAdmin,
                token
            });
        },

        loginFailure: (state, action) => {
            state.isFetching = false;
            state.error = action.payload || true;
            state.currentUser = null;
            state.token = null;
        },

        signOut: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isFetching = false;
            state.error = false;
        },

        // Action to update token without full login
        setToken: (state, action) => {
            state.token = action.payload;
        },

        // Action to clear token
        clearToken: (state) => {
            state.token = null;
        },
    },
});

export const {
    loginFailure,
    loginStart,
    loginSuccess,
    signOut,
    setToken,
    clearToken
} = userSlice.actions;

export default userSlice.reducer;