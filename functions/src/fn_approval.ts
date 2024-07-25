import { Approval, Collections, DocumentApproval, Statement } from "delib-npm";

import { logger } from "firebase-functions/v1";
import { db } from ".";

export async function updateApprovalResults(event: any) {
    try {
        const action = getAction(event);
        const eventData = event.data.after.data() as Approval || event.data.before.data() as Approval;
        const { statementId, documentId, userId} = eventData;
        const approveAfterData = event.data.after.data() as Approval;
        const approveBeforeData = event.data.before.data() as Approval;
        const { approval: approveAfter } = approveAfterData;
        const { approval: approveBefore } = approveBeforeData;


       
        let approvedDiff = 0;
        let rejectedDiff = 0;
        let approvingUserDiff = 0;

        if (action === "create") {
            //  await newApproval(eventData);
      
            approvingUserDiff = 1;
            approvedDiff = approveAfter ? 1 : 0;
            rejectedDiff = approveAfter ? 0 : 1;
        } else if (action === "delete") {
      
            approvingUserDiff = -1;
            approvedDiff = approveBefore ? -1 : 0;
            rejectedDiff = approveBefore ? 0 : -1;
        } else if (action === "update") {
            approvedDiff = approveAfter ? 1 : -1;
            rejectedDiff = approveAfter ? -1 : 1;
        }

        //update paragraph
        db.runTransaction(async (transaction) => {
            const statementRef = db.collection(Collections.statements).doc(statementId);
            const statementDB = await transaction.get(statementRef);
            const { documentApproval } = statementDB.data() as Statement;

            let newApprovalResults: DocumentApproval = {
                approved: approvedDiff,
                rejected: rejectedDiff,
                totalUsersAppRej: approvingUserDiff,
                averageApproval: approvedDiff || rejectedDiff
            };

            if (documentApproval) {


                newApprovalResults = {
                    approved: documentApproval.approved + approvedDiff,
                    rejected: documentApproval.rejected + rejectedDiff,
                    totalUsersAppRej: documentApproval.totalUsersAppRej + approvingUserDiff,
                    averageApproval: (documentApproval.approved + approvedDiff) / (documentApproval.totalUsersAppRej + approvingUserDiff)
                };
            }

            transaction.update(statementRef, { approvalResults: newApprovalResults });
        });

        //update document
        db.runTransaction(async (transaction) => {
            const statementRef = db.collection(Collections.statements).doc(documentId);
            const statementDB = await transaction.get(statementRef);
            const { documentApproval } = statementDB.data() as Statement;

            const userApprovalsDB = await db.collection(Collections.approval).where("documentId", "==", documentId).where("userId", "==", userId).get();
            const numberOfUserApprovals = userApprovalsDB.size;
            const addUser = (numberOfUserApprovals === 1 && action === "create")? 1 : 0;

            let newApprovalResults: DocumentApproval = {
                approved: approvedDiff,
                rejected: rejectedDiff,
                totalUsersAppRej: addUser,
                averageApproval: approvedDiff || rejectedDiff
            };

            if (documentApproval) {


                newApprovalResults = {
                    approved: documentApproval.approved + approvedDiff,
                    rejected: documentApproval.rejected + rejectedDiff,
                    totalUsersAppRej: documentApproval.totalUsersAppRej + addUser,
                    averageApproval: (documentApproval.approved + approvedDiff) / (documentApproval.totalUsersAppRej + approvingUserDiff)
                };
            }

            transaction.update(statementRef, { approvalResults: newApprovalResults });
        });
        

    } catch (error) {
        logger.error(error);
    }
}

export function getAction(event: any): "create" | "delete" | "update" {

    if (event.data.after.data() && event.data.before.data()) {
        return "update";
    } else if (event.data.after.data() && event.data.before.data() === undefined) {
        return "create";
    } else if (event.data.after.data() === undefined && event.data.before.data()) {
        return "delete";
    }

    return "update";
}

