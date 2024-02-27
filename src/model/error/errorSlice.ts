import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
    message: string | null;
}

const initialState: ErrorState = {
    message: null,
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        clearError: (state) => {
            state.message = null;
        },
    },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice;