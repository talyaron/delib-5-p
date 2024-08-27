import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  ParticipantInRoom, RoomSettings } from "delib-npm";
import { updateArray } from "@/controllers/general/helpers";
import { RootState } from "../store";


interface RoomsState {
	participants: ParticipantInRoom[];
	roomsSettings: RoomSettings[];
}

const initialState: RoomsState = {
	participants: [],
	roomsSettings: [],
};

export const roomsSlice = createSlice({
	name: "rooms",
	initialState,
	reducers: {
		setRoom: (
			state,
			action: PayloadAction<ParticipantInRoom>,
		) => {
			try {
				state.participants = updateArray(state.participants, action.payload, "participantInRoomId");
			} catch (error) {
				console.error(error);
			}
		},
		setRooms: (
			state,
			action: PayloadAction<ParticipantInRoom[]>,
		) => {
			try {
				const participants = action.payload;
				participants.forEach((room) => {
					state.participants = updateArray(state.participants, room, "participantInRoomId");
				});
			} catch (error) {
				console.error(error);
			}
		},
		deleteRoom: (
			state,
			action: PayloadAction<ParticipantInRoom>,
		) => {
			try {
				state.participants = state.participants.filter(
					(room) => room.participantInRoomId !== action.payload.participantInRoomId,
				);
			} catch (error) {
				console.error(error);
			}
		},
		setRoomSettings: (
			state,
			action: PayloadAction<RoomSettings>,
		) => {
			try {
				state.roomsSettings = updateArray(state.roomsSettings, action.payload, "statementId");
			} catch (error) {
				console.error(error);
			}
		}
	},
});

export const { setRoom,setRooms,deleteRoom,setRoomSettings} =
	roomsSlice.actions;

export const participantsByTopicId =
	(topicId: string | undefined) => createSelector(
		(state: RootState) => state.rooms.participants,
		(prt) => prt.filter(
			(prt) => prt.statement.statementId === topicId,
		)
	);

	export const roomSettingsByStatementId =
	(statementId: string | undefined) => createSelector(
		(state: RootState) => state.rooms.roomsSettings,
		(roomsSettings) => roomsSettings.find(
			(rs) => rs.statementId === statementId,
		)
	);




export default roomsSlice.reducer;
