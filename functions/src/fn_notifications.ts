import * as admin from "firebase-admin";
import { Collections, Statement } from "delib-npm";
import { logger } from "firebase-functions";
import {  FieldValue } from "firebase-admin/firestore";
import { db } from "./index";


export async function sendNotificationsCB(e: any) {
    try {
        const statement = e.data.data();
        if (!statement) throw new Error("statement not found");

        const parentId = statement.parentId;

        if (!parentId) throw new Error("parentId not found");

        const parentRef = db.doc(`statements/${parentId}`);
        const parentDB = await parentRef.get();
        const parent = parentDB.data() as Statement;
        const _title = parent.statement.replace(/\*/g, "");

        //bring only the first pargarpah
        const _titleArr = _title.split("\n");
        const _titleFirstParagraph = _titleArr[0];

        //limit to 20 chars
        const parentStatementTitle = _titleFirstParagraph.substring(0, 20);

        // const title = "In conversation: " + __first20Chars;
        const title = `${statement.creator.displayName} sent a message in ${parentStatementTitle}`;

        //get all subscribers to this statement
        const subscribersRef = db.collection(Collections.statementsSubscribe);

        const q = subscribersRef
            .where("statementId", "==", parentId)
            .where("notification", "==", true);

        const subscribersDB = await q.get();

        //send push notifications to all subscribers
        subscribersDB.docs.forEach((doc: any) => {
            const tokenArr = doc.data().token as string[];

            if (tokenArr && tokenArr.length > 0) {
                // Send a message to each device the user has registered for notifications.

                tokenArr.forEach((token: string) => {
                    const message: any = {
                        data: {
                            title,
                            body: statement.statement,

                            // url: `https://delib-5.web.app/statement/${parentId}/chat`,

                            url: `https://delib-v3-dev.web.app/statement/${parentId}/chat`,
                            creatorId: statement.creatorId,
                        },
                        token,
                    };

                    admin
                        .messaging()
                        .send(message)
                        .then((response: any) => {
                            // Response is a message ID string.
                            logger.info("Successfully sent message:", response);
                        })
                        .catch((error: any) => {
                            logger.error(
                                "Error failed to sent notification: ",
                                error,
                            );

                            // Delete token from DB if it is not valid.
                            if (
                                error.code ===
                                    "messaging/invalid-registration-token" ||
                                error.code ===
                                    "messaging/registration-token-not-registered" ||
                                error.message ===
                                    "The registration token is not a valid FCM registration token"
                            ) {
                                logger.info("Deleting token from DB");

                                db.collection(Collections.statementsSubscribe)
                                    .where(
                                        "statementsSubscribeId",
                                        "==",
                                        doc.data().statementsSubscribeId,
                                    )
                                    .get()
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            doc.ref.update({
                                                token: FieldValue.arrayRemove(
                                                    token,
                                                ),
                                            });
                                        });
                                    });
                            }
                        });
                });
            }
        });
    } catch (error) {
        logger.error("error sending notifications", error);
    }
}