// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "../../model/store";
import { Access, Role, Statement, StatementSubscription } from "delib-npm";
import { useAppSelector } from "./reduxHooks";
import {
    statementSelector,
    statementSubscriptionSelector,
} from "../../model/statements/statementsSlice";
import { getTopParentSubscription } from "../db/subscriptions/getSubscriptions";
import { setStatmentSubscriptionToDB } from "../db/subscriptions/setSubscriptions";

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
    statementSubscription: StatementSubscription | undefined;
    statement: Statement | undefined;
    error: boolean;
} {
    //TODO:create a check with the parent statement if subscribes. if not subscribed... go accoring to the rules of authorization

    const allowedRoles = [Role.admin, Role.member];

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statementId),
    );
    const statement = useAppSelector(statementSelector(statementId));
    const user = store.getState().user.user;
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    useEffect(() => {
        if (statement && statementId && user) {
            getTopParentSubscription(statementId).then(
                ({ topParentSubscription, topParentStatement, error }) => {
                    try {
                        if (error)
                            throw new Error(
                                "Error in getting top parent subscription",
                            );
                        if (topParentSubscription) {
                            if (
                                allowedRoles.includes(
                                    topParentSubscription.role,
                                )
                            ) {
                                setIsAuthorized(true);
                            } else {
                                setIsAuthorized(false);
                                setError(true);
                            }
                            setLoading(false);
                        } else {
                            //if group is open, subscribe to its top parent statement
                            if (
                                topParentStatement &&
                                topParentStatement?.membership?.access ===
                                    Access.open
                            ) {
                                //subscribe to top parent statement
                                if(!topParentStatement) throw new Error("Top parent statement is not defined, cannot subscribe to it.");

                                setStatmentSubscriptionToDB({
                                    //@ts-ignore
                                    statement: topParentStatement,
                                    role: Role.member,
                                    userAskedForNotification: false,
                                });

                                setIsAuthorized(true);
                                setLoading(false);
                                setError(false);
                            } else {
                                //deal with registration...
                                setIsAuthorized(false);
                                setError(true);
                                setLoading(false);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                        setError(true);
                        setLoading(false);
                    }
                },
            );
        }
    }, [statementId, user, statement]);

    // useEffect(() => {
    //     if (statementSubscription && statement) {
    //         if (allowedRoles.includes(statementSubscription.role)) {
    //             setIsAuthorized(true);
    //         } else {
    //             setIsAuthorized(false);
    //             setError(true);
    //         }
    //         setLoading(false);
    //     }
    // }, [statementSubscription, statement]);

    return { isAuthorized, loading, statementSubscription, statement, error };
}
