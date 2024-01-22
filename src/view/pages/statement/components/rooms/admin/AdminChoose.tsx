import { FC, useState } from "react";

// Custom components
import RoomParticpantBadge from "../comp/general/RoomParticpantBadge";
import Text from "../../../../../components/text/Text";

// Redux
import { useAppSelector } from "../../../../../../functions/hooks/reduxHooks";
import { participantsSelector } from "../../../../../../model/statements/statementsSlice";

// Third party libraries
import {
    RoomAskToJoin,
    RoomDivied,
    RoomsStateSelection,
    Statement,
} from "delib-npm";
import { t } from "i18next";

// Statments functions
import {
    setParticipantInRoom,
    setRoomsStateToDB,
} from "../../../../../../functions/db/rooms/setRooms";
import { setRoomSizeInStatement } from "../../../../../../functions/db/statements/setStatments";

// Styles
import _styles from "./admin.module.css";

const styles = _styles as any;

interface Props {
    statement: Statement;
}

interface RoomAdmin {
    room: Array<RoomAskToJoin>;
    roomNumber: number;
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
    const participants = useAppSelector(
        participantsSelector(statement.statementId),
    );
    const [setRooms, setSetRooms] = useState<boolean>(true);
    const [roomsAdmin, setRoomsAdmin] = useState<RoomAdmin[]>([]);
    const [maxParticipantsPerRoom, setMaxParticipantsPerRoom] =
        useState<number>(statement.roomSize || 5);

    function handleDivideIntoRooms() {
        try {
            const { rooms } = divideIntoTopics(
                participants,
                maxParticipantsPerRoom,
            );
            setRoomsAdmin(rooms);

            rooms.forEach((room) => {
                room.room.forEach((participant) => {
                    const participantInRoom: ParticipantInRoom = {
                        uid: participant.participant.uid,
                        room: room.roomNumber,
                        roomNumber: room.roomNumber,
                        topic: room.statement,
                        statementId: room.statement.statementId,
                    };
                    setParticipantInRoom(participantInRoom);
                });
            });

            const roomsState = setRooms
                ? RoomsStateSelection.DIVIDE
                : RoomsStateSelection.SELECT_ROOMS;
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
            <p className={styles.title}>{t("Management board")}</p>
            <div>
                <div className="btns">
                    {setRooms ? (
                        <button className="btn btn--agree btn--large" onClick={handleDivideIntoRooms}>
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
                {setRooms ? (
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
                            {/* <Slider
                                defaultValue={statement.roomSize || 7}
                                min={2}
                                max={30}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                onChange={handleRoomSize}
                            /> */}

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
                                    <div
                                        key={room.roomNumber}
                                        className={styles.room}
                                    >
                                        <h4>
                                            {(t("Room"), room.roomNumber)} -{" "}
                                            <Text
                                                text={room.statement.statement}
                                                onlyTitle={true}
                                            />
                                        </h4>
                                        <div className={styles.room__badges}>
                                            {room.room.map(
                                                (
                                                    participant: RoomAskToJoin,
                                                ) => (
                                                    <RoomParticpantBadge
                                                        key={
                                                            participant
                                                                .participant.uid
                                                        }
                                                        participant={
                                                            participant.participant
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
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

function divideIntoTopics(
    participants: RoomAskToJoin[],
    maxPerRoom = 7,
): { rooms: Array<RoomDivied>; topicsParticipants: any } {
    try {
        const topicsParticipants: any = {};

        //build topicsParticipantsObject
        participants.forEach((participant) => {
            try {
                if (!participant.statementId) {
                    topicsParticipants["general"] = {
                        statementId: "general",
                        statement: t("General"),
                        participants: [participant],
                    };
                } else if (!(participant.statementId in topicsParticipants)) {
                    topicsParticipants[participant.statementId] = {
                        statementId: participant.statementId,
                        statement: participant.statement,
                        participants: [participant],
                    };
                } else {
                    topicsParticipants[
                        participant.statementId
                    ].participants.push(participant);
                }
            } catch (error) {
                console.error(error);

                return undefined;
            }
        });

        //divide participents according to topics and rooms
        // let rooms: Array<ParticipantInRoom> = [];
        for (const topic in topicsParticipants) {
            const patricipantsInTopic = topicsParticipants[topic].participants;
            topicsParticipants[topic].rooms =
                divideParticipantsIntoRoomsRandomly(
                    patricipantsInTopic,
                    maxPerRoom,
                );
        }

        const rooms = divideIntoGeneralRooms(topicsParticipants);

        return { rooms, topicsParticipants };
    } catch (error) {
        console.error(error);

        return { rooms: [], topicsParticipants: undefined };
    }
}

function divideParticipantsIntoRoomsRandomly(
    participants: RoomAskToJoin[],
    maxPerRoom: number,
): Array<Array<RoomAskToJoin>> {
    try {
        const numberOfRooms = Math.ceil(participants.length / maxPerRoom);

        //randomize participants
        participants.sort(() => Math.random() - 0.5);

        let roomNumber = 0;

        const rooms: Array<Array<RoomAskToJoin>> = [[]];
        participants.forEach((participant: RoomAskToJoin) => {
            if (!rooms[roomNumber]) rooms[roomNumber] = [];
            rooms[roomNumber].push(participant);
            if (roomNumber < numberOfRooms - 1) roomNumber++;
            else roomNumber = 0;
        });

        return rooms;
    } catch (error) {
        console.error(error);

        return [];
    }
}

function divideIntoGeneralRooms(topics: any): Array<RoomDivied> {
    try {
        let roomNumber = 1;
        const rooms: Array<RoomDivied> = [];
        for (const topic in topics) {
            const topicRooms = topics[topic].rooms;
            topicRooms.forEach((room: Array<RoomAskToJoin>) => {
                rooms.push({
                    room,
                    roomNumber,
                    statement: topics[topic].statement,
                });
                roomNumber++;
            });
        }

        return rooms;
    } catch (error) {
        console.error(error);

        return [];
    }
}
