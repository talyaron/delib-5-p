import {
    Collections,
    Statement,
    StatementSubscription,
    StatementSubscriptionSchema,
    StatementType,
    User,
} from "delib-npm";
import { AppDispatch, store } from "../../../model/store";
import { DB } from "../config";
import {
    and,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    or,
    orderBy,
    query,
    where,
} from "@firebase/firestore";
import {
    deleteSubscribedStatement,
    setStatementSubscription,
    setStatementsSubscription,
} from "../../../model/statements/statementsSlice";
import { listenedStatements } from "../../../view/pages/home/Home";
import { Unsubscribe } from "@firebase/util";
import { getStatementSubscriptionId } from "../../general/helpers";
import { get } from "firebase/database";
import { getStatementFromDB } from "../statements/getStatement";

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

export async function getStatmentsSubsciptions(): Promise<
    StatementSubscription[]
> {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");
        const statementsSubscribeRef = collection(
            DB,
            Collections.statementsSubscribe,
        );
        const q = query(
            statementsSubscribeRef,
            where("userId", "==", user.uid),
            limit(40),
        );
        const querySnapshot = await getDocs(q);

        const statementsSubscriptions: StatementSubscription[] = [];

        querySnapshot.forEach((doc) => {
            statementsSubscriptions.push(doc.data() as StatementSubscription);
        });

        return statementsSubscriptions;
    } catch (error) {
        console.error(error);

        return [];
    }
}

export async function getSubscriptions() {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");
        const statementsSubscribeRef = collection(
            DB,
            Collections.statementsSubscribe,
        );
        const q = query(
            statementsSubscribeRef,
            where("userId", "==", user.uid),
            orderBy("lastUpdate", "desc"),
            limit(20),
        );

        const subscriptionsDB = await getDocs(q);

        const subscriptions: StatementSubscription[] = [];
        subscriptionsDB.forEach((doc) => {
            const statementSubscription = doc.data() as StatementSubscription;

            StatementSubscriptionSchema.parse(statementSubscription);

            subscriptions.push(statementSubscription);
        });

        return subscriptions;
    } catch (error) {
        console.error(error);
    }
}

export async function getIsSubscribed(
    statementId: string | undefined,
): Promise<boolean> {
    try {
        if (!statementId) throw new Error("Statement id is undefined");
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");

        const subscriptionRef = doc(
            DB,
            Collections.statementsSubscribe,
            `${user.uid}--${statementId}`,
        );
        const subscriptionDB = await getDoc(subscriptionRef);

        if (!subscriptionDB.exists()) return false;

        return true;
    } catch (error) {
        console.error(error);

        return false;
    }
}

export async function getStatementSubscriptionFromDB(
    statementId: string,
): Promise<StatementSubscription | undefined> {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");

        const statementSubscrionId = getStatementSubscriptionId(
            statementId,
            user,
        );
        if (!statementSubscrionId)
            throw new Error("Statement subscription id is undefined");

        const subscriptionRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementSubscrionId,
        );
        const subscriptionDB = await getDoc(subscriptionRef);

        if (!subscriptionDB.exists()) return;

        const subscription = subscriptionDB.data() as StatementSubscription;

        return subscription;
    } catch (error) {
        console.error(error);
    }
}

interface GetTopParentSubscriptionProps {
    topParentStatement: Statement | undefined;
    topParentSubscription: StatementSubscription | undefined;
    error?: boolean;
}

export async function getTopParentSubscription(
    statementId: string,
): Promise<GetTopParentSubscriptionProps> {
    try {
        //try to get the user from the store
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");

        const statement: Statement | undefined = await getStatement();

        const topParentId = statement.topParentId;
        if (!topParentId) throw new Error("Top parent id is undefined");

        const topParentSubscriptionId = getStatementSubscriptionId(
            topParentId,
            user,
        );

        //get top subscription
        const topParentSubscription = await getParentSubscription(
            topParentSubscriptionId,
            topParentId,
        );

        if (topParentSubscription) {
            return {
                topParentSubscription,
                topParentStatement: topParentSubscription.statement,
                error: false,
            };
        }

        //get top statement
        debugger;
        let topParentStatement: Statement | undefined =
            await getTopParentStatement(topParentId);

        return { topParentStatement, topParentSubscription, error: false };
    } catch (error) {
        console.error(error);
        return {
            topParentStatement: undefined,
            topParentSubscription: undefined,
            error: true,
        };
    }

    async function getTopParentStatement(topParentId: string) {
        let topParentStatement: Statement | undefined = store
            .getState()
            .statements.statements.find((st) => st.statementId === topParentId);
        if (!topParentStatement) {
            topParentStatement = await getStatementFromDB(topParentId);
        }
        if (!topParentStatement)
            throw new Error("Top parent statement not found");
        return topParentStatement;
    }

    async function getParentSubscription(
        topParentSubscriptionId: string | undefined,
        topParentId: string,
    ) {
        let topParentSubscription: StatementSubscription | undefined = store
            .getState()
            .statements.statementSubscription.find(
                (sub: StatementSubscription) =>
                    sub.statementsSubscribeId === topParentSubscriptionId,
            );

        if (!topParentSubscription) {
            topParentSubscription =
                await getStatementSubscriptionFromDB(topParentId);
        }
        return topParentSubscription;
    }

    async function getStatement() {
        let statement: Statement | undefined = store
            .getState()
            .statements.statements.find(
                (st: Statement) => st.statementId === statementId,
            );

        if (!statement) {
            statement = await getStatementFromDB(statementId);
        }
        if (!statement) throw new Error("Statement not found");
        return statement;
    }
}
