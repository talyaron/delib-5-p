// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "../../model/store";
import { InclusionPolicy, Role, Statement, StatementSubscription } from "delib-npm";
import { useAppSelector } from "./reduxHooks";
import { statementSelector, statementSubscriptionSelector } from "../../model/statements/statementsSlice";

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

export function useIsAuthorized(statementId: string|undefined): {
    isAuthorized: boolean;
    loading: boolean;
    statementSubscription:StatementSubscription|undefined,
    statement:Statement|undefined
    error:boolean
} {
const allowedRoles = [Role.admin, Role.parentAdmin,Role.systemAdmin, Role.statementCreator, Role.member];
    const statementSubscription = useAppSelector(statementSubscriptionSelector(statementId));
    const statement = useAppSelector(statementSelector(statementId));
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
 
    
    useEffect(() => {
        if (statementSubscription && statement) {
            if (allowedRoles.includes(statementSubscription.role)) {
                setIsAuthorized(true);
            } else {
                //not a member

                //what is the statement inclusion policy?
                const inclusionPolicy:InclusionPolicy|undefined = statement.members?.inclusionPolicy;
                if(inclusionPolicy === InclusionPolicy.open){
                    console.log('open');
                }else if(inclusionPolicy === InclusionPolicy.close){
                    console.log('close');
                }

                setIsAuthorized(false);
                setError(true);
            }
            setLoading(false);
        }
    }, [statementSubscription, statement]);

    return { isAuthorized, loading,statementSubscription,statement, error };
}
