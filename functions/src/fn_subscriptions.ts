import { StatementSubscription } from "delib-npm";
import { logger } from "firebase-functions";
import { isMember } from "delib-npm/dist/controllers/helpers";
import { addOrRemoveMemberFromStatementDB } from "./fn_statementsMetaData";


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

        
    } catch (error) {
        logger.error("error updating statement with number of members", error);
    }
}