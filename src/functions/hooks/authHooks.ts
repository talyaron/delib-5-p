// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "../../model/store";
import { Role, Statement, StatementSubscription } from "delib-npm";
import { isAuthorized } from "../general/helpers";

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

export function useIsAuthorized(
    statement: Statement | undefined,
    topStatementSubscription: StatementSubscription | undefined,
    allowedRoles: Role[] = [Role.admin, Role.member],
): {
    isAuthorized: boolean;
    loading: boolean;
    error?: boolean;
    errorMessage?: string;
} {
    const [_isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    try {
        console.log("useIsAuthorized");

        if (!statement || !topStatementSubscription) {
            
            return { isAuthorized: false, loading: true };
        }

        if(isAuthorized(statement, topStatementSubscription, allowedRoles)) {
            setIsAuthorized(true);
            setLoading(false);
        } else {
            setIsAuthorized(false);
            setLoading(true);
        }

        return { isAuthorized: _isAuthorized, loading };
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
