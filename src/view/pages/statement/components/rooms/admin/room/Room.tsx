import { FC } from "react";
import styles from "./Room.module.scss";
import Text from "../../../../../../components/text/Text";
import { RoomAskToJoin } from "delib-npm";
import RoomParticpantBadge from "../../comp/general/RoomParticpantBadge";
import { t } from "i18next";
import { RoomAdmin } from "../../../../../../../model/rooms/roomsSlice";

interface Props {
    room: RoomAdmin;
}

const Room: FC<Props> = ({ room }) => {
    function handleMoveParticipantToRoom(ev: any) {
        try {
            ev.preventDefault();
            console.log("drop");
            const draggedParticipant = ev.dataTransfer.getData("text/plain");
            console.log(room.roomNumber, draggedParticipant);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div
            className={styles.room}
            onDragEnter={(ev: any) => {
                ev.preventDefault();
            }}
            onDragLeave={(ev: any) => {
                ev.preventDefault();
            }}
            onDragOver={(ev: any) => {
                ev.preventDefault();
            }}
            onDrop={handleMoveParticipantToRoom}
        >
            <h4>
                {(t("Room"), room.roomNumber)} -{" "}
                <Text text={room.statement.statement} onlyTitle={true} />
            </h4>
            <div className={styles.room__badges}>
                {room.room.map((participant: RoomAskToJoin) => (
                    <RoomParticpantBadge
                        key={participant.participant.uid}
                        participant={participant.participant}
                    />
                ))}
            </div>
        </div>
    );
};

export default Room;
