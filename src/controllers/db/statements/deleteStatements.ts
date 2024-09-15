import { Collections, Statement } from "delib-npm";
import { collection, deleteDoc, doc, getDocs, limit, query, where } from "firebase/firestore";
import { DB } from "../config";



export async function deleteStatementFromDB (
	statement: Statement,
	isAuthorized: boolean,
) {
	try {
		if(!statement) throw new Error("No statement");
       
		if(!isAuthorized) alert("You are not authorized to delete this statement");
        
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