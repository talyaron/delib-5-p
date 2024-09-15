import { Approval, Collections, DocumentApproval, Statement } from "delib-npm";
import { z } from "zod";
import { logger } from "firebase-functions/v1";
import { db } from ".";

export async function updateApprovalResults(event: any) {
    try {
        const action: Action|undefined = getAction(event);
        if (!action) throw new Error("No action found");
        const eventData = event.data.after.data() as Approval || event.data.before.data() as Approval;
        const { statementId, documentId, userId } = eventData;
        const approveAfterData = event.data.after.data() as Approval;
        const approveBeforeData = event.data.before.data() as Approval;



        let approvedDiff = 0;
        let approvingUserDiff = 0;

        if (action === Action.create) {

            const { approval } = approveAfterData;
            approvingUserDiff = 1;
            approvedDiff = approval ? 1 : 0;

        } else if (action === Action.delete) {
            const { approval } = approveBeforeData;
            approvingUserDiff = -1;
            approvedDiff = approval ? -1 : 0;

        } else if (action === Action.update) {
            const { approval: approvalAfter } = approveAfterData;
            const { approval: approvalBefore } = approveBeforeData;
            approvedDiff = (() => {
                if (approvalAfter && !approvalBefore) {
                    return 1;
                } else if (approvalBefore && !approvalAfter) {
                    return -1;
                }
                return 0;

            })()

        }


        //update paragraph
        db.runTransaction(async (transaction) => {
            try {
                const statementRef = db.collection(Collections.statements).doc(statementId);
                const statementDB = await transaction.get(statementRef);
                const { documentApproval } = statementDB.data() as Statement;



                if (!documentApproval) {

                    const averageApproval = getAverageApproval(approvingUserDiff !== 0 ? approvedDiff / approvingUserDiff : 0);
                    const newApprovalResults = {
                        approved: approvedDiff,
                        totalVoters: approvingUserDiff,
                        averageApproval
                    };

                    transaction.set(statementRef, { documentApproval: newApprovalResults }, { merge: true });
                    return;
                }

                const newApproved = documentApproval.approved + approvedDiff;
                const totalVoters = documentApproval.totalVoters + approvingUserDiff;

                const averageApproval = getAverageApproval(totalVoters !== 0 ? newApproved / totalVoters : 0);
                const newApprovalResults = {
                    approved: newApproved,
                    totalVoters,
                    averageApproval,
                };

                transaction.set(statementRef, { documentApproval: newApprovalResults }, { merge: true });
                return;
            } catch (error) {
                logger.error(error);
                return;
            }


        });

        function getAverageApproval(averageApproval: number): number {
            try {
                const results = z.number().safeParse(averageApproval);
                if (results.success) {
                    return averageApproval;
                }
                throw new Error("Invalid average approval");
            } catch (error) {
                console.error(error);
                return 0;
            }


        }

        //update document
        db.runTransaction(async (transaction) => {
            try {
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

                    const averageApproval = getAverageApproval(newTotalVoters !== 0 ? newApproved / newTotalVoters : 0);
                    newApprovalResults = {
                        approved: newApproved,
                        totalVoters: newTotalVoters,
                        averageApproval,
                    };
                }

                transaction.update(statementRef, { documentApproval: newApprovalResults });
                return;
            } catch (error) {
                logger.error(error);
            }
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


export function getAction(event: any): Action|undefined {

    try {
        if(!event.data.after && !event.data.before) throw new Error("No data before or after");

        if (event.data.after.data() && event.data.before.data()) {
            return Action.update;
        } else if (event.data.after.data() && event.data.before.data() === undefined) {
            return Action.create;
        } else if (event.data.after.data() === undefined && event.data.before.data()) {
            return Action.delete;
        }

        return Action.update;
    } catch (error) {
        logger.error(error);
        return undefined;
    }
}

