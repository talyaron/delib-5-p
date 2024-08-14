import { Collections } from "delib-npm";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db } from ".";
import { logger } from "firebase-functions/v1";

export async function addOrRemoveMemberFromStatementDB(statementId: string, eventType: "new" | "update" | "delete", isMemberAfter: boolean, isMemberBefore: boolean): Promise<void> {
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
        const statementMetaData = await statementRef.get();
        if (!statementMetaData.exists) {

        }
        statementRef.set({
            numberOfMembers: FieldValue.increment(increment),
            lastUpdate: Timestamp.now().toMillis(),
            statementId
        }, { merge: true });
        return;

    } catch (error) {
        logger.error("error updating statement with number of members", error);
        return;
    }
}