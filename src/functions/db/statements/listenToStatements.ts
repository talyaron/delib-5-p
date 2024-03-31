import {
    User,
    Collections,
    StatementSubscription,
    StatementSubscriptionSchema,
    StatementType,
    Statement,
} from "delib-npm";
import {
    and,
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    or,
    orderBy,
    query,
    where,
} from "firebase/firestore";

// Redux Store
import {
    deleteSubscribedStatement,
    removeMembership,
    setMembership,
    setStatement,
    setStatementSubscription,
    setStatements,
    setStatementsSubscription,
} from "../../../model/statements/statementsSlice";
import { AppDispatch, store } from "../../../model/store";
import { DB } from "../config";

// Helpers
import { listenedStatements } from "../../../view/pages/home/Home";
import { Unsubscribe } from "firebase/auth";
import { error } from "console";

export const listenToStatementSubscription = (
    statementId: string,
    user: User,
    dispatch: AppDispatch,
): Unsubscribe => {
    try {
        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            `${user.uid}--${statementId}`,
        );

        return onSnapshot(statementsSubscribeRef, (statementSubscriptionDB) => {
            try {
                const statementSubscription =
                    statementSubscriptionDB.data() as StatementSubscription;

                const { success } = StatementSubscriptionSchema.safeParse(
                    statementSubscription,
                );
                if (!success) {
                    console.info("No subscription found");

                    return;
                }

                StatementSubscriptionSchema.parse(statementSubscription);

                dispatch(setStatementSubscription(statementSubscription));
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {};
    }
};

export const listenToStatementSubSubscriptions = (
    statementId: string,
    user: User,
    dispatch: AppDispatch,
): Unsubscribe => {
    try {
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");

        const statementsSubscribeRef = collection(
            DB,
            Collections.statementsSubscribe,
        );
        const q = query(
            statementsSubscribeRef,
            where("statement.parentId", "==", statementId),
            where("userId", "==", user.uid),
            limit(20),
        );

        return onSnapshot(q, (subscriptionsDB) => {
            let firstCall = true;
            const statementSubscriptions: StatementSubscription[] = [];

            subscriptionsDB.docChanges().forEach((change) => {
                const statementSubscription =
                    change.doc.data() as StatementSubscription;

                if (change.type === "added") {
                    if (firstCall) {
                        statementSubscriptions.push(statementSubscription);
                    } else {
                        dispatch(
                            setStatementSubscription(statementSubscription),
                        );
                    }
                }

                if (change.type === "modified") {
                    dispatch(setStatementSubscription(statementSubscription));
                }

                // if (change.type === "removed") {
                //     dispatch(
                //         deleteSubscribedStatement(
                //             statementSubscription.statementId,
                //         ),
                //     );
                // }
            });
            firstCall = false;
            dispatch(setStatementsSubscription(statementSubscriptions));
        });
    } catch (error) {
        console.error(error);

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {};
    }
};

export const listenToStatementSubscriptions =
    (dispatch: AppDispatch) =>
    (user: User, numberOfStatements?: number, onlyTop?: true) => {
        try {
            if (!user) throw new Error("User not logged in");
            if (!user.uid) throw new Error("User not logged in");

            const q = getQuery(onlyTop, numberOfStatements);

            const statementsSubscribeRef = getDocs(q)
                .then((statementsDB) => {
                    statementsDB.forEach((doc) => {
                        const statementSubscription =
                            doc.data() as StatementSubscription;

                        dispatch(
                            setStatementSubscription(statementSubscription),
                        );
                    });
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    return onSnapshot(q, (subsDB) => {
                        subsDB.docChanges().forEach((change) => {
                            const statementSubscription =
                                change.doc.data() as StatementSubscription;

                            if (change.type === "added") {
                                listenedStatements.add(
                                    statementSubscription.statement.statementId,
                                );
                                statementSubscription.lastUpdate =
                                    statementSubscription.lastUpdate;
                                dispatch(
                                    setStatementSubscription(
                                        statementSubscription,
                                    ),
                                );
                            }

                            if (change.type === "modified") {
                                listenedStatements.add(
                                    statementSubscription.statement.statementId,
                                );

                                statementSubscription.lastUpdate =
                                    statementSubscription.lastUpdate;
                                dispatch(
                                    setStatementSubscription(
                                        statementSubscription,
                                    ),
                                );
                            }

                            if (change.type === "removed") {
                                listenedStatements.delete(
                                    statementSubscription.statement.statementId,
                                );
                                statementSubscription.lastUpdate =
                                    statementSubscription.lastUpdate;
                                dispatch(
                                    deleteSubscribedStatement(
                                        statementSubscription.statement
                                            .statementId,
                                    ),
                                );
                            }
                        });
                    });
                });

            return statementsSubscribeRef;
        } catch (error) {
            console.error(error);
        }

        function getQuery(onlyTop?: boolean, numberOfStatements = 40) {
            try {
                const statementsSubscribeRef = collection(
                    DB,
                    Collections.statementsSubscribe,
                );
                if (onlyTop) {
                    return query(
                        statementsSubscribeRef,
                        where("userId", "==", user.uid),
                        where("statement.parentId", "==", "top"),
                        where(
                            "statement.statementType",
                            "==",
                            StatementType.question,
                        ),
                        orderBy("lastUpdate", "desc"),
                        limit(numberOfStatements),
                    );
                }

                return query(
                    statementsSubscribeRef,
                    and(
                        where("userId", "==", user.uid),
                        or(
                            where(
                                "statement.statementType",
                                "==",
                                StatementType.question,
                            ),
                            where(
                                "statement.statementType",
                                "==",
                                StatementType.option,
                            ),
                            where(
                                "statement.statementType",
                                "==",
                                StatementType.result,
                            ),
                        ),
                    ),
                    orderBy("lastUpdate", "desc"),
                    limit(numberOfStatements),
                );
            } catch (error) {
                console.error(error);
                const user = store.getState().user.user;
                if (!user) throw new Error("User not logged in");
                if (!user.uid) throw new Error("User not logged in");

                const statementsSubscribeRef = collection(
                    DB,
                    Collections.statementsSubscribe,
                );

                return query(
                    statementsSubscribeRef,
                    and(
                        where("userId", "==", user.uid),
                        or(
                            where(
                                "statement.statementType",
                                "==",
                                StatementType.question,
                            ),
                            where(
                                "statement.statementType",
                                "==",
                                StatementType.option,
                            ),
                            where(
                                "statement.statementType",
                                "==",
                                StatementType.result,
                            ),
                        ),
                    ),
                    orderBy("lastUpdate", "desc"),
                    limit(numberOfStatements),
                );
            }
        }
    };

export const listenToStatement = (
    statementId: string,
    dispatch: AppDispatch,
    setIsStatementNotFound: React.Dispatch<React.SetStateAction<boolean>>,
): Unsubscribe => {
    try {
        const statementRef = doc(DB, Collections.statements, statementId);

        return onSnapshot(
            statementRef,
            (statementDB) => {
                try {
                    if (!statementDB.exists()) {
                        console.log("statement not found......");
                        setIsStatementNotFound(true);
                        throw new Error("Statement does not exist");
                    }
                    const statement = statementDB.data() as Statement;
                    console.log(statement);

                    dispatch(setStatement(statement));
                } catch (error) {
                    console.error(error), setIsStatementNotFound(true);
                }
            },
            (error) => console.error(error),
        );
    } catch (error) {
        console.error(error);
        setIsStatementNotFound(true);

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
