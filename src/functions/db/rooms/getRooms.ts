import { Collections, RoomAskToJoin, getRequestIdToJoinRoom, LobbyRooms, Statement, StatementSchema, StatementType } from "delib-npm";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { DB } from "../config";
import { store } from "../../../model/store";

export function listenToRoomsRquest(parentId: string, cb: Function) {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        const userId = user.uid
        const requestId = getRequestIdToJoinRoom(userId, parentId)
        if (!requestId) throw new Error("Request id is undefined");

        const requestRef = doc(DB, Collections.statementRoomsAsked, requestId);
        return onSnapshot(requestRef, requestDB => {
            try {
                if (!requestDB.exists()) {
                    cb(undefined);
                    return;
                }
                const request = requestDB.data() as RoomAskToJoin;

                cb(request)
            } catch (error) {
                console.error(error)
                cb(undefined)
            };
        })

    } catch (error) {
        console.error(error)
        return () => { };
    }
}



export function listenToAllRoomsRquest(statement: Statement, cb: Function, cbRemove: Function) {
    try {

        const requestRef = collection(DB, Collections.statementRoomsAsked);
        const q = query(requestRef, where("parentId", "==", statement.statementId));
        return onSnapshot(q, requestDB => {
            try {
                requestDB.docChanges().forEach(change => {
                    const request = change.doc.data() as RoomAskToJoin;
                    if (change.type === "added" || change.type === "modified") {
                        cb(request)
                    } else if (change.type === "removed") {
                        cbRemove(request.requestId)
                    }


                })

            } catch (error) {
                console.error(error)
                cb([])
            };
        })

    } catch (error) {
        console.error(error)
        return () => { };
    }
}

export function listenToRoomSolutions(statementId: string, cb: Function) {
    try {


        const statementSolutionsRef = collection(DB, Collections.statements);
        const q = query(statementSolutionsRef, where("parentId", "==", statementId), where("type", "==", StatementType.SOLUTION));
        return onSnapshot(q, roomSolutionsDB => {
            try {

                roomSolutionsDB.forEach(roomSolutionDB => {
                    try {
                        const roomSolution = roomSolutionDB.data() as Statement;
                        StatementSchema.parse(roomSolution);

                        cb(roomSolution as Statement);
                    } catch (error) {
                        console.error(error)
                    }
                })

            } catch (error) {
                console.error(error)
                cb([])
            };
        })

    } catch (error) {
        console.error(error)
        return () => { };
    }
}