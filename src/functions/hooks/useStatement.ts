import { useState, useEffect } from "react";
import { statementSelector } from "../../model/statements/statementsSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { listenToStatement } from "../db/statements/getStatement";

export function useListenStatement(statementId: string | undefined) {
    const statement = useAppSelector(statementSelector(statementId));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    try {
        if (!statementId) {
            throw new Error("statementId is undefined");
        }

        useEffect(() => {
            let unsub = () => {};
            if (statementId) {
                unsub = listenToStatement(statementId, dispatch);
            }
            return () => {
                unsub();
            };
        }, [statementId]);
        useEffect(() => {
            if (statement) {
                setLoading(false);
            } else {
                setLoading(true);
            }
        }, [statement]);
    } catch (error: any) {
        console.error(error);
        setError(error.message);
        setLoading(false);
    }

    return { statement, loading, error };
}
