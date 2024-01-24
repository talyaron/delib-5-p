import { FC, useState } from "react";

// Custom components
import RoomParticpantBadge from "../comp/general/RoomParticpantBadge";

// Redux
import { useAppSelector } from "../../../../../../functions/hooks/reduxHooks";


// Third party libraries
import {
    RoomsStateSelection,
    Statement,
} from "delib-npm";
import { t } from "i18next";

// Statments functions
import {
    setParticipantInRoomToDB,
    setRoomsStateToDB,
} from "../../../../../../functions/db/rooms/setRooms";
import { setRoomSizeInStatement } from "../../../../../../functions/db/statements/setStatments";

// Styles
import _styles from "./admin.module.css";

import { divideIntoTopics } from "./AdminArrangeCont";
import { RoomAdmin, participantsSelector } from "../../../../../../model/rooms/roomsSlice";
import Room from "./room/Room";



const styles = _styles as any;

interface Props {
    statement: Statement;
}

export interface ParticipantInRoom {
    uid: string;
    room: number;
    roomNumber?: number;
    topic?: Statement;
    statementId?: string;
}

const AdminSeeAllGroups: FC<Props> = ({ statement }) => {
    const roomsState  = statement.roomsState || RoomsStateSelection.chooseRoom;
    const participants = useAppSelector(
        participantsSelector(statement.statementId),
    );

    const [setRooms, setSetRooms] = useState<boolean>(true);
    const [maxParticipantsPerRoom, setMaxParticipantsPerRoom] =
        useState<number>(statement.roomSize || 5);

    const { rooms:roomsAdmin } = divideIntoTopics(participants, maxParticipantsPerRoom);
    

    function handleDivideIntoRooms() {
        try {
            const { rooms } = divideIntoTopics(
                participants,
                maxParticipantsPerRoom,
            );
            // setRoomsAdmin(rooms);

            rooms.forEach((room) => {
                room.room.forEach((participant) => {
                    const participantInRoom: ParticipantInRoom = {
                        uid: participant.participant.uid,
                        room: room.roomNumber,
                        roomNumber: room.roomNumber,
                        topic: room.statement,
                        statementId: room.statement.statementId,
                    };
                    setParticipantInRoomToDB(participantInRoom);
                });
            });

            const roomsState = setRooms
                ? RoomsStateSelection.chooseRoom
                : RoomsStateSelection.inRoom;
            setSetRooms((state) => !state);

            setRoomsStateToDB(statement, roomsState);
        } catch (error) {
            console.error(error);
        }
    }

    function handleRoomSize(ev: any) {
        const value = ev.target.value;
        const valueAsNumber = Number(value);
        setMaxParticipantsPerRoom(valueAsNumber);
        setRoomSizeInStatement(statement, valueAsNumber);
    }

    return (
        <div>     
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
                                value={statement.roomSize || 7}
                                min="2"
                                max="30"
                                onChange={handleRoomSize}
                            />
                        </div>
                        <br />
                        <br />
                        <div className="badge__wrapper">
                            {participants.map((request) => (
                                <RoomParticpantBadge
                                    key={request.participant.uid}
                                    participant={request.participant}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <h3>{t("Division into rooms")}</h3>
                        <div className={styles.roomWrapper}>
                            {roomsAdmin.map((room: RoomAdmin) => {
                                return (
                                    <Room key={room.roomNumber} room={room} maxParticipantsPerRoom={maxParticipantsPerRoom} />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminSeeAllGroups;


