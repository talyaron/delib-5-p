import { FC, useState } from 'react'
import RoomParticpantBadge from '../comp/general/RoomParticpantBadge'
import { useAppSelector } from '../../../../../../functions/hooks/reduxHooks'
import { RoomAskToJoin, RoomDivied, RoomsStateSelection, Statement } from 'delib-npm'
import { participantsSelector } from '../../../../../../model/statements/statementsSlice'
import { setRoomsStateToDB } from '../../../../../../functions/db/rooms/setRooms';
import _styles from './admin.module.css';
import Text from '../../../../../components/text/Text';
import Slider from '@mui/material/Slider';

const styles = _styles as any;


interface Props {
    statement: Statement;

}

interface RoomAdmin {
    room: Array<RoomAskToJoin>;
    roomNumber: number;
    statement: Statement;
}


const AdminSeeAllGroups: FC<Props> = ({ statement }) => {

    const participants = useAppSelector(participantsSelector(statement.statementId));
    const [setRooms, setSetRooms] = useState<boolean>(true);
    const [roomsAdmin, setRoomsAdmin] = useState<RoomAdmin[]>([]);
    const [maxParticipantsPerRoom, setMaxParticipantsPerRoom] = useState<number>(7);

    function handleDivideIntoRooms() {
        try {
            const { rooms } = divideIntoTopics(participants, maxParticipantsPerRoom);
            console.log('rooms', rooms)
            setRoomsAdmin(rooms);

            const roomsState = setRooms ? RoomsStateSelection.DIVIDE : RoomsStateSelection.SELECT_ROOMS;
            setSetRooms(state => !state);

            setRoomsStateToDB(statement, roomsState);
        } catch (error) {
            console.error(error);
        }
    }

    function handleRoomSize(ev: any) {
        const value = ev.target.value;
        const valueAsNumber = Number(value);
        setMaxParticipantsPerRoom(valueAsNumber)
    }


    return (
        <div>
            <p className={styles.title}>לוח ניהול</p>
            <div >

                <div className="btns">
                    {setRooms ? <button onClick={handleDivideIntoRooms}>חלק/י לחדרים</button> : <button className='btn--cancel' onClick={handleDivideIntoRooms}>ביטול חלוקה</button>}

                </div>
                {setRooms ? <div>
                    <h3>משתתפים</h3>
                    <p>מספר משתתפים מקסימלי בחדר {maxParticipantsPerRoom}</p>

                    <div className="btns" style={{ padding: '1.5rem', boxSizing: "border-box" }}>
                        <Slider defaultValue={7} min={2} max={30} aria-label="Default" valueLabelDisplay="auto" onChange={handleRoomSize} />

                    </div>
                    <br />
                    <br />
                    <div className='badge__wrapper'>
                        {participants.map((request) => (
                            <RoomParticpantBadge key={request.participant.uid} participant={request.participant} />
                        ))}
                    </div>
                </div> :
                    <>
                        <h3>חלוקה לחדרים</h3>
                        <div className={styles.roomWrapper}>
                            {roomsAdmin.map((room: RoomAdmin) => {

                                return (
                                    <div key={room.roomNumber} className={styles.room}>
                                        <h4>חדר {room.roomNumber} - <Text text={room.statement.statement} onlyTitle={true} /></h4>
                                        <div className={styles.room__badges} >
                                            {room.room.map((participant: RoomAskToJoin) => (
                                                <RoomParticpantBadge key={participant.participant.uid} participant={participant.participant} />
                                            ))}
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default AdminSeeAllGroups
export interface ParticipantInRoom { uid: string, room: number, roomNumber?: number, topic?: Statement, statementId?: string }

function divideIntoTopics(participants: RoomAskToJoin[], maxPerRoom: number = 7): { rooms: Array<RoomDivied>, topicsParticipants: any } {
    try {

        const topicsParticipants: any = {};
        //build topicsParticipantsObject
        participants.forEach((participant) => {

            try {
                if (!participant.statementId) {
                    topicsParticipants['general'] = { statementId: 'general', statement: 'כללי', participants: [participant] };
                }
                else if (!(participant.statementId in topicsParticipants)) {
                    topicsParticipants[participant.statementId] = { statementId: participant.statementId, statement: participant.statement, participants: [participant] };
                } else {
                    topicsParticipants[participant.statementId].participants.push(participant);
                }

            } catch (error) {
                console.error(error);
                return undefined;
            }
        })

        //divide participents according to topics and rooms
        // let rooms: Array<ParticipantInRoom> = [];
        for (const topic in topicsParticipants) {

            const patricipantsInTopic = topicsParticipants[topic].participants;
            topicsParticipants[topic].rooms = divideParticipantsIntoRoomsRandomly(patricipantsInTopic, maxPerRoom);


        }

        const rooms = divideIntoGeneralRooms(topicsParticipants);


        return { rooms, topicsParticipants };

    } catch (error) {
        console.error(error);
        return { rooms: [], topicsParticipants: undefined }
    }
}




function divideParticipantsIntoRoomsRandomly(participants: RoomAskToJoin[], maxPerRoom: number): Array<Array<RoomAskToJoin>> {
    try {

        const numberOfRooms = Math.ceil(participants.length / maxPerRoom);

        //randomize participants
        participants.sort(() => Math.random() - 0.5);

        let roomNumber = 0;


        const rooms: Array<Array<RoomAskToJoin>> = [[]]
        participants.forEach((participant: RoomAskToJoin) => {

            if (!rooms[roomNumber]) rooms[roomNumber] = [];
            rooms[roomNumber].push(participant)
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
        let rooms: Array<RoomDivied> = [];
        for (const topic in topics) {
            const topicRooms = topics[topic].rooms;
            topicRooms.forEach((room: Array<RoomAskToJoin>) => {

                rooms.push({ room, roomNumber, statement: topics[topic].statement });
                roomNumber++;
            })

        }

        return rooms;
    } catch (error) {
        console.error(error);
        return [];
    }
}
