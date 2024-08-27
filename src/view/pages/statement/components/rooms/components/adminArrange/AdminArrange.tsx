import { FC, useState } from "react";

// Custom components
import RoomParticipantBadge from "../roomParticipantBadge/RoomParticipantBadge";

// Redux
import { useAppSelector } from "@/controllers/hooks/reduxHooks";

// Third party libraries
import {  RoomsStateSelection, Statement } from "delib-npm";

// Statements functions

import { setRoomSizeInStatementDB } from "@/controllers/db/statements/setStatements";

import { divideIntoTopics } from "./AdminArrangeCont";
import { participantsSelector } from "@/model/rooms/roomsSlice";
import Room from "../room/Room";
import {
	initializeTimersDB,
	updateTimersSettingDB,
} from "@/controllers/db/timer/setTimer";
import { selectStatementSettingTimers } from "@/model/timers/timersSlice";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import "./AdminArrange.scss";

interface Props {
    statement: Statement;
    setRooms: boolean;
    setSetRooms: React.Dispatch<React.SetStateAction<boolean>>;
}



const AdminSeeAllGroups: FC<Props> = ({ statement, setRooms, setSetRooms }) => {
	const { t } = useLanguage();

	const roomsState = statement.roomsState || RoomsStateSelection.chooseRoom;
	const participants = useAppSelector(
		participantsSelector(statement.statementId),
	);
	const timers = useAppSelector(
		selectStatementSettingTimers(statement.statementId),
	);

	const [maxParticipantsPerRoom, setMaxParticipantsPerRoom] =
        useState<number>(statement.roomSize || 5);

	const { rooms: roomsAdmin } = divideIntoTopics(
		participants,
		maxParticipantsPerRoom,
	);

	async function handleDivideIntoRooms() {
		try {
			const { rooms } = divideIntoTopics(
				participants,
				maxParticipantsPerRoom,
			);

			rooms.forEach((room) => {
				room.participants.forEach((participant) => {
					// const participantInRoom: ParticipantInRoom = {
					// 	uid: participant.participant.uid,
					// 	room: room.roomNumber,
					// 	roomNumber: room.roomNumber,
					// 	topic: room.statement,
					// 	statementId: room.statement.statementId,
					// };
					// setParticipantInRoomToDB(participantInRoom);
				});
			});

			//set timers settings to db
			await updateTimersSettingDB(timers);

			//set rooms timers
			initializeTimersDB({
				statementId: statement.statementId,
				rooms,
			});

			

		
		} catch (error) {
			console.error(error);
		}
	}

	function handleRangeChange(ev: React.ChangeEvent<HTMLInputElement>) {
		setMaxParticipantsPerRoom(Number(ev.target.value));
	}

	function handleRangeBlur() {
		setMaxParticipantsPerRoom(maxParticipantsPerRoom);
		setRoomSizeInStatementDB(statement, maxParticipantsPerRoom);
	}

	return (
		<div className="admin-arrange">
			<div>
				<div className="btns">
					{roomsState === RoomsStateSelection.chooseRoom ? (
						<button
							className="btn btn--agree btn--large"
							onClick={handleDivideIntoRooms}
						>
							{t("Divide into rooms")}
						</button>
					) : (
						<button
							className="btn btn--cancel btn--large"
							onClick={handleDivideIntoRooms}
						>
							{t("Cancellation of division")}
						</button>
					)}
				</div>
				{roomsState === RoomsStateSelection.chooseRoom ? (
					<div>
						<h3>{t("Participants")}</h3>
						<p>
							{
								(t(
									"Maximum number of participants in the room ",
								),
								maxParticipantsPerRoom)
							}
						</p>

						<div
							className="btns"
							style={{
								padding: "1.5rem",
								boxSizing: "border-box",
							}}
						>
							<input
								className="range"
								type="range"
								name="numberOfResults"
								value={maxParticipantsPerRoom || 7}
								min="2"
								max="30"
								onChange={handleRangeChange}
								onMouseUp={handleRangeBlur}
								onTouchEnd={handleRangeBlur}
							/>
						</div>
						<br />
						<br />
						<div className="badge__wrapper">
							{participants.map((request) => (
								<RoomParticipantBadge
									key={request.participant.uid}
									participant={request.participant}
								/>
							))}
						</div>
					</div>
				) : (
					<>
						<h3>{t("Division into rooms")}</h3>
						<div className="room-wrapper">
							{/* {roomsAdmin.map((room: RoomDivied) => {
								return (
									<Room
										key={room.roomNumber}
										room={room}
										maxParticipantsPerRoom={
											maxParticipantsPerRoom
										}
									/>
								);
							})} */}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AdminSeeAllGroups;
