import { Collections, RoomAskToJoin } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { FieldValue } from "firebase-admin/firestore";

//count room joiners
export async function countRoomJoiners(ev: any) {
    try {
        //on change of room joiners, update the room with the new count
        //get the room id
        const previouseRequest = ev.data.before.data() as RoomAskToJoin;
        const newRequest = ev.data.after.data() as RoomAskToJoin;

        //if new request
        if (previouseRequest === undefined) {
            //get the room
            const lobbyRoomRef = db
                .collection(Collections.statementLobbyRooms)
                .doc(newRequest.statementId);
            //update the room with the new count
            const lobbyRoom = await lobbyRoomRef.get();
            if (lobbyRoom.exists) {
                return lobbyRoomRef.update({
                    joinersCount: FieldValue.increment(1),
                });
            } else {
                return lobbyRoomRef.set({
                    joinersCount: 1,
                    parentId: newRequest.parentId,
                    statementId: newRequest.statementId,
                });
            }
        } else if (newRequest === undefined) {
            logger.info("request deleted");
            const previousLoobyRoomRef = db
                .collection(Collections.statementLobbyRooms)
                .doc(previouseRequest.statementId);
            await previousLoobyRoomRef.update({
                joinersCount: FieldValue.increment(-1),
            });
        } else {
            //if request uppdated

            const newLobbyRoomRef = db
                .collection(Collections.statementLobbyRooms)
                .doc(newRequest.statementId);
            const previousLoobyRoomRef = db
                .collection(Collections.statementLobbyRooms)
                .doc(previouseRequest.statementId);
            //update the room with the new count

            const newLobbyRoom = await newLobbyRoomRef.get();
            const previousLoobyRoom = await previousLoobyRoomRef.get();

            await updateNewRoom(
                newLobbyRoom,
                newLobbyRoomRef,
                newRequest.parentId,
                newRequest.statementId
            );

            await updatePreviuosRoom(
                previousLoobyRoom,
                previousLoobyRoomRef,
                previouseRequest.parentId,
                previouseRequest.statementId
            );
        }
    } catch (error) {
        logger.error(error);
    }

    async function updatePreviuosRoom(
        previousLoobyRoom: any,
        previousLoobyRoomRef: any,
        parentId: string,
        statementId: string | undefined
    ) {
        try {
            if (previousLoobyRoom.exists) {
                await previousLoobyRoomRef.update({
                    joinersCount: FieldValue.increment(-1),
                });
            } else {
                await previousLoobyRoomRef.set({
                    joinersCount: 0,
                    parentId,
                    statementId,
                });
            }
        } catch (error) {
            logger.error(error);
        }
    }

    async function updateNewRoom(
        newLobbyRoom: any,
        newLobbyRoomRef: any,
        parentId: string,
        statementId: string | undefined
    ) {
        try {
            if (newLobbyRoom.exists) {
                await newLobbyRoomRef.update({
                    joinersCount: FieldValue.increment(1),
                });
            } else {
                await newLobbyRoomRef.set({
                    joinersCount: 1,
                    parentId,
                    statementId,
                });
            }
        } catch (error) {
            logger.error(error);
        }
    }
}
