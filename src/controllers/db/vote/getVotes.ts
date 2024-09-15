import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { Collections, Statement, StatementSchema, Vote } from "delib-npm";
import { DB } from "../config";
import { VoteSchema, getVoteId } from "delib-npm";
import { getUserFromFirebase } from "../users/usersGeneral";
import { store } from "@/model/store";
import { z } from "zod";

// Why get user from firebase when we can pass it as a parameter?
export async function getToVoteOnParent(
	parentId: string,
	updateStoreWithVoteCB: (statement: Statement) => void
): Promise<void> {
	try {
		const user = getUserFromFirebase();
		if (!user) throw new Error("User not logged in");
		if (!parentId) throw new Error("ParentId not provided");
		const voteId = getVoteId(user.uid, parentId);
		if (!voteId) throw new Error("VoteId not found");

		const parentVoteRef = doc(DB, Collections.votes, voteId);

		const voteDB = await getDoc(parentVoteRef);

		const vote = voteDB.data();
		if (!vote) return;
		VoteSchema.parse(vote);

		//get statemtn to update to store
		const statementRef = doc(DB, Collections.statements, vote.statementId);
		const statementDB = await getDoc(statementRef);

		const statement = statementDB.data() as Statement;
		if (!statement) throw new Error("Parent not found");
		StatementSchema.parse(statement);

		updateStoreWithVoteCB(statement);
	} catch (error) {
		console.error(error);
	}
}

export async function getVoters(parentId: string): Promise<Vote[]> {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error("User not logged in");
		const votesRef = collection(DB, Collections.votes);
		const q = query(votesRef, where("parentId", "==", parentId));

		const votersDB = await getDocs(q);
		const voters = votersDB.docs.map((vote) => vote.data()) as Vote[];
		z.array(VoteSchema).parse(voters);

		return voters;
	} catch (error) {
		console.error(error);

		return [] as Vote[];
	}
}
