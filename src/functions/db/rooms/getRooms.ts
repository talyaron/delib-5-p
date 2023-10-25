import { Collections, RoomAskToJoin, getRequestIdToJoinRoom, LobbyRooms, Statement, StatementSchema, StatementType } from "delib-npm";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { auth } from "../auth";
import { DB } from "../config";

export function listenToRoomsRquest(parentId: string, cb: Function) {
    try {
        const user = auth.currentUser;
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

export function listenToLobbyRoomJoiners(parentId: string, cb: Function) {
    try {
    
        const lobbyRoomsRef = collection(DB, Collections.statementLobbyRooms);
        const q = query(lobbyRoomsRef, where("parentId", "==", parentId));
        return onSnapshot(q, lobbyRoomsDB => {
            try {
                const lobbyRooms: LobbyRooms[] = lobbyRoomsDB.docs.map(lobbyRoomDB => {
                    return lobbyRoomDB.data() as LobbyRooms;
                })
                cb(lobbyRooms)
            } catch (error) {
                console.error(error)

            };
        })

    } catch (error) {
        console.error(error)
        return () => { };
    }
}

export function listenToAllRoomsRquest(statement: Statement, cb: Function) {
    try {
      
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const userId = user.uid
        if (userId !== statement.creatorId) throw new Error("User is not the creator of the statement");

        const requestRef = collection(DB, Collections.statementRoomsAsked);
        const q = query(requestRef, where("parentId", "==", statement.statementId));
        return onSnapshot(q, requestDB => {
            try {
                const requests = requestDB.docs.map(requestDB => {
                    return requestDB.data() as RoomAskToJoin;
                })
                requests.forEach(request => {
                    cb(request)
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

export function listenToRoomSolutions(statementId:string, cb: Function) {
    try {
     

        const statementSolutionsRef = collection(DB, Collections.statements);
        const q = query(statementSolutionsRef,where("parentId", "==", statementId), where("type", "==", StatementType.SOLUTION));
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