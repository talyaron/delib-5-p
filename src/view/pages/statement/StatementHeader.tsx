import { FC, useState } from "react";

// Third party imports
import { Screen, Statement } from "delib-npm";
import { t } from "i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// Helpers
import { getUserPermissionToNotifications } from "../../../functions/notifications";

// Statement helpers
import { setStatmentSubscriptionNotificationToDB } from "../../../functions/notifications";

// Redux Store
import { store } from "../../../model/store";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { statementNotificationSelector } from "../../../model/statements/statementsSlice";

// Custom components
import StatementTopNav from "./components/nav/top/StatementTopNav";
import EditTitle from "../../components/edit/EditTitle";
import BackArrowIcon from "../../components/icons/BackArrowIcon";
import HomeIcon from "../../components/icons/HomeIcon";
import BellSlashIcon from "../../components/icons/BellSlashIcon";
import BellIcon from "../../components/icons/BellIcon";
import ShareIcon from "../../components/icons/ShareIcon";
import {
    calculateFontSize,
    handleLogout,
} from "../../../functions/general/helpers";
import useStatementColor from "../../../functions/hooks/useStatementColor";
import DisconnectIcon from "../../components/icons/DisconnectIcon";
import PopUpMenu from "../../components/popUpMenu/PopUpMenu";
import useDirection from "../../../functions/hooks/useDirection";

interface Props {
    title: string;
    screen: Screen;
    statement: Statement;
    showAskPermission: boolean;
    setShowAskPermission: Function;
}

const StatementHeader: FC<Props> = ({
    title,
    screen,
    statement,
    setShowAskPermission,
}) => {
    const user = store.getState().user.user;
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { statementId, page } = useParams();
    const location = useLocation();
    const direction = useDirection();

    const headerColor = useStatementColor(statement.statementType || "");

    const hasNotifications = useAppSelector(
        statementNotificationSelector(statementId)
    );

    const [editHeader, setEditHeader] = useState<boolean>(false);

    const titleFontSize = calculateFontSize(title, 16, 25);

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

    async function toggleNotifications() {
        const isPermited = await getUserPermissionToNotifications();

        if (!isPermited) {
            setShowAskPermission(true);
            return;
        }
        setStatmentSubscriptionNotificationToDB(statement);
    }

    return (
        <div className="page__header" style={headerColor}>
            <div
                className="page__header__wrapper"
                style={{ flexDirection: direction }}
            >
                <div
                    className="page__header__wrapper__actions"
                    style={{ flexDirection: direction }}
                >
                    <div onClick={handleBack} style={{ cursor: "pointer" }}>
                        <BackArrowIcon color={headerColor.color} />
                    </div>
                    <Link
                        state={{ from: window.location.pathname }}
                        to={"/home"}
                    >
                        <HomeIcon color={headerColor.color} />
                    </Link>
                </div>
                {!editHeader ? (
                    <h1
                        className={isAdmin ? "clickable" : ""}
                        onClick={handleEditTitle}
                        style={{ fontSize: titleFontSize, padding: "0 2rem" }}
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
                <PopUpMenu
                    openMoreIconColor={headerColor.color}
                    firstIcon={
                        <ShareIcon color={headerColor.backgroundColor} />
                    }
                    firstIconFunc={handleShare}
                    firstIconText={"Share"}
                    secondIcon={
                        hasNotificationPermission && hasNotifications ? (
                            <BellIcon color={headerColor.backgroundColor} />
                        ) : (
                            <BellSlashIcon
                                color={headerColor.backgroundColor}
                            />
                        )
                    }
                    secondIconFunc={toggleNotifications}
                    secondIconText={"Notifications"}
                    thirdIcon={
                        <DisconnectIcon color={headerColor.backgroundColor} />
                    }
                    thirdIconFunc={handleLogout}
                    thirdIconText={"Disconnect"}
                />
            </div>
            {statement && (
                <StatementTopNav statement={statement} screen={screen} />
            )}
        </div>
    );
};

export default StatementHeader;
