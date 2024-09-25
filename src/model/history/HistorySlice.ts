import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Screen } from "delib-npm";
import { processHistory } from "@/controllers/general/helpers";

export interface HistoryTracker {
    statementId: string;
    screen:Screen;
}

interface HistoryState {
	history: HistoryTracker[];
}


const historyState: HistoryState = {
	history: []
};

export const historySlice = createSlice({
	name: "history",
	initialState: historyState, 
	reducers: {
		setHistory: (state, action: PayloadAction<string>) => {
			const pathname = action.payload;
			state.history = processHistory(pathname, state.history);
		},
        
	},
});



export const { setHistory} = historySlice.actions;

export const historySelect = (statementId:string)=> (state: RootState) => state.history.history.find((history) => history.statementId === statementId);

export default historySlice.reducer;