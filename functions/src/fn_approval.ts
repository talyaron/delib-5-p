import { Approval, Collections, DocumentApproval, Statement } from "delib-npm";

import { logger } from "firebase-functions/v1";
import { db } from ".";

export async function updateApprovalResults(event: any) {
    try {
        const action:Action = getAction(event);
        const eventData = event.data.after.data() as Approval || event.data.before.data() as Approval;
        const { statementId, documentId, userId } = eventData;
        const approveAfterData = event.data.after.data() as Approval;
        const approveBeforeData = event.data.before.data() as Approval;



        let approvedDiff = 0;
        let approvingUserDiff = 0;

        if (action === Action.create) {
            //  await newApproval(eventData);
            const { approval } = approveAfterData;
            approvingUserDiff = 1;
            approvedDiff = approval ? 1 : 0;

        } else if (action === Action.delete) {
            const { approval } = approveBeforeData;
            approvingUserDiff = -1;
            approvedDiff = approval ? -1 : 0;

        } else if (action === Action.update) { 
            const { approval } = approveAfterData;
            approvedDiff = approval ? 1 : -1;

        }


        //update paragraph
        db.runTransaction(async (transaction) => {
            const statementRef = db.collection(Collections.statements).doc(statementId);
            const statementDB = await transaction.get(statementRef);
            const { documentApproval } = statementDB.data() as Statement;

            let newApprovalResults: DocumentApproval = {
                approved: approvedDiff,
                totalVoters: approvingUserDiff,
                averageApproval: approvedDiff
            };

            if (documentApproval) {
                const newApproved = documentApproval.approved + approvedDiff;
                const totalVoters = documentApproval.totalVoters + approvingUserDiff;


                newApprovalResults = {
                    approved: newApproved,
                    totalVoters,
                    averageApproval: newApproved / totalVoters
                };
            } 


            transaction.set(statementRef, { documentApproval: newApprovalResults }, { merge: true });
        });

        //update document
        db.runTransaction(async (transaction) => {
            const statementRef = db.collection(Collections.statements).doc(documentId);
            const statementDB = await transaction.get(statementRef);
            const { documentApproval } = statementDB.data() as Statement;

            const userApprovalsDB = await db.collection(Collections.approval).where("documentId", "==", documentId).where("userId", "==", userId).get();
            const numberOfUserApprovals = userApprovalsDB.size;
            const addUser = (numberOfUserApprovals === 1 && action === "create") ? 1 : 0;

            /**
             * Represents the results of a document approval.
             */
            let newApprovalResults: DocumentApproval = {
                approved: approvedDiff,
                totalVoters: addUser,
                averageApproval: approvedDiff
            };



            if (documentApproval) {

                const newApproved = documentApproval.approved + approvedDiff;
                const newTotalVoters = documentApproval.totalVoters + addUser;


                newApprovalResults = {
                    approved: newApproved,
                    totalVoters: newTotalVoters,
                    averageApproval: newApproved / newTotalVoters
                };
            }

            transaction.update(statementRef, { documentApproval: newApprovalResults });
        });


    } catch (error) {
        logger.error(error);
    }
}


export enum Action {
    create = "create",
    delete = "delete",
    update = "update",
}


export function getAction(event: any): Action {

    if (event.data.after.data() && event.data.before.data()) {
        return Action.update;
    } else if (event.data.after.data() && event.data.before.data() === undefined) {
        return Action.create;
    } else if (event.data.after.data() === undefined && event.data.before.data()) {
        return Action.delete;
    }

    return Action.update;
}

