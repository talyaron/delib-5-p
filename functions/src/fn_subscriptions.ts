import { Collections, StatementSubscription } from "delib-npm";
import { logger } from "firebase-functions";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db } from "./index";
import { isMember } from "delib-npm/dist/controllers/helpers";


export async function updateStatementNumberOfMembers(event: any) {
    try {


        const statementsSubscribeBefore = event.data.before.data() as StatementSubscription;
        const statementsSubscribeAfter = event.data.after.data() as StatementSubscription;

        const roleBefore = statementsSubscribeBefore ? statementsSubscribeBefore.role : undefined;
        const roleAfter = statementsSubscribeAfter ? statementsSubscribeAfter.role : undefined;

        const eventType = getEventType(event);


        const _isMemberAfter = isMember(roleAfter);
        const _isMemberBefore = isMember(roleBefore);
        const statementId: string = statementsSubscribeBefore?.statementId || statementsSubscribeAfter?.statementId;

        await addOrRemoveMemberFromStatementDB(statementId, eventType, _isMemberAfter, _isMemberBefore);


        //inner functions
        function getEventType(event: any): "new" | "update" | "delete" {
            const beforeSnapshot = event.data.before;
            const afterSnapshot = event.data.after;

            if (!beforeSnapshot.exists) {
                return "new";
            } else if (!afterSnapshot.exists) {
                return "delete";
            } else {
                return "update";
            }
        }

        async function addOrRemoveMemberFromStatementDB(statementId: string, eventType: "new" | "update" | "delete", isMemberAfter: boolean, isMemberBefore: boolean): Promise<void> {
            try {

                if (!statementId) throw new Error("statementId is required")



                let increment = 0;
                if (eventType === "new" && isMemberAfter) {
                    increment = 1;

                } else if (eventType === "delete" && isMemberBefore) {
                    increment = -1;

                } else if (eventType === "update" && isMemberAfter && !isMemberBefore) {
                    increment = 1;

                } else if (eventType === "update" && !isMemberAfter && isMemberBefore) {
                    increment = -1;
                }

                const statementRef = db.doc(`${Collections.statementsMetaData}/${statementId}`);
                statementRef.set({
                    question: {
                        numberOfMembers: FieldValue.increment(increment),
                        lastUpdate: Timestamp.now().toMillis()
                    }
                }, { merge: true });
                return;

            } catch (error) {
                logger.error("error updating statement with number of members", error);
                return;
            }
        }
    } catch (error) {
        logger.error("error updating statement with number of members", error);
    }
}