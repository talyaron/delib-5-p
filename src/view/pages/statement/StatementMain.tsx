import { FC, useEffect, useState } from "react";
import { createSelector } from "reselect";

// Third party imports
import { useNavigate, useParams } from "react-router-dom";
import { User, Role, Screen, StatementSubscription } from "delib-npm";

// firestore
import { getIsSubscribed } from "../../../functions/db/statements/getStatement";
import { listenToSubStatements } from "../../../functions/db/statements/listenToStatements";
import { listenToStatement } from "../../../functions/db/statements/listenToStatements";

import { updateSubscriberForStatementSubStatements } from "../../../functions/db/subscriptions/setSubscriptions";
import { setStatmentSubscriptionToDB } from "../../../functions/db/subscriptions/setSubscriptions";
import { listenToEvaluations } from "../../../functions/db/evaluation/getEvaluation";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import {
    setStatementSubscription,
    statementNotificationSelector,
    statementSelector,
    statementSubscriptionSelector,
} from "../../../model/statements/statementsSlice";
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
import { isAuthorized, statementTitleToDisplay } from "../../../functions/general/helpers";
import { availableScreen } from "./StatementCont";
import { useIsAuthorized } from "../../../functions/hooks/authHooks";
import LoadingPage from "../loadingPage/LoadingPage";
import UnAuthorizedPage from "../unAuthorizedPage/UnAuthorizedPage";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import {
    listenToStatementSubSubscriptions,
    listenToStatementSubscription,
} from "../../../functions/db/subscriptions/getSubscriptions";


const StatementMain: FC = () => {
    // Hooks
    const { statementId } = useParams();
    const page = useParams().page as Screen;
    const navigate = useNavigate();
    const { languageData } = useLanguage();

    // Redux store
    const dispatch = useAppDispatch();
    const user = useSelector(userSelector);
    const hasNotifications = useAppSelector(
        statementNotificationSelector(statementId),
    );
    const statement = useAppSelector(statementSelector(statementId));
    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statementId),
    );
    const topParentSubscription = useAppSelector(
        statementSubscriptionSelector(statement?.topParentId),
    );

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
   
   const _isAuthorized = isAuthorized(statement, topParentSubscription);
    // const loading = false;
    // const error = false;
    // const isAuthorized = true;

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
    const [title, setTitle] = useState<string>(languageData["Group"]);
    const [showAskPermission, setShowAskPermission] = useState<boolean>(false);
    const [askNotifications, setAskNotifications] = useState(false);

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

    function handleRedirectToErrorMessage() {
        navigate("/error-statement");
    }

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
                handleRedirectToErrorMessage,
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
        try {
            let unsub = () => {};
            if (statement) {
                if (!statement.topParentId) throw new Error("No top parent id");

                unsub = listenToStatementSubscription(
                    statement.topParentId,
                    dispatch,
                );
            }
            return () => {
                unsub();
            };
        } catch (error) {
            console.error(error);
        }
    }, [statement]);

    useEffect(() => {
        if (statement) {
            const { shortVersion } = statementTitleToDisplay(
                statement.statement,
                100,
            );

            setTitle(shortVersion);
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

    useEffect(() => {
        if(_isAuthorized){
            setLoading(false);
        }
    },[_isAuthorized]);

    if (loading) return <LoadingPage />;
    if (error) return <UnAuthorizedPage />;
    if (_isAuthorized)
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
                    />

                    <MapProvider>
                        <SwitchScreens
                            screen={screen}
                            statement={statement}
                            subStatements={subStatements}
                            handleShowTalker={handleShowTalker}
                            setShowAskPermission={setShowAskPermission}
                            toggleAskNotifications={toggleAskNotifications}
                        />
                    </MapProvider>
                </>
            </div>
        );

    return <UnAuthorizedPage />;
};

export default StatementMain;
