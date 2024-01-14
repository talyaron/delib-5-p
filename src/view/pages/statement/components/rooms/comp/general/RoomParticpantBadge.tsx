import { User } from "delib-npm";
import { FC } from "react";

interface Props {
    participant: User;
}

const RoomParticpantBadge: FC<Props> = ({ participant }) => {
    return (
        <div className="badge">
            <div className="badge__text">{participant.displayName}</div>
            {participant.photoURL ? (
                <div
                    className="badge__img"
                    style={{ backgroundImage: `url(${participant.photoURL})` }}
                />
            ) : null}
        </div>
    );
};

export default RoomParticpantBadge;
