import { RoomAskToJoin, RoomDivied } from "delib-npm";
import { t } from "i18next";

export function divideIntoTopics(
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