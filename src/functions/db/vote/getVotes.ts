import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Collections, StatementSchema, Vote } from "delib-npm";
import { DB } from "../config";
import { VoteSchema, getVoteId } from "delib-npm";
import { getUserFromFirebase } from "../users/usersGeneral";
import { store } from "../../../model/store";


// TODO: Refactor this function
// Why get user from firebase when we can pass it as a parameter?
// 
export async function getToVoteOnParent(
    parentId: string,
    updateStoreWitehVoteCB: Function
) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        const parentVoteRef = doc(
            DB,
            Collections.votes,
            getVoteId(user.uid, parentId)
        );

        const voteDB = await getDoc(parentVoteRef);

        const vote = voteDB.data();
        if (!vote) throw new Error("Vote not found");
        VoteSchema.parse(vote);

        //get statemtn to update to store
        const statementRef = doc(DB, Collections.statements, vote.statementId);
        const statementDB = await getDoc(statementRef);

        const statement = statementDB.data();
        if (!statement) throw new Error("Parent not found");
        StatementSchema.parse(statement);

        updateStoreWitehVoteCB(statement);
    } catch (error) {
        console.error(error);
        
return () => {};
    }
}

export async function getVoters(parentId: string): Promise<Vote[]> {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        const votesRef = collection(DB, Collections.votes);
        const q = query(votesRef, where("parentId", "==", parentId));

        const votersDB = await getDocs(q);
        const voters = votersDB.docs.map((vote:any) => vote.data()) as Vote[];

        return voters;
    } catch (error) {
        console.error(error);
        
return[] as Vote[];
    }
}
