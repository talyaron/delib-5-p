import { doc, getDoc } from "firebase/firestore";
import { Collections,StatementSchema } from "delib-npm";
import { DB } from "../config";
import { getVoteId, voteSchema } from "../../../model/vote/voteModel";
import { getUserFromFirebase } from "../users/usersGeneral";


export async function getToVoteOnParent(parentId: string, updateStoreWitehVoteCB: Function) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        const parentVoteRef = doc(DB, Collections.votes, getVoteId(user.uid, parentId));

        const voteDB = await getDoc(parentVoteRef);

        const vote = voteDB.data();
        if (!vote) throw new Error("Vote not found");
        voteSchema.parse(vote);

        //get statemtn to update to store
        const statementRef = doc(DB, Collections.statements, vote.statementId);
        const statementDB = await getDoc(statementRef);

        const statement = statementDB.data();
        if (!statement) throw new Error("Parent not found");
        StatementSchema.parse(statement);

        updateStoreWitehVoteCB(statement)


    } catch (error) {
        console.error(error);
        return () => { };
    }
}