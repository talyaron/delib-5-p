import { FC, useEffect, useState } from "react";

// Third party imports
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { User, Statement, StatementSubscription, Role } from "delib-npm";
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
    setStatmentSubscriptionNotificationToDB,
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
    statementNotificationSelector,
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
import StatementNav from "./components/nav/StatementNav";
import EditTitle from "../../components/edit/EditTitle";
import AskPermisssion from "../../components/askPermission/AskPermisssion";
import SwitchScreens from "./components/SwitchScreens";

//icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShareIcon from "../../icons/ShareIcon";
import ArrowBackIosIcon from "../../icons/ArrowBackIosIcon";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

// Helpers
import { getUserPermissionToNotifications } from "../../../functions/notifications";
import useDirection from "../../../functions/hooks/useDirection";

let unsub: Function = () => {};
let unsubSubStatements: Function = () => {};
let unsubStatementSubscription: Function = () => {};
let unsubEvaluations: Function = () => {};

const Statement: FC = () => {
    // Hooks
    const { statementId, page } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const direction = useDirection();

    // Redux hooks
    const dispatch: any = useAppDispatch();
    const statement = useAppSelector(statementSelector(statementId));
    const subStatements = useSelector(statementSubsSelector(statementId));
    const hasNotifications = useAppSelector(
        statementNotificationSelector(statementId)
    );
    // const user = store.getState().user.user
    const user = useSelector(userSelector);

    // Use state
    const [talker, setTalker] = useState<User | null>(null);
    const [title, setTitle] = useState<string>(t("Group"));
    const [showAskPermission, setShowAskPermission] = useState<boolean>(false);
    const [editHeader, setEditHeader] = useState<boolean>(false);

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

    function handleShare() {
        const baseUrl = window.location.origin;

        const shareData = {
            title: t("Delib: We create agreements together"),
            text: t("Invited:") + statement?.statement,
            url: `${baseUrl}${pathname}`,
        };
        navigator.share(shareData);
    }

    async function handleRegisterToNotifications() {
        const isPermited = await getUserPermissionToNotifications();

        if (!isPermited) {
            setShowAskPermission(true);
            return;
        }
        setStatmentSubscriptionNotificationToDB(statement);
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
            setTitle(_title);
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

    function handleBack() {
        if (statement?.parentId === "top") {
            navigate("/home", {
                state: { from: window.location.pathname },
            });
        } else {
            navigate(`/statement/${statement?.parentId}/${page}`, {
                state: { from: window.location.pathname },
            });
        }
    }

    const hasNotificationPermission = (() => {
        if (window.hasOwnProperty("Notification") === false) return false;
        if (Notification.permission === "denied") return false;
        if (Notification.permission === "granted") return true;
        return false;
    })();

    const isAdmin = statement?.creatorId === user?.uid;

    function handleEditTitle() {
        if (isAdmin) {
            setEditHeader(true);
        }
    }

    return (
        <ScreenFadeInOut>
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
                <div className="page__header">
                    <div
                        className="page__header__wrapper"
                        style={{ flexDirection: direction }}
                    >
                        <div onClick={handleBack} style={{ cursor: "pointer" }}>
                            <ArrowBackIosIcon />
                        </div>
                        <Link to={"/home"}>
                            <HomeOutlinedIcon />
                        </Link>
                        <div onClick={handleRegisterToNotifications}>
                            {hasNotificationPermission && hasNotifications ? (
                                <NotificationsActiveIcon />
                            ) : (
                                <NotificationsOffIcon htmlColor="lightgray" />
                            )}
                        </div>
                        {!editHeader ? (
                            <h1
                                className={isAdmin ? "clickable" : ""}
                                onClick={handleEditTitle}
                            >
                                {title}
                            </h1>
                        ) : (
                            <EditTitle
                                statement={statement}
                                setEdit={setEditHeader}
                            />
                        )}
                        <div onClick={handleShare}>
                            <ShareIcon />
                        </div>
                    </div>
                    {statement && <StatementNav statement={statement} />}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                    <SwitchScreens
                        key={statementId}
                        screen={page}
                        statement={statement}
                        subStatements={subStatements}
                        handleShowTalker={handleShowTalker}
                    />
                </AnimatePresence>
            </div>
        </ScreenFadeInOut>
    );
};

export default Statement;
