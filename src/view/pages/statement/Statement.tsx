import { FC, useEffect, useState } from "react";

// Third party imports
import { useParams } from "react-router-dom";
import { User, Statement, StatementSubscription, Role, Screen } from "delib-npm";
import { AnimatePresence } from "framer-motion";
import { t } from "i18next";

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
    statementSubsSelector,
} from "../../../model/statements/statementsSlice";

import { userSelector } from "../../../model/users/userSlice";
import { useSelector } from "react-redux";

// Custom components
import ScreenFadeInOut from "../../components/animation/ScreenFadeInOut";
import ProfileImage from "../../components/profileImage/ProfileImage";
import StatementHeader from "./StatementHeader";
import AskPermisssion from "../../components/askPermission/AskPermisssion";
import SwitchScreens from "./components/SwitchScreens";

// Models
import { Evaluation } from "../../../model/evaluations/evaluationModel";
import { setEvaluationToStore } from "../../../model/evaluations/evaluationsSlice";

// Helpers

// Hooks & Providers
import useDirection from "../../../functions/hooks/useDirection";
import { MapModelProvider } from "../../../functions/hooks/useMap";
import { statementTitleToDisplay } from "../../../functions/general/helpers";
import { availableScreen } from "./StatementCont";

const Statement: FC = () => {
    // Hooks
    const statementId = useParams().statementId;
    const page = useParams().page as Screen;
    

    const direction = useDirection();
    const langDirection = direction === "row" ? "ltr" : "rtl";

    // Redux hooks
    const dispatch: any = useAppDispatch();
    const statement = useAppSelector(statementSelector(statementId));
    const subStatements = useSelector(statementSubsSelector(statementId));
    const screen = availableScreen(statement,page)

    // const user = store.getState().user.user
    const user = useSelector(userSelector);

    // Use state
    const [talker, setTalker] = useState<User | null>(null);
    const [title, setTitle] = useState<string>(t("Group"));
    const [showAskPermission, setShowAskPermission] = useState<boolean>(false);

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
        statementSubscription: StatementSubscription
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

    //listen to statement
    useEffect(() => {
        let unsub: Function = () => {};
        if (statementId && user) {
            unsub = listenToStatement(statementId, updateStoreStatementCB);
        }

        return () => {
            unsub();
        };
    }, [statementId, user]);

    useEffect(() => {
        let unsubSubStatements: Function = () => {};
        let unsubStatementSubscription: Function = () => {};
        let unsubEvaluations: Function = () => {};
        let unsubSubSubscribedStatements: Function = () => {};

        if (user && statementId) {
            unsubSubStatements = listenToStatementsOfStatment(
                statementId,
                updateStoreStatementCB,
                deleteStatementCB
            );
            unsubSubSubscribedStatements = listenToStatementSubSubscriptions(statementId,updateStatementSubscriptionCB, deleteSubscribedStatementCB)
            unsubStatementSubscription = listenToStatementSubscription(
                statementId,
                updateStatementSubscriptionCB
            );
            unsubEvaluations = listenToEvaluations(
                statementId,
                updateEvaluationsCB
            );
        }

        return () => {
            unsubSubStatements();
            unsubStatementSubscription();
            unsubSubSubscribedStatements();
            unsubEvaluations();
        };
    }, [user, statementId]);

    useEffect(() => {}, [statementId]);

    useEffect(() => {
        if (statement) {
            const { shortVersion } = statementTitleToDisplay(
                statement.statement,
                100
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
        <ScreenFadeInOut className="page">
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
                <StatementHeader
                    statement={statement}
                    screen={screen || Screen.CHAT}
                    title={title}
                    direction={direction}
                    langDirection={langDirection}
                    showAskPermission={showAskPermission}
                    setShowAskPermission={setShowAskPermission}
                />
            ) : null}
            <AnimatePresence mode="wait" initial={false}>
                <MapModelProvider>
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
                </MapModelProvider>
            </AnimatePresence>
        </ScreenFadeInOut>
    );
};

export default Statement;
