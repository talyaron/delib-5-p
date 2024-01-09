const { logger } = require("firebase-functions");
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { db } from "./index";
import admin = require("firebase-admin");
import { Collections, Statement } from "delib-npm";

export async function updateSubscribedListnersCB(event: any) {
    //get statement
    const { statementId } = event.params;
    const statement = event.data.after.data();

    //get all subscribers to this statement
    const subscribersRef = db.collection(Collections.statementsSubscribe);
    const q = subscribersRef.where("statementId", "==", statementId);
    const subscribersDB = await q.get();

    //update all subscribers
    subscribersDB.docs.forEach((doc: any) => {
        try {
            const subscriberId = doc.data().statementsSubscribeId;
            if (!subscriberId) throw new Error("subscriberId not found");

            db.doc(`statementsSubscribe/${subscriberId}`).set(
                {
                    statement: statement,
                    lastUpdate: Timestamp.now().toMillis(),
                },
                { merge: true }
            );
        } catch (error) {
            logger.error("error updating subscribers", error);
        }
    });
    return;
}

export async function updateParentWithNewMessageCB(e: any) {
    try {
        //get parentId
        const statement = e.data.data() as Statement;
        const { parentId, topParentId } = statement;

        if (parentId === "top") return;

        if (!parentId) throw new Error("parentId not found");
        //update map

        //get parent
        const parentRef = db.doc(`statements/${parentId}`);
        const parentDB = await parentRef.get();
        const parent = parentDB.data();
        if (!parent) throw new Error("parent not found");
        //update parent
        const lastMessage = statement.statement;
        const lastUpdate = Timestamp.now().toMillis();
        parentRef.update({
            lastMessage,
            lastUpdate,
            totalSubStatements: FieldValue.increment(1),
        });
        //update topParent

        if (!topParentId) throw new Error("topParentId not found");
        if (topParentId === "top")
            throw new Error(
                "topParentId is top, and it is an error in the client logic"
            );

        const topParentRef = db.doc(`statements/${topParentId}`);
        topParentRef.update({ lastChildUpdate: lastUpdate, lastUpdate });

        return;
    } catch (error) {
        logger.error(error);

        return;
    }
}

export async function sendNotificationsCB(e: any) {
    try {
        const statement = e.data.data();
        if(!statement) throw new Error("statement not found");

        const parentId = statement.parentId;

        if (!parentId) throw new Error("parentId not found");

        let title: string = "",
            parent;

        //get parent statement
        if (parentId === "top") {
            title = "New message";
        } else {
            const parentRef = db.doc(`statements/${parentId}`);
            const parentDB = await parentRef.get();
            parent = parentDB.data();
            const _title = parent.statement.replace(/\*/g, "");

            //bring only the first pargarpah
            const _titleArr = _title.split("\n");
            const _titleFirstParagraph = _titleArr[0];

            //limit to 20 chars
            const __first20Chars = _titleFirstParagraph.substring(0, 20);

            title =
                parent && parent.statement
                    ? "In conversation:" + __first20Chars
                    : "New message";
        }
        //remove * from statement and bring only the first paragraph (pargraph are created by /n)

        //get all subscribers to this statement
        const subscribersRef = db.collection(Collections.statementsSubscribe);
        const q = subscribersRef
            .where("statementId", "==", parentId)
            .where("notification", "==", true);

        const subscribersDB = await q.get();

        //send push notifications to all subscribers
        subscribersDB.docs.forEach((doc: any) => {
            const token = doc.data().token;

            if (token) {
                // const notifications = {
                //   notification: {
                //     title: 'הודעה חדשה',
                //     body: statement.statement
                //   },
                //   token: token,
                //   fcm_options: {
                //     link: "http://delib.org"
                //   }
                // };

                const message: any = {
                    data: {
                        title,
                        body: statement.statement,
                        url: `https://delib-5.web.app/statement/${parentId}`,
                    },
                    token,
                };
                admin
                    .messaging()
                    .send(message)
                    .then((response: any) => {
                        // Response is a message ID string.
                    })
                    .catch((error: any) => {
                        logger.error("Error sending message:", error);
                    });
            }
        });
    } catch (error) {
        logger.error("error sending notifications", error);
    }
}
