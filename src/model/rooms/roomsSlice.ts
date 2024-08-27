import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  Participant, ParticipantInRoom, Statement } from "delib-npm";
import { updateArray } from "@/controllers/general/helpers";
import { RootState } from "../store";

export interface RoomAdmin {
	room: Array<Participant>;
	roomNumber: number;
	statement: Statement;
}
interface RoomsState {
	rooms: ParticipantInRoom[];
}

const initialState: RoomsState = {
	rooms: [],
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
				state.rooms = updateArray(state.rooms, action.payload, "participantInRoomId");
			} catch (error) {
				console.error(error);
			}
		},
		setRooms: (
			state,
			action: PayloadAction<ParticipantInRoom[]>,
		) => {
			try {
				const rooms = action.payload;
				rooms.forEach((room) => {
					state.rooms = updateArray(state.rooms, room, "participantInRoomId");
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
				state.rooms = state.rooms.filter(
					(room) => room.participantInRoomId !== action.payload.participantInRoomId,
				);
			} catch (error) {
				console.error(error);
			}
		}
	},
});

export const { setRoom,setRooms,deleteRoom} =
	roomsSlice.actions;

export const participantsByTopicId =
	(topicId: string | undefined) => createSelector(
		(state: RootState) => state.rooms.rooms,
		(prt) => prt.filter(
			(prt) => prt.statement.statementId === topicId,
		)
	);




export default roomsSlice.reducer;
