import { User } from "delib-npm";
import { FC } from "react";

interface Props {
    participant: User;
}

const RoomParticpantBadge: FC<Props> = ({ participant }) => {
    return (
        <div className="badge dragable" draggable={true} onDragStart={(e)=>{e.dataTransfer.setData('text/plain', participant.uid);}}>
            <div className="badge__text" >{participant.displayName}</div>
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
