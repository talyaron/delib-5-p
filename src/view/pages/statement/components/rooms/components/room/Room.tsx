import { FC } from "react";
import Text from "../../../../../../components/text/Text";
import { Participant, RoomDivied } from "delib-npm";
import RoomParticipantBadge from "../roomParticipantBadge/RoomParticipantBadge";
import { setRoomJoinToDB } from "@/controllers/db/rooms/setRooms";
import { store } from "@/model/store";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import "./Room.scss";

interface Props {
    room: RoomDivied;
    maxParticipantsPerRoom: number;
}

const Room: FC<Props> = ({ room, maxParticipantsPerRoom }) => {
	const { t } = useLanguage();

	function handleMoveParticipantToRoom(ev: React.DragEvent<HTMLDivElement>) {
		try {
			ev.preventDefault();

			const draggedParticipantId = ev.dataTransfer.getData("text/plain");

			const participant = store
				.getState()
				.rooms.askToJoinRooms.find(
					(participant: Participant) =>
						participant.participant.uid === draggedParticipantId,
				);

			if (!participant) throw new Error("participant not found");

			if (participant.roomNumber === room.roomNumber) return;

			if (room.participants.length >= maxParticipantsPerRoom) {
				alert("room is full");

				return;
			}
			setRoomJoinToDB(
				room.statement,
				participant.participant,
				room.roomNumber,
			);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div
			className="room"
			onDragEnter={(ev) => {
				ev.preventDefault();
			}}
			onDragLeave={(ev) => {
				ev.preventDefault();
			}}
			onDragOver={(ev) => {
				ev.preventDefault();
			}}
			onDrop={handleMoveParticipantToRoom}
		>
			<h4>
				{(t("Room"), room.roomNumber)} -{" "}
				<Text text={room.statement.statement} onlyTitle={true} />
			</h4>
			<div className="room-badges">
				{room.participants.map((participant: Participant) => (
					<RoomParticipantBadge
						key={participant.participant.uid}
						participant={participant.participant}
					/>
				))}
			</div>
		</div>
	);
};

export default Room;
