import { FC } from "react";
import styles from "./Room.module.scss";
import Text from "../../../../../../components/text/Text";
import { Participant, RoomDivied } from "delib-npm";
import RoomParticpantBadge from "../../comp/general/RoomParticpantBadge";
import { setRoomJoinToDB } from "../../../../../../../controllers/db/rooms/setRooms";
import { store } from "../../../../../../../model/store";
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";

interface Props {
    room: RoomDivied;
    maxParticipantsPerRoom: number;
}

const Room: FC<Props> = ({ room, maxParticipantsPerRoom }) => {
    const { t } = useLanguage();

    function handleMoveParticipantToRoom(ev: any) {
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
                {room.participants.map((participant: Participant) => (
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
