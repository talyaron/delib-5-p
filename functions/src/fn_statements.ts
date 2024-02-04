import { Collections, Statement } from "delib-npm";
import { logger } from "firebase-functions";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { db } from "./index";


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
                { merge: true },
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
                "topParentId is top, and it is an error in the client logic",
            );

        const topParentRef = db.doc(`statements/${topParentId}`);
        topParentRef.update({ lastChildUpdate: lastUpdate, lastUpdate });

        return;
    } catch (error) {
        logger.error(error);

        return;
    }
}


