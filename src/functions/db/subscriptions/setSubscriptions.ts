import { Statement, Role, StatementSchema, Collections } from "delib-npm";
import { doc, updateDoc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { DB } from "../config";
import { getUserFromFirebase } from "../users/usersGeneral";
import { getSubscriptionId } from "../../general/helpers";
import { store } from "../../../model/store";

export async function setStatmentSubscriptionToDB(
    statement: Statement,
    role: Role,
    userAskedForNotification: boolean = false,
    subscribeToTopParent: boolean = true,
) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");
        const { statementId } = statement;
        StatementSchema.parse(statement);

        const statementsSubscribeId = getSubscriptionId(statementId, user);
        if (!statementsSubscribeId)
            throw new Error("statementsSubscribeId is undefined");

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
        

        setDoc(
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

        if (!subscribeToTopParent) return;

        //subscribe to top parent
       subscribeToTopParentStatement(statement, role);
    } catch (error) {
        console.error(error);
    }
}

export async function subscribeToTopParentStatement(
    statement: Statement,
    role: Role,
): Promise<{ ok: boolean; error?: string }> {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");
        const { statementId } = statement;

        const topParentId = statement.topParentId;
        if (!topParentId) throw new Error("Statement has no top parent");
        const topParentStatementId = doc(
            DB,
            Collections.statements,
            topParentId,
        );
        const topParentStatementDB = await getDoc(topParentStatementId);
        if (!topParentStatementDB.exists())
            throw new Error("Top parent statement does not exist");
        const topParentStatement = topParentStatementDB.data() as Statement;

        if (!topParentId) throw new Error("Statement has no top parent");
        const topParentSubscribeId = getSubscriptionId(topParentId, user);
        if (!topParentSubscribeId)
            throw new Error("topParentSubscribeId is undefined");

        const topParentSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            topParentSubscribeId,
        );

        await setDoc(
            topParentSubscribeRef,
            {
                user,
                statement: topParentStatement,
                statementsSubscribeId: topParentSubscribeId,
                role,
                userId: user.uid,
                statementId,
                lastUpdate: Timestamp.now().toMillis(),
                createdAt: Timestamp.now().toMillis(),
            },
            { merge: true },
        );
        return { ok: true };
    } catch (error: any) {
        console.error(error);
        return { ok: false, error: error.message };
    }
}

export async function updateSubscriberForStatementSubStatements(
    statement: Statement,
) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");

        const statementsSubscribeId = getSubscriptionId(
            statement.statementId,
            user,
        );
        if(!statementsSubscribeId) throw new Error("statementsSubscribeId is undefined");

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
