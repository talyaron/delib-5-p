import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Screen } from "delib-npm";

export interface HistoryObject {
    statementId: string;
    subScreen:Screen;
}

interface HistoryState {
    history: {
        [key: string]: Screen;
    };
}

const historyState: HistoryState = {
	history: {},
};

export const historySlice = createSlice({
	name: "history",
	initialState: historyState, 
	reducers: {
		setHistory: (state, action: PayloadAction<HistoryObject>) => {
			const { subScreen, statementId } = action.payload;
			state.history[statementId] = subScreen;
		},
        
	},
});



export const { setHistory} = historySlice.actions;

export const historySelect = (statementId:string)=> (state: RootState) => state.history.history[statementId];

export default historySlice.reducer;