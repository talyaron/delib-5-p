import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { Statement } from "delib-npm";
import { Collections } from "delib-npm";
import { getUserFromFirebase } from "../users/usersGeneral";
import { DB } from "../config";
import { Vote, getVoteId, VoteSchema } from "delib-npm";

export async function setVote(option: Statement) {
    try {
        //vote refernce
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        const voteId = getVoteId(user.uid, option.parentId);

        const voteRef = doc(DB, Collections.votes, voteId);

        // toggle vote
        const vote: Vote = {
            voteId,
            statementId: option.statementId,
            parentId: option.parentId,
            userId: user.uid,
            lastUpdate: Timestamp.now().toMillis(),
            createdAt: Timestamp.now().toMillis(),
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
