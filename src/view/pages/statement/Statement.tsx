import { FC, useEffect, useState } from "react";
import { createSelector } from "reselect";

// Third party imports
import { useNavigate, useParams } from "react-router-dom";
import {
    User,
    Statement,
    StatementSubscription,
    Role,
    Screen,
} from "delib-npm";

// firestore
import {
    getIsSubscribed,
    listenToStatement,
    listenToStatementSubSubscriptions,
    listenToStatementSubscription,
    listenToStatementsOfStatment,
} from "../../../functions/db/statements/getStatement";
import {
    setStatmentSubscriptionToDB,
    updateSubscriberForStatementSubStatements,
} from "../../../functions/db/statements/setStatments";
import { listenToEvaluations } from "../../../functions/db/evaluation/getEvaluation";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import {
    deleteStatement,
    deleteSubscribedStatement,
    setStatement,
    setStatementSubscription,
    statementSelector,
} from "../../../model/statements/statementsSlice";

import { userSelector } from "../../../model/users/userSlice";
import { useSelector } from "react-redux";

// Custom components
import ProfileImage from "../../components/profileImage/ProfileImage";
import StatementHeader from "./StatementHeader";
import AskPermisssion from "../../components/askPermission/AskPermisssion";
import SwitchScreens from "./components/SwitchScreens";

// Models
import { Evaluation } from "../../../model/evaluations/evaluationModel";
import { setEvaluationToStore } from "../../../model/evaluations/evaluationsSlice";

// Types
import { Unsubscribe } from "@firebase/firestore";

// Hooks & Providers
import { MapProvider } from "../../../functions/hooks/useMap";
import { statementTitleToDisplay } from "../../../functions/general/helpers";
import { availableScreen } from "./StatementCont";
import { RootState } from "../../../model/store";
import { SuspenseFallback } from "../../../router";

const Statement: FC = () => {
    // Hooks
    const { statementId } = useParams();
    const page = useParams().page as Screen;

    const navigate = useNavigate();

    // const user = store.getState().user.user
    const user = useSelector(userSelector);

    // Use state
    const [talker, setTalker] = useState<User | null>(null);
    const [title, setTitle] = useState<string>("Group");
    const [showAskPermission, setShowAskPermission] = useState<boolean>(false);

    // Redux hooks
    const dispatch: any = useAppDispatch();
    const statement = useAppSelector(statementSelector(statementId));

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
    const screen = availableScreen(statement, page);

    //store callbacks
    function updateStoreStatementCB(statement: Statement) {
        try {
            dispatch(setStatement(statement));
        } catch (error) {
            console.error(error);
        }
    }
    function deleteStatementCB(statementId: string) {
        dispatch(deleteStatement(statementId));
    }
    function updateStatementSubscriptionCB(
        statementSubscription: StatementSubscription,
    ) {
        dispatch(setStatementSubscription(statementSubscription));
    }

    function deleteSubscribedStatementCB(statementId: string) {
        dispatch(deleteSubscribedStatement(statementId));
    }

    function updateEvaluationsCB(evaluation: Evaluation) {
        dispatch(setEvaluationToStore(evaluation));
    }

    //handlers
    function handleShowTalker(_talker: User | null) {
        if (!talker) {
            setTalker(_talker);
        } else {
            setTalker(null);
        }
    }

    //use effects

    //in case the url is of undefined screen, navigate to the first avilable screen
    useEffect(() => {
        if (screen && screen !== page) {
            navigate(`/statement/${statementId}/${screen}`);
        }
    }, [screen]);

    //listen to statement
    useEffect(() => {
        let unsub: Unsubscribe | undefined;
        if (statementId && user) {
            unsub = listenToStatement(statementId, updateStoreStatementCB);
        }

        return () => {
            if (unsub) unsub();
        };
    }, [statementId, user]);

    //listne to sub statements
    useEffect(() => {
        let unsubSubStatements: Promise<Unsubscribe | undefined>;
        let unsubStatementSubscription: undefined | (() => void);
        let unsubEvaluations: undefined | (() => void);
        let unsubSubSubscribedStatements: undefined | (() => void);

        if (user && statementId) {
            unsubSubStatements = listenToStatementsOfStatment(
                statementId,
                updateStoreStatementCB,
                deleteStatementCB,
            );
            unsubSubSubscribedStatements = listenToStatementSubSubscriptions(
                statementId,
                updateStatementSubscriptionCB,
                deleteSubscribedStatementCB,
            );
            unsubStatementSubscription = listenToStatementSubscription(
                statementId,
                updateStatementSubscriptionCB,
            );
            unsubEvaluations = listenToEvaluations(
                statementId,
                updateEvaluationsCB,
            );
        }

        return () => {
            const unsub = Promise.all([
                unsubSubStatements,
                unsubStatementSubscription,
                unsubSubSubscribedStatements,
                unsubEvaluations,
            ]);

            unsub
                .then((unsub) => {
                    unsub.forEach((unsub) => {
                        if (unsub) unsub();
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        };
    }, [user, statementId]);

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
                    setStatmentSubscriptionToDB(statement, Role.member, true);
                } else {
                    //update subscribed field
                    updateSubscriberForStatementSubStatements(statement);
                }
            })();
        }
    }, [statement]);

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
            {statement ? (
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
                            key={window.location.pathname
                                .split("/")
                                .slice(2)
                                .join(" ")}
                            screen={screen}
                            statement={statement}
                            subStatements={subStatements}
                            handleShowTalker={handleShowTalker}
                        />
                    </MapProvider>
                </>
            ) : (
                <SuspenseFallback />
            )}
        </div>
    );
};

export default Statement;
