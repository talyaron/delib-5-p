import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { processHistory } from '@/controllers/general/helpers';

export interface HistoryTracker {
	statementId?: string;
	pathname: string;
}

interface HistoryState {
	history: HistoryTracker[];
}

const historyState: HistoryState = {
	history: [],
};

export const historySlice = createSlice({
	name: 'history',
	initialState: historyState,
	reducers: {
		setHistory: (state, action: PayloadAction<HistoryTracker>) => {
			const { statementId, pathname } = action.payload;
			state.history = processHistory({ statementId, pathname }, state.history);
		},
	},
});

export const { setHistory } = historySlice.actions;

//@ts-ignore
export const historySelect = (statementId: string) => (state: RootState) =>
	state.history.history.findLast(
		(history: HistoryTracker) => history.statementId === statementId
	);

export default historySlice.reducer;
