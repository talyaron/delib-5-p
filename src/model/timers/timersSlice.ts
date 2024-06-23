import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RoomTimer, SetTimer } from "delib-npm";
import { updateArray } from "../../controllers/general/helpers";

export enum Status {
    idle = "idle",
    loading = "loading",
    failed = "failed",
}

// Define a type for the slice state
interface TimersState {
    roomTimers: RoomTimer[];
    settingTimers: SetTimer[];
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
		setSetTimer: (state, action: PayloadAction<SetTimer>) => {
			const timer = action.payload;
			state.settingTimers = updateArray(
				state.settingTimers,
				timer,
				"timerId",
			);
		},
		setSetTimerTitle: (
			state,
			action: PayloadAction<{ timerId: string; title: string }>,
		) => {
			const { timerId, title } = action.payload;
			const timer = state.settingTimers.find(
				(timer) => timer.timerId === timerId,
			);
			if (timer) {
				timer.title = title;
			}
		},
		setSetTimerTime: (
			state,
			action: PayloadAction<{ timerId: string; time: number }>,
		) => {
			const { timerId, time } = action.payload;
			const timer = state.settingTimers.find(
				(timer) => timer.timerId === timerId,
			);
			if (timer) {
				timer.time = time;
			}
		},
		setRoomTimers: (state, action: PayloadAction<RoomTimer[]>) => {
			state.roomTimers = action.payload;
		},
	},
});

export const { setSetTimer, setSetTimerTitle, setSetTimerTime, setRoomTimers } =
    timersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTimersSetting = (state: RootState) =>
	state.timers.settingTimers;
export const selectStatementSettingTimers = (statementId: string) => {
	return createSelector(
		(state: RootState) => state.timers.settingTimers,
		(settingTimers) =>
			settingTimers.filter((timer) => timer.statementId === statementId)
	);
};

export const selectRoomTimers = (state: RootState) => state.timers.roomTimers;
export const selectTimerByTimerId = (roomTimerId: string) => (state: RootState) => state.timers.roomTimers.find((timer: RoomTimer | undefined) => timer?.roomTimerId === roomTimerId);

export default timersSlice.reducer;
