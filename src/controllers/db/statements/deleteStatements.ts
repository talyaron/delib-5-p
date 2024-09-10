import { Collections, Role, Statement, StatementSubscription } from "delib-npm";
import { collection, deleteDoc, doc, getDocs, limit, query, where } from "firebase/firestore";
import { DB } from "../config";
import { store } from "@/model/store";


export async function deleteStatementFromDB (
    statement: Statement,
    subscription?: StatementSubscription,
) {
    try {
        if(!statement) throw new Error("No statement");
        if(!subscription) throw new Error("No subscription");
        const user = store.getState().user.user;
        const { role } = subscription;
        if (!(role === Role.admin || statement.creatorId === user?.uid)) throw new Error("Unauthorized");

        if (!statement) throw new Error("No statement");
        const confirmed = confirm(`Are you sure you want to delete ${statement.statement}?`);
        if (!confirmed) return;

        //check if the statement has children
        const childrenRef = collection(DB, Collections.statements)
        const q = query(childrenRef, where("parentId", "==", statement.statementId), limit(1));
        const hasChildren = await getDocs(q);
        if (hasChildren.docs.length > 0) {
            alert("You cannot delete a statement with children. Please delete the children first.")
            return;
        }
        const statementRef = doc(DB, Collections.statements, statement.statementId);
        await deleteDoc(statementRef);
    } catch (error) {
        console.error(error);

    }
}