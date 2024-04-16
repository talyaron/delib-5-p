import { FC, useEffect, useState } from "react";
import { createSelector } from "reselect";

// Third party imports
import { useNavigate, useParams } from "react-router-dom";
import { User, Role, Screen } from "delib-npm";

// firestore
import { getIsSubscribed } from "../../../functions/db/subscriptions/getSubscriptions";
import { listenToSubStatements } from "../../../functions/db/statements/listenToStatements";
import { listenToStatement } from "../../../functions/db/statements/listenToStatements";
import { listenToStatementSubSubscriptions } from "../../../functions/db/subscriptions/getSubscriptions";
import { listenToStatementSubscription } from "../../../functions/db/statements/listenToStatements";
import { updateSubscriberForStatementSubStatements } from "../../../functions/db/subscriptions/setSubscriptions";
import { setStatmentSubscriptionToDB } from "../../../functions/db/subscriptions/setSubscriptions";
import { listenToEvaluations } from "../../../functions/db/evaluation/getEvaluation";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import { statementNotificationSelector } from "../../../model/statements/statementsSlice";
import { RootState } from "../../../model/store";
import { userSelector } from "../../../model/users/userSlice";
import { useSelector } from "react-redux";

// Custom components
import ProfileImage from "../../components/profileImage/ProfileImage";
import StatementHeader from "./components/header/StatementHeader";
import AskPermisssion from "../../components/askPermission/AskPermisssion";
import SwitchScreens from "./components/SwitchScreens";
import EnableNotifications from "../../components/enableNotifications/EnableNotifications";

// Hooks & Helpers
import { MapProvider } from "../../../functions/hooks/useMap";
import { statementTitleToDisplay } from "../../../functions/general/helpers";
import { availableScreen } from "./StatementCont";
import { useIsAuthorized } from "../../../functions/hooks/authHooks";
import LoadingPage from "../loadingPage/LoadingPage";
import UnAuthorizedPage from "../unAuthorizedPage/UnAuthorizedPage";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import Page404 from "../page404/Page404";
import FollowMeToast from "./components/followMeToast/FollowMeToast";

const StatementMain: FC = () => {
    // Hooks
    const { statementId } = useParams();
    const page = useParams().page as Screen;
    const navigate = useNavigate();
    const { t } = useLanguage();
    //TODO:create a check with the parent statement if subscribes. if not subscribed... go accoring to the rules of authorization
    const {
        error,
        isAuthorized,
        loading,
        statementSubscription,
        statement,
        role,
    } = useIsAuthorized(statementId);

    // Redux store
    const dispatch = useAppDispatch();
    const user = useSelector(userSelector);
    const hasNotifications = useAppSelector(
        statementNotificationSelector(statementId),
    );

    // Create selectors
    const subStatementsSelector = createSelector(
        (state: RootState) => state.statements.statements,
        (_state: RootState, statementId: string | undefined) => statementId,
        (statements, statementId) =>
            statements
                .filter((st) => st.parentId === statementId)
                .sort((a, b) => a.createdAt - b.createdAt),
    );

    const subStatements = useAppSelector((state: RootState) =>
        subStatementsSelector(state, statementId),
    );

    // Use states
    const [talker, setTalker] = useState<User | null>(null);
    const [title, setTitle] = useState<string>(t("Group"));
    const [showAskPermission, setShowAskPermission] = useState<boolean>(false);
    const [askNotifications, setAskNotifications] = useState(false);
    const [isStatementNotFound, setIsStatementNotFound] = useState(false);

    // Constants
    const screen = availableScreen(statement, page);

    // Functions
    const toggleAskNotifications = () => {
        // Ask for notifications after user interaction.
        if (
            !hasNotifications &&
            !statementSubscription?.userAskedForNotification
        ) {
            setAskNotifications(true);
        }
    };

    const handleShowTalker = (_talker: User | null) => {
        if (!talker) {
            setTalker(_talker);
        } else {
            setTalker(null);
        }
    };

    //in case the url is of undefined screen, navigate to the first avilable screen
    useEffect(() => {
        if (screen && screen !== page) {
            navigate(`/statement/${statementId}/${screen}`);
        }
    }, [screen]);

    // Listen to statement changes.
    useEffect(() => {
        let unsubListenToStatement: () => void = () => {
            return;
        };
        let unsubSubStatements: () => void = () => {
            return;
        };
        let unsubStatementSubscription: () => void = () => {
            return;
        };
        let unsubEvaluations: () => void = () => {
            return;
        };
        let unsubSubSubscribedStatements: () => void = () => {
            return;
        };

        if (user && statementId) {
            unsubListenToStatement = listenToStatement(
                statementId,
                dispatch,
                setIsStatementNotFound,
            );
            unsubSubStatements = listenToSubStatements(statementId, dispatch);
            unsubEvaluations = listenToEvaluations(
                dispatch,
                statementId,
                user?.uid,
            );
            unsubSubSubscribedStatements = listenToStatementSubSubscriptions(
                statementId,
                user,
                dispatch,
            );
            unsubStatementSubscription = listenToStatementSubscription(
                statementId,
                user,
                dispatch,
            );
        }

        return () => {
            unsubListenToStatement();
            unsubSubStatements();
            unsubStatementSubscription();
            unsubSubSubscribedStatements();
            unsubEvaluations();
        };
    }, [user, statementId]);

    useEffect(() => {
        if (statement) {
            const { shortVersion } = statementTitleToDisplay(
                statement.statement,
                100,
            );

            setTitle(shortVersion);
            //set navigator tab title

            document.title = `Consoul - ${shortVersion}`;

            (async () => {
                const isSubscribed = await getIsSubscribed(statementId);

                // if isSubscribed is false, then subscribe
                if (!isSubscribed) {
                    // subscribe
                    setStatmentSubscriptionToDB(statement, Role.member);
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
                {showAskPermission && (
                    <AskPermisssion showFn={setShowAskPermission} />
                )}
                {talker && (
                    <div
                        onClick={() => {
                            handleShowTalker(null);
                        }}
                    >
                        <ProfileImage user={talker} />
                    </div>
                )}
                {askNotifications && (
                    <EnableNotifications
                        statement={statement}
                        setAskNotifications={setAskNotifications}
                        setShowAskPermission={setShowAskPermission}
                    />
                )}

                <>
                    <StatementHeader
                        statement={statement}
                        screen={screen || Screen.CHAT}
                        title={title}
                        showAskPermission={showAskPermission}
                        setShowAskPermission={setShowAskPermission}
                        role={role}
                    />

                    <MapProvider>
                        <div style={{"position": 'relative'}}>
                            <FollowMeToast role={role} statement={statement}/>
                            <SwitchScreens
                                screen={screen}
                                statement={statement}
                                subStatements={subStatements}
                                handleShowTalker={handleShowTalker}
                                setShowAskPermission={setShowAskPermission}
                                toggleAskNotifications={toggleAskNotifications}
                            />
                        </div>
                    </MapProvider>
                </>
            </div>
        );

    return <UnAuthorizedPage />;
};

export default StatementMain;
