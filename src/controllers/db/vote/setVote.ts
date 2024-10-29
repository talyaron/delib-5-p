import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { Statement, User } from "delib-npm";
import { Collections } from "delib-npm";
import { FireStore } from "../config";
import { Vote, getVoteId, VoteSchema } from "delib-npm";
import { store } from "@/model/store";

export async function setVoteToDB(option: Statement) {
	try {
		//vote reference
		const user: User | null = store.getState().user.user;
		if (!user) throw new Error("User not logged in");
		const voteId = getVoteId(user.uid, option.parentId);

		const voteRef = doc(FireStore, Collections.votes, voteId);

		// toggle vote
		const vote: Vote = {
			voteId,
			statementId: option.statementId,
			parentId: option.parentId,
			userId: user.uid,
			lastUpdate: Timestamp.now().toMillis(),
			createdAt: Timestamp.now().toMillis(),
			voter: user,
		};

		const voteDoc = await getDoc(voteRef);
		if (
			voteDoc.exists() &&
            voteDoc.data()?.statementId === option.statementId
		) {
			vote.statementId = "none";
		}

		VoteSchema.parse(vote);

		await setDoc(voteRef, vote, { merge: true });
	} catch (error) {
		console.error(error);
	}
}
