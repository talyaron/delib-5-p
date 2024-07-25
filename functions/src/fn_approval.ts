import { Approval, Collections, DocumentApproval, Statement } from "delib-npm";

import { logger } from "firebase-functions/v1";
import { db } from ".";

export async function updateApprovalResults(event: any) {
    try {
        const action = getAction(event);
        const eventData = event.data.after.data() as Approval || event.data.before.data() as Approval;
        const { statementId, documentId, userId } = eventData;
        const approveAfterData = event.data.after.data() as Approval;
        const approveBeforeData = event.data.before.data() as Approval;

        console.log("approveAfterData.approval", approveAfterData.approval ? "Approved" : "Rejected");

        let approvedDiff = 0;
        let approvingUserDiff = 0;

        if (action === "create") {
            //  await newApproval(eventData);
            const { approval } = approveAfterData;
            approvingUserDiff = 1;
            approvedDiff = approval ? 1 : 0;
          
        } else if (action === "delete") {
            const { approval } = approveBeforeData;
            approvingUserDiff = -1;
            approvedDiff = approval ? -1 : 0;
          
        } else if (action === "update") {
            const { approval } = approveAfterData;
            approvedDiff = approval ? 1 : -1;
          
        }

        console.log("approvedDiff", approvedDiff, "approvingUserDiff", approvingUserDiff);

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
                console.log("Pervious Approve", documentApproval.approved, "newApproved", newApproved);

                newApprovalResults = {
                    approved: newApproved,
                    totalVoters,
                    averageApproval: newApproved  / totalVoters
                };
            } else {
                console.log("No documentApproval on", statementId);
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

            console.log("newApprovalResults", newApprovalResults);

            if (documentApproval) {

                const newApproved = documentApproval.approved + approvedDiff;
              const newTotalVoters =documentApproval.totalVoters + addUser;


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

