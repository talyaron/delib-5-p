// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "../../model/store";
import { Access, Role, Statement} from "delib-npm";
import { useAppSelector } from "./reduxHooks";
import {
    statementSelector,
    statementSubscriptionSelector,
} from "../../model/statements/statementsSlice";

const useAuth = () => {
    const [isLogged, setIsLogged] = useState(false);
    const user = store.getState().user.user;
    useEffect(() => {
        if (user) setIsLogged(true);
        else setIsLogged(false);
    }, [user]);

    return isLogged;
};

export default useAuth;

export function useIsAuthorized(statementId: string | undefined): {
    isAuthorized: boolean;
    loading: boolean;
    error: boolean;
    errorMessage?: string;
    statement?: Statement;
} {
    const allowedRoles = [Role.admin, Role.member];
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statementId),
    );
    const statement = useAppSelector(statementSelector(statementId));
    const userId = store.getState().user.user?.uid;
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    try {
        useEffect(() => {
            if (statementSubscription && statement && userId) {

                if(statement.membership?.access === Access.open) {
                    setIsAuthorized(true);
                    setLoading(false);
                    return;
                }
           
                if (allowedRoles.includes(statementSubscription.role) || statement.creatorId === userId) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    setError(true);
                }
                setLoading(false);
            }
        }, [userId, statementSubscription, statement]);

        return { isAuthorized, loading, error };
    } catch (error: any) {
        console.error(error);
        return {
            isAuthorized: false,
            loading: false,
            error: true,
            errorMessage: error.message,
        };
    }
}
