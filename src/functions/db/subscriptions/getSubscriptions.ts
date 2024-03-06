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
} from "firebase/firestore";
import { AppDispatch, store } from "../../../model/store";
import {
    Collections,
    Statement,
    StatementSubscription,
    StatementSubscriptionSchema,
    StatementType,
    User,
} from "delib-npm";
import { DB } from "../config";
import {
    deleteSubscribedStatement,
    setStatementSubscription,
    setStatementsSubscription,
} from "../../../model/statements/statementsSlice";
import { listenedStatements } from "../../../view/pages/home/Home";
import { Unsubscribe } from "firebase/auth";
import { getSubscriptionId } from "../../general/helpers";

export async function getStatementSubscription(
    statementId: string,
): Promise<StatementSubscription | undefined> {
    try {
        const user: User | null = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        const statementSubscriptionId = getSubscriptionId(statementId, user);
        if (!statementSubscriptionId)
            throw new Error("statementSubscriptionId is undefined");
        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementSubscriptionId,
        );
        const statementSubscriptionDB = await getDoc(statementsSubscribeRef);
        if (!statementSubscriptionDB.exists())
            throw new Error("StatementSubscription does not exist");
        const statementSubscription =
            statementSubscriptionDB.data() as StatementSubscription;
        StatementSubscriptionSchema.parse(statementSubscription);
        return statementSubscription;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

interface GetTopParentSubscriptionProps {
    statement?: Statement;
    statementId?: string;
}

export async function getTopParentSubscription({
    statement,
    statementId,
}: GetTopParentSubscriptionProps): Promise<StatementSubscription | undefined> {
    try {

        if (!statement && !statementId)
            throw new Error("Statement or statementId is undefined");

        //incase statement was not given and just statementId was given
        if (!statement && statementId) {
            const statementRef = doc(DB, Collections.statements, statementId);
            const statementDB = await getDoc(statementRef);
            if (!statementDB.exists())
                throw new Error("Statement does not exist");
            statement = statementDB.data() as Statement;
        }
        if (!statement) throw new Error("Statement does not exist");

        const topParentId = statement.topParentId;
        if (!topParentId) throw new Error("Statement has no top parent");

        const user: User | null = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        const statementSubscriptionId = getSubscriptionId(topParentId, user);
        if (!statementSubscriptionId)
            throw new Error("statementSubscriptionId is undefined");
        const topParentSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementSubscriptionId,
        );
        const topParentSubscriptionDB = await getDoc(topParentSubscribeRef);
        if (!topParentSubscriptionDB.exists())
            throw new Error("StatementSubscription does not exist");
        const topParentSubscription =
            topParentSubscriptionDB.data() as StatementSubscription;
            StatementSubscriptionSchema.parse(topParentSubscription);
        return topParentSubscription;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const listenToStatementSubscription = (
    statementId: string,
    dispatch: AppDispatch,
): Unsubscribe => {
    try {
        const user = store.getState().user.user;
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");

        const statementSubscriptionId = getSubscriptionId(statementId, user);
        if (!statementSubscriptionId)
            throw new Error("statementSubscriptionId is undefined");

        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementSubscriptionId,
        );

        return onSnapshot(
            statementsSubscribeRef,
            (statementSubscriptionDB) => {
                try {
                    if (!statementSubscriptionDB.exists())
                        throw new Error("StatementSubscription does not exist");
                    const statementSubscription =
                        statementSubscriptionDB.data() as StatementSubscription;

                    StatementSubscriptionSchema.parse(statementSubscription);

                    dispatch(setStatementSubscription(statementSubscription));
                } catch (error) {
                    console.error(error);
                }
            },
            (error) => {
                console.error(error);
            },
        );
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
