import {
  
    Collections,
    StatementSubscription,
    StatementType,
    Statement,
} from "delib-npm";
import {
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";

// Redux Store
import {
    removeMembership,
    setMembership,
    setStatement,
    setStatements,
} from "../../../model/statements/statementsSlice";
import { AppDispatch, store } from "../../../model/store";
import { DB } from "../config";

// Helpers
import { Unsubscribe } from "firebase/auth";
import { setError } from "../../../model/error/errorSlice";




export const listenToStatement = (
    statementId: string,
    dispatch: AppDispatch,
    handleRedirectToHome: () => void,
): Unsubscribe => {
    try {
        const statementRef = doc(DB, Collections.statements, statementId);     
        return onSnapshot(statementRef, (statementDB) => {
         
            try {
                const statement = statementDB.data() as Statement;
                dispatch(setStatement(statement));
            } catch (error: any) {
                console.error(error);
            }
        }, error => {
            console.error(error);
            handleRedirectToHome();
        });
    } catch (error: any) {
        console.error(error);
        dispatch(setError(error.message));
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {};
    }
};

export const listenToSubStatements = (
    statementId: string | undefined,
    dispatch: AppDispatch,
): Unsubscribe => {
    try {
        if (!statementId) throw new Error("Statement id is undefined");
        const statementsRef = collection(DB, Collections.statements);
        const q = query(
            statementsRef,
            where("parentId", "==", statementId),
            orderBy("createdAt", "desc"),
            limit(20),
        );
        let isFirstCall = true;

        return onSnapshot(q, (statementsDB) => {
            const startStatements: Statement[] = [];
            statementsDB.docChanges().forEach((change) => {
                const statement = change.doc.data() as Statement;

                if (change.type === "added") {
                    if (isFirstCall) {
                        startStatements.push(statement);
                    } else {
                        dispatch(setStatement(statement));
                    }
                }

                if (change.type === "modified") {
                    dispatch(setStatement(statement));
                }

                // There shouldn't be deleted statements. instead the statement should be updated to status "deleted".
                // If You will use delete, it will remove from the dom a messages that are outside of the limit of the query.
            });
            isFirstCall = false;

            dispatch(setStatements(startStatements));
        });
    } catch (error) {
        console.error(error);

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {};
    }
};

export const listenToMembers =
    (dispatch: AppDispatch) => (statementId: string) => {
        try {
            const membersRef = collection(DB, Collections.statementsSubscribe);
            const q = query(
                membersRef,
                where("statementId", "==", statementId),
                orderBy("createdAt", "desc"),
            );

            return onSnapshot(q, (subsDB) => {
                subsDB.docChanges().forEach((change) => {
                    const member = change.doc.data() as StatementSubscription;
                    if (change.type === "added") {
                        dispatch(setMembership(member));
                    }

                    if (change.type === "modified") {
                        dispatch(setMembership(member));
                    }

                    if (change.type === "removed") {
                        dispatch(
                            removeMembership(member.statementsSubscribeId),
                        );
                    }
                });
            });
        } catch (error) {
            console.error(error);
        }
    };

export async function listenToUserAnswer(
    questionId: string,
    cb: (statement: Statement) => void,
) {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        const statementsRef = collection(DB, Collections.statements);
        const q = query(
            statementsRef,
            where("statementType", "==", StatementType.option),
            where("parentId", "==", questionId),
            where("creatorId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(1),
        );

        return onSnapshot(q, (statementsDB) => {
            statementsDB.docChanges().forEach((change) => {
                const statement = change.doc.data() as Statement;

                cb(statement);
            });
        });
    } catch (error) {
        console.error(error);
    }
}
