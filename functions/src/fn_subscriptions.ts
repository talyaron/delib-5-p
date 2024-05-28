import { Collections, StatementSubscription } from "delib-npm";
import { logger } from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./index";
import { isMember } from "delib-npm/dist/controllers/helpers";

export async function updateStatementNumberOfMembers(event: any) {
    try {
        console.log("updateStatementNumberOfMembers....")
        const statementsSubscribeBefore = event.data.before.data() as StatementSubscription;
        const statementsSubscribeAfter = event.data.after.data() as StatementSubscription;
       
        const roleBefore = statementsSubscribeBefore?statementsSubscribeBefore.role : undefined;
        const roleAfter = statementsSubscribeAfter? statementsSubscribeAfter.role: undefined;

        const eventType = getEventType(event);
console.log("eventType:", eventType)

        const _isMemberAfter = isMember(roleAfter);
        const _isMemberBefore = isMember(roleBefore);
        const statementId:string = statementsSubscribeBefore?.statementId || statementsSubscribeAfter?.statementId;
        console.log("statementId:", statementId)
        await addOrRemoveMemberFromStatementDB(statementId, eventType, _isMemberAfter, _isMemberBefore);

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

        async function addOrRemoveMemberFromStatementDB(statementId:string, eventType: "new" | "update" | "delete", isMemberAfter: boolean, isMemberBefore: boolean): Promise<void> {
            try {

                if(!statementId) throw new Error("statementId is required")

                const statementRef = db.doc(`${Collections.statements}/${statementId}`);
                if (eventType === "new" && isMemberAfter) {
                    console.log("adding member")
                    statementRef.update({
                        numberOfMembers: FieldValue.increment(1),
                    });
                    return;
                } else if (eventType === "delete" && isMemberBefore) {
                    console.log("removing member")
                    // statementRef.update({
                    //     numberOfMembers: FieldValue.increment(-1),
                    // });
                    return;
                } else if (eventType === "update" && isMemberAfter && !isMemberBefore) {
                    console.log("adding member")
                    // statementRef.update({
                    //     numberOfMembers: FieldValue.increment(1),
                    // });
                    return;
                } else if (eventType === "update" && !isMemberAfter && isMemberBefore) {
                    console.log("removing member")
                    // statementRef.update({
                    //     numberOfMembers: FieldValue.increment(-1),
                    // });
                    return;
                }
                console.log("----------------- no action taken -----------------")
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