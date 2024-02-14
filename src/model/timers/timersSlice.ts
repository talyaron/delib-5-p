import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RoomTimer, SetTimer } from "delib-npm";
import { updateArray } from "../../functions/general/helpers";


export enum Status {
    idle = "idle",
    loading = "loading",
    failed = "failed",
}

// Define a type for the slice state
interface TimersState {
    roomTimers: RoomTimer[];
    settingTimers:SetTimer[];
}

// Define the initial state using that type
const initialState: TimersState = {
    roomTimers: [],
    settingTimers: [],
};

export const timersSlice = createSlice({
    name: "timers",
    initialState,
    reducers: {
        setTimmerSetting: (state, action: PayloadAction<SetTimer[]>) => {
            const timer = action.payload;
            state.settingTimers = updateArray(state.settingTimers, timer, "timerId");
        }
    },
});

export const {
    setTimmerSetting
} = timersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTimersSetting = (state: RootState) => state.timers.settingTimers;
export const selectStatementSettingTimers = (state: RootState, statementId: string) => state.timers.settingTimers.filter((timer) => timer.statementId === statementId);

export default timersSlice.reducer;
