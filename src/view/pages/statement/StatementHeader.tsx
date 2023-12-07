import { FC, useState } from "react";
import { Statement, StatementType } from "delib-npm";
import { t } from "i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { store } from "../../../model/store";
import { getUserPermissionToNotifications } from "../../../functions/notifications";

//icons
import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "../../icons/ShareIcon";
import ArrowBackIosIcon from "../../icons/ArrowBackIosIcon";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { setStatmentSubscriptionNotificationToDB } from "../../../functions/db/statements/setStatments";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { statementNotificationSelector } from "../../../model/statements/statementsSlice";
import StatementNav from "./components/nav/StatementNav";
import EditTitle from "../../components/edit/EditTitle";

interface Props {
    title: string;
    statement: Statement;
    direction: "row" | "row-reverse";
    langDirection: "ltr" | "rtl";
    showAskPermission: boolean;
    setShowAskPermission: Function;
}

const StatementHeader: FC<Props> = ({
    title,
    statement,
    direction,
    langDirection,
    setShowAskPermission,
}) => {
    const user = store.getState().user.user;
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { statementId, page } = useParams();
    const location = useLocation();

    const hasNotifications = useAppSelector(
        statementNotificationSelector(statementId)
    );

    const [editHeader, setEditHeader] = useState<boolean>(false);

    const titleStyle = {
        fontSize:
            title.length > 30 ? "1.3rem" : title.length > 40 ? "1rem" : "2rem",
    };

    const isAdmin = statement?.creatorId === user?.uid;

    function handleShare() {
        const baseUrl = window.location.origin;

        const shareData = {
            title: t("Delib: We create agreements together"),
            text: t("Invited:") + statement?.statement,
            url: `${baseUrl}${pathname}`,
        };
        navigator.share(shareData);
    }
    function handleEditTitle() {
        if (isAdmin) {
            setEditHeader(true);
        }
    }

    const hasNotificationPermission = (() => {
        if (window.hasOwnProperty("Notification") === false) return false;
        if (Notification.permission === "denied") return false;
        if (Notification.permission === "granted") return true;
        return false;
    })();

    function handleBack() {
        if (location.state && location.state.from.includes("map")) {
            return navigate(location.state.from, {
                state: { from: window.location.pathname },
            });
        }
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

    async function handleRegisterToNotifications() {
        const isPermited = await getUserPermissionToNotifications();

        if (!isPermited) {
            setShowAskPermission(true);
            return;
        }
        setStatmentSubscriptionNotificationToDB(statement);
    }

    return (
        <div
            className={
                statement?.statementType === StatementType.question
                    ? "page__header page__header--question"
                    : "page__header"
            }
        >
            <div
                className="page__header__wrapper"
                style={{ flexDirection: direction, direction: langDirection }}
            >
                <div onClick={handleBack} style={{ cursor: "pointer" }}>
                    <ArrowBackIosIcon />
                </div>
                <Link state={{ from: window.location.pathname }} to={"/home"}>
                    <HomeIcon />
                </Link>
                <div onClick={handleRegisterToNotifications}>
                    {hasNotificationPermission && hasNotifications ? (
                        <NotificationsActiveIcon />
                    ) : (
                        <NotificationsOffIcon />
                    )}
                </div>
                {!editHeader ? (
                    <h1
                        className={isAdmin ? "clickable" : ""}
                        onClick={handleEditTitle}
                        style={titleStyle}
                    >
                        {title}
                    </h1>
                ) : (
                    <EditTitle
                        isEdit={editHeader}
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
    );
};

export default StatementHeader;
