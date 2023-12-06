import { FC, useEffect, useState } from "react";

// Third party imports
import { useParams } from "react-router-dom";
import {
    User,
    Statement,
    StatementSubscription,
    Role
} from "delib-npm";
import { AnimatePresence } from "framer-motion";
import { t } from "i18next";

// firestore
import {
    getIsSubscribed,
    listenToStatement,
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
    setStatement,
    setStatementSubscription,
    statementSelector,
    statementSubsSelector,
} from "../../../model/statements/statementsSlice";

// Custom components
import ScreenFadeInOut from "../../components/animation/ScreenFadeInOut";
import ProfileImage from "../../components/profileImage/ProfileImage";

// Models
import { Evaluation } from "../../../model/evaluations/evaluationModel";
import { setEvaluationToStore } from "../../../model/evaluations/evaluationsSlice";
import { userSelector } from "../../../model/users/userSlice";
import { useSelector } from "react-redux";

// Statement components
import AskPermisssion from "../../components/askPermission/AskPermisssion";
import SwitchScreens from "./components/SwitchScreens";

// Helpers

import useDirection from "../../../functions/hooks/useDirection";
import StatementHeader from "./StatementHeader";

let unsub: Function = () => {};
let unsubSubStatements: Function = () => {};
let unsubStatementSubscription: Function = () => {};
let unsubEvaluations: Function = () => {};

const Statement: FC = () => {
    // Hooks
    const { statementId, page } = useParams();

    const direction = useDirection();
    const langDirection = direction === "row" ? "ltr" : "rtl";

    // Redux hooks
    const dispatch: any = useAppDispatch();
    const statement = useAppSelector(statementSelector(statementId));
    const subStatements = useSelector(statementSubsSelector(statementId));

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
        if (statementId && user) {
            unsub = listenToStatement(statementId, updateStoreStatementCB);
        }

        return () => {
            unsub();
        };
    }, [statementId, user]);

    useEffect(() => {
        if (user && statementId) {
            unsubSubStatements = listenToStatementsOfStatment(
                statementId,
                updateStoreStatementCB,
                deleteStatementCB
            );
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
            unsubEvaluations();
        };
    }, [user, statementId]);

    useEffect(() => {}, [statementId]);

    useEffect(() => {
        if (statement) {
            const __title =
                statement.statement.split("\n")[0] || statement.statement;
            const _title = __title.replace("*", "");

            const titleToSet =
                _title.length > 100 ? _title.substring(0, 97) + "..." : _title;

            setTitle(titleToSet);
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
                    title={title}
                    direction={direction}
                    langDirection={langDirection}
                    showAskPermission={showAskPermission}
                    setShowAskPermission={setShowAskPermission}
                />
            ) : null}
            <AnimatePresence mode="wait" initial={false}>
                <SwitchScreens
                    key={statementId}
                    screen={page}
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            </AnimatePresence>
        </ScreenFadeInOut>
    );
};

export default Statement;
