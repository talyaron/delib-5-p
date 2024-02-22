import { useState, useEffect } from "react";
import {
    statementSelector,
    statementSubSelector,
} from "../../model/statements/statementsSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { listenToStatement } from "../db/statements/getStatement";
import { isAuthorized } from "../general/helpers";
import { Statement, StatementSubscription } from "delib-npm";
import { listenToStatementSubscription } from "../db/statements/listenToStatements";

interface Props {
    statement: Statement | undefined;
    statementSubscription: StatementSubscription | undefined;
    isAuthorized: boolean;
    loading: boolean;
    error: boolean;
}

//this use statement hook is used to listen to a statement from the database, and should also return statment and substatment subscription if the use is authorized.
export function useListenStatement(statementId: string | undefined):Props {
    const statement = useAppSelector(statementSelector(statementId));
    const statementSubscription = useAppSelector(
        statementSubSelector(statementId),
    );

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    try {
        if (!statementId) {
            throw new Error("statementId is undefined");
        }

        useEffect(() => {
            let unsub = () => {}, unsub2 = () => {};

            if (statementId) {
                unsub = listenToStatement(statementId, dispatch);
                unsub2 = listenToStatementSubscription(statementId, dispatch);
            }
            return () => {
                unsub();
                unsub2();
            };
        }, [statementId]);
        useEffect(() => {
            if (statement && statementSubscription) {
                setLoading(false);
            } else {
                setLoading(true);
            }
        }, [statement, statementSubscription]);
    } catch (error: any) {
        console.error(error);
        setError(error.message);
        setLoading(false);
    }

    return {
        statement: isAuthorized(statement, statementSubscription)
            ? statement
            : undefined,
        statementSubscription: isAuthorized(statement, statementSubscription)
            ? statementSubscription
            : undefined,
        isAuthorized: isAuthorized(statement, statementSubscription),
        loading,
        error,
    };
}
