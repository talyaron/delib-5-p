/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from "firebase-admin";
import { Collections, Statement, StatementSubscription } from "delib-npm";
import { logger } from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./index";
import { log } from "firebase-functions/logger";
import { z } from "zod";

export async function sendNotificationsCB(e: any) {
	try {
		const statement = e.data.data();
		if (!statement) throw new Error("statement not found");

		const parentId = statement.parentId;

		if (!parentId) throw new Error("parentId not found");

		const parentRef = db.doc(`statements/${parentId}`);
		const parentDB = await parentRef.get();

		const parent = parentDB.exists ? (parentDB.data() as Statement) : null;
		const _title = parent ? parent.statement.replace(/\*/g, "") : "Delib-5";

		//bring only the first paragraph
		const _titleArr = _title.split("\n");
		const _titleFirstParagraph = _titleArr[0];

		//limit to 20 chars
		const parentStatementTitle = _titleFirstParagraph.substring(0, 20);

		// const title = "In conversation: " + __first20Chars;
		const title = `${parentStatementTitle} / ${statement.creator.displayName}`;

		//get all subscribers to this statement
		const subscribersRef = db.collection(Collections.statementsSubscribe);

		const q = subscribersRef
			.where("statementId", "==", parentId)
			.where("notification", "==", true);

		const subscribersDB = await q.get();

		//send push notifications to all subscribers
		subscribersDB.docs.forEach((subscriberDB) => {
			const subscriber = subscriberDB.data() as StatementSubscription;
			const tokenArr = subscriber.token;
			const { success } = z.array(z.string()).safeParse(tokenArr);
			if (!success) {
				log(`tokenArr is not an array of strings`, tokenArr);

				return;
			}

			if (tokenArr && tokenArr.length > 0) {
				// Send a message to each device the user has registered for notifications.

				try {
					tokenArr.forEach((token: string) => {
						const message: any = {
							notification: {
								title,
								body: statement.statement,
							},
							data: {
								title,
								body: statement.statement,
								statementId: parentId,
								chatId: `${parentId}/chat`,
								url: `https://freedi.tech/statement/${parentId}/chat`,

							},
							webpush: {
								fcm_options: {
									link: `https://freedi.tech/statement/${parentId}/chat`,
								},
							},
							token,
						};
						message.android = {
							notification: {
								icon: "https://firebasestorage.googleapis.com/v0/b/synthesistalyaron.appspot.com/o/logo%2Flogo-48px.png?alt=media&token=e2d11208-2c1c-4c29-a422-42a4e430f9a0", // Replace with your icon name
							},
						};
						message.apns = {
							payload: {
								aps: {
									"mutable-content": 1,
								},
							},
							fcm_options: {
								image: "https://firebasestorage.googleapis.com/v0/b/synthesistalyaron.appspot.com/o/logo%2Flogo-48px.png?alt=media&token=e2d11208-2c1c-4c29-a422-42a4e430f9a0", // Replace with your icon URL
							},
						};
						admin
							.messaging()
							.send(message)
							.then((response: any) => {
								// Response is a message ID string.
								logger.info(
									"Successfully sent message:",
									response,
								);
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

									db.collection(
										Collections.statementsSubscribe,
									)
										.where(
											"statementsSubscribeId",
											"==",
											subscriber.statementsSubscribeId,
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
				} catch (error) {
					logger.error(
						`send push notifications to all subscriber `,
						error,
					);
				}
			}
		});
	} catch (error) {
		logger.error("error sending notifications", error);
	}
}
