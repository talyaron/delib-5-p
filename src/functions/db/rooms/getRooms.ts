import {
    Collections,
    RoomAskToJoin,
    Statement,
    StatementSchema,
    StatementType,
} from "delib-npm"
import {
    and,
    collection,
    onSnapshot,
    or,
    query,
    where,
} from "firebase/firestore"
import { DB } from "../config"

export function listenToAllRoomsRquest(statement: Statement, cb: Function) {
    try {
        const requestRef = collection(DB, Collections.statementRoomsAsked)
        const q = query(
            requestRef,
            where("parentId", "==", statement.statementId)
        )

        return onSnapshot(q, (requestsDB: any) => {
            try {
                const requests = requestsDB.docs.map(
                    (requestDB: any) => requestDB.data() as RoomAskToJoin
                )

                cb(requests)
            } catch (error) {
                console.error(error)
                cb([])
            }
        })
    } catch (error) {
        console.error(error)
        
return () => {}
    }
}

export function listenToRoomSolutions(statementId: string, cb: Function) {
    try {
        const statementSolutionsRef = collection(DB, Collections.statements)
        const q = query(
            statementSolutionsRef,
            and(
                where("parentId", "==", statementId),
                or(
                    where("statementType", "==", StatementType.option),
                    where("statementType", "==", StatementType.result)
                )
            )
        )
        
return onSnapshot(q, (roomSolutionsDB) => {
            try {
                roomSolutionsDB.forEach((roomSolutionDB) => {
                    try {
                        const roomSolution = roomSolutionDB.data() as Statement
                        StatementSchema.parse(roomSolution)

                        cb(roomSolution as Statement)
                    } catch (error) {
                        console.error(error)
                    }
                })
            } catch (error) {
                console.error(error)
                cb([])
            }
        })
    } catch (error) {
        console.error(error)
        
return () => {}
    }
}
