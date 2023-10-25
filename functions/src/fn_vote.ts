import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { FieldValue } from 'firebase-admin/firestore'


// export async function addVote(event: any) {
//     try {
//         const vote = event.data.data();

//         db.doc(`statements/${vote.statementId}`).update({ votes: FieldValue.increment(1) });
//         await updteSelection(vote.parentId, vote.statementId, 1)

//     } catch (error) {
//         logger.error(error);
//     }
// }

// export async function removeVote(event: any) {
//     try {

//         const vote = event.data.data();

//         db.doc(`statements/${vote.statementId}`).update({ votes: FieldValue.increment(-1) });
//         await updteSelection(vote.parentId, vote.statementId, -1)
//     } catch (error) {
//         logger.error(error);
//     }
// }

export async function updateVote(event: any) {
    try {

        const newVote = event.data.after.data();
        logger.info(`newVote: ${JSON.stringify(newVote)}`)
        const newVoteOptionId = newVote.statementId;
        logger.info(`newVoteOptionId: ${newVoteOptionId}`)

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



    } catch (error) {
        logger.error(error);
    }
}