import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Screen } from "delib-npm";

export interface HistoryObject {
    statementId: string;
    subScreen:Screen
}

interface HistoryState {
    history: HistoryObject[];
}

const historyState: HistoryState = {
    history: [],
};

export const historySlice = createSlice({
    name: "history",
    initialState: historyState, 
    reducers: {
        addHistory: (state, action: PayloadAction<HistoryObject>) => {
            const { subScreen, statementId } = action.payload;
            state.history.push({ subScreen, statementId });
        },
    },
});

export const { addHistory } = historySlice.actions;

export const historySelect = (statementId:string)=> (state: RootState) => state.history.history.find((history)=> history.statementId === statementId);

export default historySlice.reducer;