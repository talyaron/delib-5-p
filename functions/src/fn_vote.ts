import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { FieldValue } from 'firebase-admin/firestore'
import { Collections, Statement, maxKeyInObject, statementToSimpleStatement } from "delib-npm";


export async function updateVote(event: any) {
    try {

        const newVote = event.data.after.data();
        const { statementId: newVoteOptionId } = newVote;


        //first vote
        if (event.data.before.data() !== undefined) {
            const previousVote = event.data.before.data();

            const previousVoteOptionId = previousVote.statementId;

            if (newVoteOptionId === previousVoteOptionId) {
                throw new Error("new and previous are the same")

            } else {
                logger.info("new and previous are not the same")
                await db.doc(`statements/${newVote.parentId}`).update({
                    [`selections.${newVoteOptionId}`]: FieldValue.increment(1),
                    [`selections.${previousVoteOptionId}`]: FieldValue.increment(-1)
                });
            }
        } else {
            //second or more votes
            await db.doc(`statements/${newVote.parentId}`).update({
                [`selections.${newVoteOptionId}`]: FieldValue.increment(1)
            });

        }

        //update top voted
       
        const parentStatementDB = await db.doc(`${Collections.statements}/${newVote.parentId}`).get();
        if (!parentStatementDB.exists) throw new Error(`parentStatement ${newVote.parentId} do not exists`);

        const parentStatement = parentStatementDB.data() as Statement;
        const { selections } = parentStatement;
        const topVotedId = maxKeyInObject(selections);
        const topVotedDB = await db.doc(`${Collections.statements}/${topVotedId}`).get();
        if (!topVotedDB.exists) throw new Error(`topVoted ${topVotedId} do not exists`);
        const topVoted = topVotedDB.data() as Statement;
        const simpleTopVoted = statementToSimpleStatement(topVoted);
        simpleTopVoted.voted = simpleTopVoted.voted ||0;
       
      

        await db.doc(`${Collections.statements}/${newVote.parentId}`).update({"results.votes": [simpleTopVoted]});
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
}