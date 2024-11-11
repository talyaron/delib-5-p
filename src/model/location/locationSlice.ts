import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface InitLocationState {
	path: string;
	version: string;
}

const initialState: InitLocationState = {
	path: '',
	version: '',
};

export const initLocationSlice = createSlice({
	name: 'initLocation',
	initialState,
	reducers: {
		setInitLocation: (state, action: PayloadAction<string>) => {
			state.path = action.payload;
		},
		setVersion: (state, action: PayloadAction<string>) => {
			state.version = action.payload;
		},
	},
});

export const { setInitLocation, setVersion } = initLocationSlice.actions;

export const selectInitLocation = (state: RootState) => state.initLocation.path;
export const versionSelector = (state: RootState) => state.initLocation.version;

export default initLocationSlice.reducer;
