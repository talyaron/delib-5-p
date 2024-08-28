import { FC } from "react";
import styles from "./RoomsView.module.scss";
import Button from "@/view/components/buttons/button/Button";
import { ParticipantInRoom, Statement } from "delib-npm";
import {
	clearRoomsToDB,
	toggleRoomEditingInDB,
} from "@/controllers/db/rooms/setRooms";
import Room from "../../room/Room";

interface Props {
  statement: Statement;
  participants: ParticipantInRoom[];
}

const RoomsView: FC<Props> = ({ statement, participants }) => {
	function handleToggleEdit() {
		toggleRoomEditingInDB(statement.statementId);
		clearRoomsToDB(participants);
	}

	return (
		<div className={styles.view}>
			<div className="btns">
				<Button text="Close Rooms" onClick={handleToggleEdit} />
			</div>
			<div className={styles.rooms}>
				{sortIntoRooms(participants).map((roomParticipants, index) => (
					<Room
						key={index}
						participants={roomParticipants}
						roomNumber={index + 1}
						topic={roomParticipants[0].statement}
					/>
				))}
			</div>
		</div>
	);
};

export default RoomsView;

function sortIntoRooms(
	participants: ParticipantInRoom[]
): ParticipantInRoom[][] {
	const rooms: ParticipantInRoom[][] = [];
	participants.forEach((participant) => {
    
		if (!participant.roomNumber) return;

		const roomIndex = participant.roomNumber - 1;
		if (!rooms[roomIndex]) {
			rooms[roomIndex] = [];
		}
		rooms[roomIndex].push(participant);
	});
  
	return rooms;
}
