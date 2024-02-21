// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "../../model/store";
import { Role } from "delib-npm";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { statementSelector } from "../../model/statements/statementsSlice";
import { getTopStatementFromDB } from "../db/statements/getStatement";
import { getTopParentSubscriptionFromDB } from "../db/subscriptions/getSubscriptions";

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

interface IsAuthorizedProps {
    isAuthorized: boolean;
    loading: boolean;
    error: boolean;
    role: Role;
}

export function useIsAuthorized(
    statementId: string | undefined,
): IsAuthorizedProps {
    const allowedRoles = [
        Role.admin,
        Role.parentAdmin,
        Role.systemAdmin,
        Role.statementCreator,
        Role.member,
    ];

    const statement = useAppSelector(statementSelector(statementId));
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [role, setRole] = useState<Role>(Role.guest);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        //get parent statement

        if (statement && statementId) {
            Promise.all([
                getTopStatementFromDB(statement, dispatch),
                getTopParentSubscriptionFromDB(statementId),
            ])
                .then(
                    ([topParentStatement, topParentStatementSubscription]) => {
                        if (
                            topParentStatement &&
                            topParentStatementSubscription
                        ) {
                            if (
                                allowedRoles.includes(
                                    topParentStatementSubscription.role,
                                )
                            ) {
                                setRole(topParentStatementSubscription.role);
                                setIsAuthorized(true);
                            } else {
                                setIsAuthorized(false);
                                setError(true);
                            }
                            setLoading(false);
                        }
                    },
                )
                .catch((error) => {
                    console.error(error);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [statement, statementId]);

    return { isAuthorized,role, loading, error };
}
