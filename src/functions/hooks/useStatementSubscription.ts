import { useState, useEffect } from "react";
import { listenToSubscriptionDB } from "../db/subscriptions/getSubscriptions";
import { useAppSelector } from "./reduxHooks";
import { statementSubSelector } from "../../model/statements/statementsSlice";
import { StatementSubscription } from "delib-npm";
import { store } from "../../model/store";

interface Props {
    statementSubscription: StatementSubscription | undefined;
    error: string | undefined;
}

export function useListenStatementSubscription(statementId: string|undefined):Props {
    const [_error, setError] = useState<string | undefined>(undefined);
    const statementSubscription: StatementSubscription | undefined =
        useAppSelector(statementSubSelector(statementId));
    try {
        const userId = store.getState().user.user?.uid;
        useEffect(() => {
            let unsub = () => {};
            if (statementId && userId) {
                unsub = listenToSubscriptionDB(statementId);
            }
            return () => {
                unsub();
            };
        }, [statementId,userId]);

        return { statementSubscription, error: _error };
    } catch (error: any) {
        console.error(error);
        setError(error.message);
        return { statementSubscription, error: error.message };
    }
}
