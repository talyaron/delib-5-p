import {
    Collections,
    Statement,
    Participant,
    getRequestIdToJoinRoom,
    RoomsStateSelection,
    User,
} from "delib-npm";
import {
    DocumentData,
    DocumentReference,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { DB } from "../config";
import { getUserFromFirebase } from "../users/usersGeneral";
import { ParticipantInRoom } from "../../../view/pages/statement/components/rooms/components/adminArrange/AdminArrange";
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
        const room: Participant = {
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

export async function setRoomJoinToDB(
    statement: Statement,
    participant?: User,
    roomNumber?: number,
): Promise<boolean> {
    try {
        const { requestDB, user, requestId, requestRef } =
            await getRequestFromDB(statement, participant);

        if (!requestDB.exists()) {
            // If there is no request, create one
            await saveToDB({ requestId, requestRef, statement, user });

            return true;
        } else {
            //if there is a request
            const request = requestDB.data() as Participant;

            return await updateRequestToDB(request, requestRef);
        }
    } catch (error) {
        console.error(error);

        return false;
    }

    interface SaveToDB {
        requestId: string;
        requestRef: DocumentReference<DocumentData, DocumentData>;
        statement: Statement;
        user?: User;
        approved?: boolean;
        newRoomNumber?: number;
    }

    //helpers functions
    async function saveToDB({
        requestId,
        requestRef,
        statement,
        user,
        approved,
        newRoomNumber,
    }: SaveToDB) {
        const _user = user || store.getState().user.user;
        if (!_user) throw new Error("User not logged in");
        const request: Participant = {
            statementId: statement.statementId,
            participant: _user,
            parentId: statement.parentId,
            requestId: requestId,
            statement,
        };
        if (typeof newRoomNumber === "number")
            request.roomNumber = newRoomNumber;
        if (typeof approved === "boolean") request.approved = approved;

        await setDoc(requestRef, request);
    }
    async function getRequestFromDB(statement: Statement, participant?: User) {
        const user = participant ? participant : store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        const userId = user.uid;
        if (!userId) throw new Error("User not logged in");

        const requestId = getRequestIdToJoinRoom(userId, statement.parentId);
        if (!requestId) throw new Error("Request id is undefined");

        const requestRef = doc(DB, Collections.statementRoomsAsked, requestId);

        const requestDB = await getDoc(requestRef);

        return { requestDB, user, requestId, requestRef };
    }

    async function updateRequestToDB(
        request: Participant,
        requestRef: DocumentReference<DocumentData, DocumentData>,
    ) {
        try {
            const user = store.getState().user.user;
            if (!user) throw new Error("User not logged in");
            if (request.statement === undefined) {
                // If the user is not in a room
                await saveToDB({
                    requestId: request.requestId,
                    requestRef,
                    statement,
                    user,
                    approved: request.approved,
                });

                return true;
            } else if (
                request.statement.statementId !== statement.statementId
            ) {
                // If the user is already in a room and wants to join another room
                await saveToDB({
                    requestId: request.requestId,
                    requestRef,
                    statement,
                    user,
                    approved: request.approved,
                    newRoomNumber: roomNumber,
                });

                return true;
            } else {
                // If the user is already in the same room, remove the user from the room
                const { parentId, participant, requestId } = request;
                const updatedRequest = {
                    parentId,
                    participant,
                    requestId,
                    lastUpdate: new Date().getTime(),
                };
                await setDoc(requestRef, updatedRequest);

                return false;
            }
        } catch (error) {
            console.error(error);

            return false;
        }
    }
}

export async function setRoomsStateToDB(
    statement: Statement,
    roomsState: RoomsStateSelection,
) {
    try {
        //get timers settings from DB

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

export function setParticipantInRoomToDB(participant: ParticipantInRoom) {
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
