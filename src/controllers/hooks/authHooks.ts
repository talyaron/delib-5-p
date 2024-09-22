// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "@/model/store";
import { Access, Role, Statement, StatementSchema, StatementSubscription } from "delib-npm";
import { useAppSelector } from "./reduxHooks";
import { statementSelector, statementSubscriptionSelector } from "@/model/statements/statementsSlice";
import { getTopParentSubscription } from "../db/subscriptions/getSubscriptions";
import { setStatementSubscriptionToDB } from "../db/subscriptions/setSubscriptions";

const useAuth = () => {
  const [isLogged, setIsLogged] = useState(false);
  const user = store.getState().user.user;

  useEffect(() => {
    if (user) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [user]);

  return isLogged;
};

export default useAuth;

export function useIsAuthorized(statementId: string | undefined): {
  isAuthorized: boolean;
  loading: boolean;
  statementSubscription: StatementSubscription | undefined;
  statement: Statement | undefined;
  topParentStatement: Statement | undefined;
  role: Role | undefined;
  error: boolean;
} {
  //TODO:create a check with the parent statement if subscribes. if not subscribed... go according to the rules of authorization

	const statementSubscription = useAppSelector(
		statementSubscriptionSelector(statementId),
	);
	const role = statementSubscription?.role || Role.unsubscribed;
	const statement = useAppSelector(statementSelector(statementId));
	const [topParentStatement, setTopParentStatement] = useState<
		Statement | undefined
	>(undefined);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		if (!statement) return;

	// if statment close, and !member or admin -> show password

		isAuthorizedFn(statement, statementSubscription).then((_isAuthorized) => {
			if (_isAuthorized) {
				setIsAuthorized(true);
				setLoading(false);
			} else {
				setIsAuthorized(false);
				setLoading(false);
				setError(true);
			}
		});

	}, [statement, statementSubscription]);

	useEffect(() => {
	    if (statementSubscription && statement) {
	        if (allowedRoles.includes(statementSubscription.role)) {
	            setIsAuthorized(true);
	        } else {
	            setIsAuthorized(false);
	            setError(true);
	        }
	        setLoading(false);
	    }
	}, [statementSubscription, statement]);

  return {
    isAuthorized,
    loading,
    statementSubscription,
    statement,
    topParentStatement,
    error,
    role,
  };
}
