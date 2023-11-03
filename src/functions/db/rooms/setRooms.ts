import { Collections, Statement, RoomAskToJoin, getRequestIdToJoinRoom, RoomsStateSelection } from "delib-npm";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { DB } from "../config";
import { getUserFromFirebase } from "../users/usersGeneral";

export function enterRoomsDB(parentStatement: Statement) {
    try {
        const userId = getUserFromFirebase()?.uid;
        if (!userId) throw new Error("User not logged in");

        const requestId = getRequestIdToJoinRoom(userId, parentStatement.statementId);
        if (!requestId) throw new Error("Request-id is undefined");

        const statementRef = doc(DB, Collections.statementRoomsAsked, requestId);
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        const room: RoomAskToJoin = {
            participant: user,
            parentId: parentStatement.statementId,
            requestId: requestId,
            lastUpdate: new Date().getTime()
        }
        setDoc(statementRef, room, { merge: true });
    } catch (error) {
        console.error(error)
    }
}


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
        const request = requestDB.data() as RoomAskToJoin;

        if (!requestDB.exists()) {
            console.log("statement do not exists on request")
            await saveToDB(requestId, requestRef, statement);


            return true;
        } else {




            if (request.statement === undefined) {


                await saveToDB(requestId, requestRef, statement);
                return true;


            } else if (request.statement.statementId !== statement.statementId) {

                await saveToDB(requestId, requestRef, statement);
                return true;

            } else {
                const { parentId, participant, requestId } = request;
                const _request = { parentId, participant, requestId, lastUpdate: new Date().getTime() };

                //set to undefined to show that the user is not in the room
                await setDoc(requestRef, _request);
                return false;
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

export function approveToJoinRoomDB(participantId: string, statement: Statement, roomNumber: number, approved: boolean = true) {
    try {

        const requestId = getRequestIdToJoinRoom(participantId, statement.parentId);
        if (!requestId) throw new Error("Request id is undefined");

        const requestRef = doc(DB, Collections.statementRoomsAsked, requestId);
        if (approved) updateDoc(requestRef, { approved: true, roomNumber });
        else updateDoc(requestRef, { approved: false, roomNumber });


    } catch (error) {
        console.error(error)
    }
}

