// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "../../model/store";
import { Access, Role, Statement, StatementSubscription } from "delib-npm";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
    setStatementSubscription,
    statementSelector,
    statementSubscriptionSelector,
} from "../../model/statements/statementsSlice";
import {
    getStatementSubscription,
    getTopParentSubscription,
} from "../db/subscriptions/getSubscriptions";
import { isAuthorized } from "../general/helpers";
import { set } from "zod";

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
    const dispatch = useAppDispatch();
    const allowedRoles = [Role.admin, Role.member];
    const statement = useAppSelector(statementSelector(statementId));
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statementId),
    );
    const topParentSubscription = useAppSelector(
        statementSubscriptionSelector(statement?.topParentId),
    );
    const userId = store.getState().user.user?.uid;
    const [_isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    try {
        //check subscription
        useEffect(() => {
            if (!topParentSubscription && (userId&& statement)) {
                getTopParentSubscription({ statement, statementId })
                    .then((sub: StatementSubscription | undefined) => {
                        if(!sub) throw new Error("No subscription");
                        if (isAuthorized(statement, sub)){
                            dispatch(setStatementSubscription(sub));
                            setIsAuthorized(true);
                        }
                        else {
                            console.log(
                                "topParentSubscription",
                                "no subscription",
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        setError(true);
                        setErrorMessage(error.message);
                    });
            }
            else if(topParentSubscription && statement){
                if(isAuthorized(statement, topParentSubscription,allowedRoles)){
                    setIsAuthorized(true);
                    setLoading(false);
                }
            }
        }, [statement, topParentSubscription, userId]);
      

        useEffect(() => {
            if(statement && statementSubscription)
            if(isAuthorized(statement, statementSubscription, allowedRoles)){
                setIsAuthorized(true);
                setLoading(false);
            }
        }, [statement, statementSubscription]);

        return { isAuthorized:_isAuthorized, loading, error, errorMessage };
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
