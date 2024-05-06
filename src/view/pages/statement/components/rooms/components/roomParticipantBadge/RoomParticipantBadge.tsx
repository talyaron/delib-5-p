import { User } from "delib-npm";
import { FC } from "react";

interface Props {
    participant: User;
}

const RoomParticipantBadge: FC<Props> = ({ participant }) => {
    return (
        <div
            className="room-participant-badge draggable"
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", participant.uid);
            }}
        >
            <div className="badge-text">{participant.displayName}</div>
            {participant.photoURL ? (
                <div
                    className="badge-image"
                    style={{ backgroundImage: `url(${participant.photoURL})` }}
                />
            ) : null}
        </div>
    );
};

export default RoomParticipantBadge;
