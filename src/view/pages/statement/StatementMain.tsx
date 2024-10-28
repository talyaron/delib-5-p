import { FC, useEffect, useState } from "react";


// Third party imports
import { useNavigate, useParams } from "react-router-dom";
import { User, Role, Screen, Access } from "delib-npm";

// firestore
import { getIsSubscribed } from "@/controllers/db/subscriptions/getSubscriptions";
import {
	listenToStatement,
	listenToStatementSubscription,
	listenToAllDescendants,
	listenToSubStatements,
} from "@/controllers/db/statements/listenToStatements";
import {
	updateSubscriberForStatementSubStatements,
	setStatementSubscriptionToDB,
} from "@/controllers/db/subscriptions/setSubscriptions";

import { listenToEvaluations } from "@/controllers/db/evaluation/getEvaluation";

// Redux Store
import { useAppDispatch, useAppSelector } from "@/controllers/hooks/reduxHooks";
import { RootState } from "@/model/store";
import { userSelector } from "@/model/users/userSlice";
import { useSelector } from "react-redux";

// Hooks & Helpers
import { MapProvider } from "@/controllers/hooks/useMap";
import { statementTitleToDisplay } from "@/controllers/general/helpers";
import { availableScreen } from "./StatementCont";
import { useIsAuthorized } from "@/controllers/hooks/authHooks";

// Custom components
import LoadingPage from "../loadingPage/LoadingPage";
import Page404 from "../page404/Page404";
import UnAuthorizedPage from "../unAuthorizedPage/UnAuthorizedPage";
import ProfileImage from "../../components/profileImage/ProfileImage";
import StatementHeader from "./components/header/StatementHeader";
import SwitchScreens from "./components/SwitchScreens";
import EnableNotifications from "../../components/enableNotifications/EnableNotifications";
import AskPermission from "@/view/components/askPermission/AskPermission";
import FollowMeToast from "./components/followMeToast/FollowMeToast";
import { listenToUserSettings } from "@/controllers/db/users/getUserDB";
import { createSelector } from "@reduxjs/toolkit";

// Create selectors
export const subStatementsSelector = createSelector(
	(state: RootState) => state.statements.statements,
	(_state: RootState, statementId: string | undefined) => statementId,
	(statements, statementId) =>
		statements
			.filter((st) => st.parentId === statementId)
			.sort((a, b) => a.createdAt - b.createdAt)
);

const StatementMain: FC = () => {
	// Hooks
	const { statementId } = useParams();
	const page = useParams().page as Screen;
	const navigate = useNavigate();

	//TODO:create a check with the parent statement if subscribes. if not subscribed... go according to the rules of authorization
	const {
		error,
		isAuthorized,
		loading,
		statementSubscription,
		statement,
		topParentStatement,
		role,
	} = useIsAuthorized(statementId);

	// Redux store
	const dispatch = useAppDispatch();
	const user = useSelector(userSelector);

	const subStatements = useAppSelector((state: RootState) =>
		subStatementsSelector(state, statementId)
	);

	// Use states
	const [talker, setTalker] = useState<User | null>(null);
	const [showAskPermission, setShowAskPermission] = useState<boolean>(false);
	const [askNotifications, setAskNotifications] = useState(false);
	const [isStatementNotFound, setIsStatementNotFound] = useState(false);

	// const [_, setPasswordCheck] = useState<boolean>(false)

	// Constants
	const screen = availableScreen(statement, statementSubscription, page);

	const handleShowTalker = (_talker: User | null) => {
		if (!talker) {
			setTalker(_talker);
		} else {
			setTalker(null);
		}
	};

	//in case the url is of undefined screen, navigate to the first available screen
	useEffect(() => {
		if (screen && screen !== page) {
			navigate(`/statement/${statementId}/${screen}`);
		}
	}, [screen]);

	useEffect(() => {
		if (statement && screen) {
			//set navigator tab title
			const { shortVersion } = statementTitleToDisplay(statement.statement, 15);
			document.title = `FreeDi - ${shortVersion}-${screen}`;
		}
	}, [statement, screen]);

	// Listen to statement changes.
	useEffect(() => {
		let unSubListenToStatement: () => void = () => {
			return;
		};

		let unSubSubStatements: () => void = () => {
			return;
		};
		let unSubStatementSubscription: () => void = () => {
			return;
		};
		let unSubEvaluations: () => void = () => {
			return;
		};

		let unSubUserSettings: () => void = () => {
			return;
		};
		let unSubAllDescendants: () => void = () => {
			return;
		};

		if (user && statementId) {
			unSubListenToStatement = listenToStatement(
				statementId,
				setIsStatementNotFound
			);

			unSubUserSettings = listenToUserSettings();
			unSubAllDescendants = listenToAllDescendants(statementId); //used for map
			unSubEvaluations = listenToEvaluations(dispatch, statementId, user?.uid);
			unSubSubStatements = listenToSubStatements(statementId, dispatch); //TODO: check if this is needed. It can be integrated under listenToAllDescendants

			unSubStatementSubscription = listenToStatementSubscription(
				statementId,
				user,
				dispatch
			);
		}

		return () => {
			unSubListenToStatement();
			unSubUserSettings();
			unSubSubStatements();
			unSubStatementSubscription();
			unSubEvaluations();
			unSubAllDescendants();
		};
	}, [user, statementId]);

	useEffect(() => {
		//listen to top parent statement
		let unSubscribe = () => {
			return;
		};
		if (statement?.topParentId) {
			unSubscribe = listenToStatement(
				statement?.topParentId,
				setIsStatementNotFound
			);
		}

		return () => {
			unSubscribe();
		};
	}, [statement?.topParentId]);

	useEffect(() => {
		if (statement) {
			(async () => {
				const isSubscribed = await getIsSubscribed(statementId);

				// if isSubscribed is false, then subscribe
				if (!isSubscribed && statement.membership?.access === Access.close) {
					// subscribe
					setStatementSubscriptionToDB(statement, Role.member);
				} else {
					//update subscribed field
					updateSubscriberForStatementSubStatements(statement);
				}
			})();
		}
	}, [statement]);

	if (isStatementNotFound) return <Page404 />;
	if (error) return <UnAuthorizedPage />;
	if (loading) return <LoadingPage />;

	if (isAuthorized)
		return (
			<div className="page">
				{showAskPermission && <AskPermission showFn={setShowAskPermission} />}
				{talker && (
					<button
						onClick={() => {
							handleShowTalker(null);
						}}
					>
						<ProfileImage user={talker} />
					</button>
				)}
				{askNotifications && (
					<EnableNotifications
						statement={statement}
						setAskNotifications={setAskNotifications}
						setShowAskPermission={setShowAskPermission}
					/>
				)}

				<StatementHeader
					statement={statement}
					statementSubscription={statementSubscription}
					topParentStatement={topParentStatement}
					screen={screen ?? Screen.CHAT}
					showAskPermission={showAskPermission}
					setShowAskPermission={setShowAskPermission}
					role={role}
				/>
				<MapProvider>
					<FollowMeToast role={role} statement={statement} />

					<SwitchScreens
						screen={screen}
						statement={statement}
						statementSubscription={statementSubscription}
						subStatements={subStatements}
						handleShowTalker={handleShowTalker}
						setShowAskPermission={setShowAskPermission}
					/>
				</MapProvider>
			</div>
		);

	return <UnAuthorizedPage />;
};

export default StatementMain;
