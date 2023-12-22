import { FC, useState } from "react";

// Third party imports
import { Screen, Statement, StatementType } from "delib-npm";
import { t } from "i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// Helpers
import { getUserPermissionToNotifications } from "../../../functions/notifications";

//icons
import { IoMdHome } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdShare } from "react-icons/io";
import { IoMdNotificationsOff } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";

// Statement helpers
import { setStatmentSubscriptionNotificationToDB } from "../../../functions/db/statements/setStatments";

// Redux Store
import { store } from "../../../model/store";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { statementNotificationSelector } from "../../../model/statements/statementsSlice";

// Custom components
import StatementNav from "./components/nav/StatementNav";
import EditTitle from "../../components/edit/EditTitle";

interface Props {
    title: string;
    screen: Screen;
    statement: Statement;
    direction: "row" | "row-reverse";
    langDirection: "ltr" | "rtl";
    showAskPermission: boolean;
    setShowAskPermission: Function;
}

const StatementHeader: FC<Props> = ({
    title,
    screen,
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
        maxWidth: "70%",
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
        if (location.state && location.state.from.includes("doc")) {
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
                    <IoIosArrowBack size="1.5rem" />
                </div>
                <Link state={{ from: window.location.pathname }} to={"/home"}>
                    <IoMdHome size="1.5rem" />
                </Link>
                <div onClick={handleRegisterToNotifications}>
                    {hasNotificationPermission && hasNotifications ? (
                        <IoMdNotifications size="1.5rem" />
                    ) : (
                        <IoMdNotificationsOff size="1.5rem" />
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
                    <IoMdShare size="1.5rem" />
                </div>
            </div>
            {statement && (
                <StatementNav statement={statement} screen={screen} />
            )}
        </div>
    );
};

export default StatementHeader;
