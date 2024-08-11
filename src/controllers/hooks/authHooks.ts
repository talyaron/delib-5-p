// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from "react";
import { store } from "@/model/store";
import {
	Access,
	Role,
	Statement,
	StatementSchema,
	StatementSubscription,
} from "delib-npm";
import { useAppSelector } from "./reduxHooks";
import {
	statementSelector,
	statementSubscriptionSelector,
} from "@/model/statements/statementsSlice";
import { getTopParentSubscription } from "../db/subscriptions/getSubscriptions";
import { setStatementSubscriptionToDB } from "../db/subscriptions/setSubscriptions";

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
	topParentStatement: Statement | undefined;
	role: Role | undefined;
	error: boolean;
} {
	//TODO:create a check with the parent statement if subscribes. if not subscribed... go according to the rules of authorization

	const allowedRoles = [Role.admin, Role.member];

	const statementSubscription = useAppSelector(
		statementSubscriptionSelector(statementId),
	);
	const role = statementSubscription?.role || Role.unsubscribed;
	const statement = useAppSelector(statementSelector(statementId));
	const user = store.getState().user.user;
	const [topParentStatement, setTopParentStatement] = useState<
		Statement | undefined
	>(undefined);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);

	// const [role, setRole] = useState<Role | undefined>(Role.unsubscribed);
	useEffect(() => {
		if (statement && statementId && user) {
			getTopParentSubscription(statementId).then(
				({ topParentSubscription, topParentStatement, error }) => {
					try {
						StatementSchema.parse(topParentStatement);
						setTopParentStatement(topParentStatement);

						// const topRole:Role = getRole()
						// setRole(topRole);

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
								if (!topParentStatement)
									throw new Error(
										"Top parent statement is not defined, cannot subscribe to it.",
									);
								
							
								setStatementSubscriptionToDB(topParentStatement, Role.member, false	);

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

					// function getRole(): Role {

					//     const currentRole = statementSubscription?.role;
					//     const topParentStatementRole = topParentSubscription?.role;
					//     const _role = currentRole === Role.admin || topParentStatementRole === Role.admin ? Role.admin : currentRole;
					//     const role = _role ? _role : Role.unsubscribed
					//     return role;

					// }
				},
			);
		}
	}, [statementId, user, statement, statementSubscription]);

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
