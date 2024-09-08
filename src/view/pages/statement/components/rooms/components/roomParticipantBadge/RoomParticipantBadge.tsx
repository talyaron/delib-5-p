import { ParticipantInRoom } from "delib-npm";
import { FC } from "react";
import "./RoomParticipantBadge.scss";

interface Props {
    participant: ParticipantInRoom;
}

const RoomParticipantBadge: FC<Props> = ({ participant }) => {
	return (
		<div
			className="room-participant-badge draggable"
			draggable={true}
			onDragStart={(e) => {
				e.dataTransfer.setData("text/plain", participant.user.uid);
			}}
		>
			<div className="badge-text">{participant.user.displayName}</div>
			{participant.user.photoURL ? (
				<div
					className="badge-image"
					style={{ backgroundImage: `url(${participant.user.photoURL})` }}
				/>
			) : null}
		</div>
	);
};

export default RoomParticipantBadge;
