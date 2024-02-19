import { FC, useState } from "react";

// Custom components
import RoomParticpantBadge from "../comp/general/RoomParticpantBadge";

// Redux
import { useAppSelector } from "../../../../../../functions/hooks/reduxHooks";

// Third party libraries
import { RoomDivied, RoomsStateSelection, Statement } from "delib-npm";

// Statments functions
import {
    setParticipantInRoomToDB,
    setRoomsStateToDB,
} from "../../../../../../functions/db/rooms/setRooms";
import { setRoomSizeInStatementDB } from "../../../../../../functions/db/statements/setStatments";

// Styles
import _styles from "./admin.module.css";

import { divideIntoTopics } from "./AdminArrangeCont";
import { participantsSelector } from "../../../../../../model/rooms/roomsSlice";
import Room from "./room/Room";
import {
    initilizeTimersDB,
    updateTimersSettingDB,
} from "../../../../../../functions/db/timer/setTimer";
import { selectStatementSettingTimers } from "../../../../../../model/timers/timersSlice";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

const styles = _styles as any;

interface Props {
    statement: Statement;
    setRooms: boolean;
    setSetRooms: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ParticipantInRoom {
    uid: string;
    room: number;
    roomNumber?: number;
    topic?: Statement;
    statementId?: string;
}

const AdminSeeAllGroups: FC<Props> = ({ statement, setRooms, setSetRooms }) => {
    const { languageData } = useLanguage();

    const roomsState = statement.roomsState || RoomsStateSelection.chooseRoom;
    const participants = useAppSelector(
        participantsSelector(statement.statementId),
    );
    const timers = useAppSelector(
        selectStatementSettingTimers(statement.statementId),
    );

    const [maxParticipantsPerRoom, setMaxParticipantsPerRoom] =
        useState<number>(statement.roomSize || 5);

    const { rooms: roomsAdmin } = divideIntoTopics(
        participants,
        maxParticipantsPerRoom,
    );

    async function handleDivideIntoRooms() {
        try {
            const { rooms } = divideIntoTopics(
                participants,
                maxParticipantsPerRoom,
            );

            rooms.forEach((room) => {
                room.participants.forEach((participant) => {
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

            //set timers settings to db
            await updateTimersSettingDB(timers);

            //set rooms timers
            initilizeTimersDB({
                statementId: statement.statementId,
                rooms,
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

    function handleRangeChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setMaxParticipantsPerRoom(Number(ev.target.value));
    }

    function handleRangeBlur() {
        setMaxParticipantsPerRoom(maxParticipantsPerRoom);
        setRoomSizeInStatementDB(statement, maxParticipantsPerRoom);
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
                            {languageData["Divide into rooms"]}
                        </button>
                    ) : (
                        <button
                            className="btn btn--cancel btn--large"
                            onClick={handleDivideIntoRooms}
                        >
                            {languageData["Cancellation of division"]}
                        </button>
                    )}
                </div>
                {roomsState === RoomsStateSelection.chooseRoom ? (
                    <div>
                        <h3>{languageData["Participants"]}</h3>
                        <p>
                            {
                                (languageData[
                                    "Maximum number of participants in the room "
                                ],
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
                                value={maxParticipantsPerRoom || 7}
                                min="2"
                                max="30"
                                onChange={handleRangeChange}
                                onMouseUp={handleRangeBlur}
                                onTouchEnd={handleRangeBlur}
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
                        <h3>{languageData["Division into rooms"]}</h3>
                        <div className={styles.roomWrapper}>
                            {roomsAdmin.map((room: RoomDivied) => {
                                return (
                                    <Room
                                        key={room.roomNumber}
                                        room={room}
                                        maxParticipantsPerRoom={
                                            maxParticipantsPerRoom
                                        }
                                    />
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
