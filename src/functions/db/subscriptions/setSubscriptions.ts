import { Statement, Role, StatementSchema, Collections } from "delib-npm";
import { doc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { DB } from "../config";
import { getUserFromFirebase } from "../users/usersGeneral";

export async function setStatmentSubscriptionToDB(
    statement: Statement,
    role: Role,
    userAskedForNotification = false,
) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");
        const { statementId } = statement;
        StatementSchema.parse(statement);

        const statementsSubscribeId = `${user.uid}--${statementId}`;

        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementsSubscribeId,
        );

        if (userAskedForNotification) {
            return await updateDoc(statementsSubscribeRef, {
                userAskedForNotification: true,
            });
        }

        await setDoc(
            statementsSubscribeRef,
            {
                user,
                statement,
                statementsSubscribeId,
                role,
                userId: user.uid,
                statementId,
                lastUpdate: Timestamp.now().toMillis(),
                createdAt: Timestamp.now().toMillis(),
            },
            { merge: true },
        );
    } catch (error) {
        console.error(error);
    }
}

export async function updateSubscriberForStatementSubStatements(
    statement: Statement,
) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");

        const statementsSubscribeId = `${user.uid}--${statement.statementId}`;

        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementsSubscribeId,
        );
        const newSubStatmentsRead = {
            totalSubStatementsRead: statement.totalSubStatements || 0,
        };

        await updateDoc(statementsSubscribeRef, newSubStatmentsRead);
    } catch (error) {
        console.error(error);
    }
}

