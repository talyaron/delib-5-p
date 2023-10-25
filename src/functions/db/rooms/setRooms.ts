import { Collections, Statement, RoomAskToJoin, getRequestIdToJoinRoom, RoomsStateSelection } from "delib-npm";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { DB } from "../config";
import { getUserFromFirebase } from "../users/usersGeneral";


export async function askToJoinRoomDB(statement: Statement): Promise<boolean> {
    try {


        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        const userId = user.uid
        if (!userId) throw new Error("User not logged in");

        const requestId = getRequestIdToJoinRoom(userId, statement.parentId);
        if (!requestId) throw new Error("Request id is undefined");

        const requestRef = doc(DB, Collections.statementRoomsAsked, requestId);

        const requestDB = await getDoc(requestRef);

        if (!requestDB.exists()) {
            await saveToDB(requestId, requestRef, statement);


            return true;
        } else {

            const request = requestDB.data() as RoomAskToJoin;
            if (request.statementId === statement.statementId) {
                await deleteDoc(requestRef);
                return false;
            } else {
                await saveToDB(requestId, requestRef, statement);
                return true;
            }

        }

    } catch (error) {
        console.error(error)
        return false
    }

    async function saveToDB(requestId: string, requestRef: any, statement: Statement) {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        const request: RoomAskToJoin = {
            statementId: statement.statementId,
            participant: user,
            parentId: statement.parentId,
            requestId: requestId,
            statement
        };

        await setDoc(requestRef, request);
    }
}

export async function setRoomsStateToDB(statement: Statement, roomsState: RoomsStateSelection) {
    try {
        const statementRef = doc(DB, Collections.statements, statement.statementId);
        await setDoc(statementRef, { roomsState }, { merge: true });
    } catch (error) {
        roomsState
        console.error(error)
    }
}

export function approveToJoinRoomDB(participantId: string, statement: Statement, roomNumber: number, approved: boolean =true) {
    try {

        const requestId = getRequestIdToJoinRoom(participantId, statement.parentId);
        if (!requestId) throw new Error("Request id is undefined");

        const requestRef = doc(DB, Collections.statementRoomsAsked, requestId);
        if(approved) updateDoc(requestRef, { approved: true, roomNumber });
        else updateDoc(requestRef, { approved: false, roomNumber });


    } catch (error) {
        console.error(error)
    }
}

