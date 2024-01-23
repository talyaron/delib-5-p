import {
    Collections,
    Statement,
    RoomAskToJoin,
    getRequestIdToJoinRoom,
    RoomsStateSelection,
    User,
} from "delib-npm";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { DB } from "../config";
import { getUserFromFirebase } from "../users/usersGeneral";
import { ParticipantInRoom } from "../../../view/pages/statement/components/rooms/admin/AdminChoose";
import { store } from "../../../model/store";

export function enterRoomsDB(parentStatement: Statement) {
    try {
        const userId = getUserFromFirebase()?.uid;
        if (!userId) throw new Error("User not logged in");

        const requestId = getRequestIdToJoinRoom(
            userId,
            parentStatement.statementId,
        );
        if (!requestId) throw new Error("Request-id is undefined");

        const statementRef = doc(
            DB,
            Collections.statementRoomsAsked,
            requestId,
        );
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        const room: RoomAskToJoin = {
            participant: user,
            parentId: parentStatement.statementId,
            requestId: requestId,
            lastUpdate: new Date().getTime(),
        };
        setDoc(statementRef, room, { merge: true });
    } catch (error) {
        console.error(error);
    }
}

export async function askToJoinRoomDB(
    statement: Statement,
    participant?: User,
): Promise<boolean> {
    try {
       
        const user = participant ? participant : store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        const userId = user.uid;
        if (!userId) throw new Error("User not logged in");

        const requestId = getRequestIdToJoinRoom(userId, statement.parentId);
        if (!requestId) throw new Error("Request id is undefined");

        const requestRef = doc(DB, Collections.statementRoomsAsked, requestId);

        const requestDB = await getDoc(requestRef);
       

        if (!requestDB.exists()) {
            //if there is no request, create one
           
            await saveToDB(requestId, requestRef, statement, user);

            return true;
        } else {
            const request = requestDB.data() as RoomAskToJoin;
         
            if (request.statement === undefined) {
                
                await saveToDB(requestId, requestRef, statement, user, request.approved);

                return true;
            } else if (
                request.statement.statementId !== statement.statementId
            ) {

                //in case the user is already in the room and wants to join another room
                await saveToDB(requestId, requestRef, statement,user, request.approved);

                return true;
            } else {
                const { parentId, participant, requestId } = request;
                const _request = {
                    parentId,
                    participant,
                    requestId,
                    lastUpdate: new Date().getTime(),
                };

                //set to undefined to show that the user is not in the room
                await setDoc(requestRef, _request);

                return false;
            }
        }
    } catch (error) {
        console.error(error);

        return false;
    }

    async function saveToDB(
        requestId: string,
        requestRef: any,
        statement: Statement,
        user?: User,
        approved?: boolean,
    ) {
        const _user = user|| store.getState().user.user;
        if (!_user) throw new Error("User not logged in");
        const request: RoomAskToJoin = {
            statementId: statement.statementId,
            participant: _user,
            parentId: statement.parentId,
            requestId: requestId,
            statement,
            approved
        };

        await setDoc(requestRef, request);
    }
}

export async function setRoomsStateToDB(
    statement: Statement,
    roomsState: RoomsStateSelection,
) {
    try {
        const statementRef = doc(
            DB,
            Collections.statements,
            statement.statementId,
        );
        await setDoc(statementRef, { roomsState }, { merge: true });
    } catch (error) {
        roomsState;
        console.error(error);
    }
}

export function setParticipantInRoom(participant: ParticipantInRoom) {
    try {
        const { uid, topic, roomNumber } = participant;
        if (!topic) return;

        const requestId = getRequestIdToJoinRoom(uid, topic.parentId);
        if (!requestId) throw new Error("Request id is undefined");

        const requestRef = doc(DB, Collections.statementRoomsAsked, requestId);
        if (topic.statementId)
            updateDoc(requestRef, { approved: true, roomNumber });
        else updateDoc(requestRef, { approved: false, roomNumber });
    } catch (error) {
        console.error(error);
    }
}
