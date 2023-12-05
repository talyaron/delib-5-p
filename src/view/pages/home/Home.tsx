import { useEffect } from "react";

// Third party imports
import { Outlet } from "react-router-dom";
import { StatementSubscription } from "delib-npm";

// Redux Store
import { useAppDispatch } from "../../../functions/hooks/reduxHooks";
import {
    deleteSubscribedStatement,
    setStatementSubscription,
} from "../../../model/statements/statementsSlice";

// Helpers
import { listenStatmentsSubsciptions } from "../../../functions/db/statements/getStatement";
import useAuth from "../../../functions/hooks/authHooks";

export const listenedStatements = new Set<string>();

export default function Home() {
    const dispatch = useAppDispatch();
    const isLgged = useAuth();
    // const user = useAppSelector(userSelector);

    function updateStoreStSubCB(statementSubscription: StatementSubscription) {
        dispatch(setStatementSubscription(statementSubscription));
    }
    function deleteStoreStSubCB(statementId: string) {
        dispatch(deleteSubscribedStatement(statementId));
    }

    useEffect(() => {
        let unsubscribe: Function = () => {};
        if (isLgged) {
            unsubscribe = listenStatmentsSubsciptions(
                updateStoreStSubCB,
                deleteStoreStSubCB
            );
        }
        return () => {
            unsubscribe();
        };
    }, [isLgged]);
    return (
        <>
            <Outlet />
        </>
    );
}
