import React, { FC, useState } from "react";

// Third party imports
import { Role, Screen, Statement } from "delib-npm";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// Helpers
import toggleNotifications from "../../../../../functions/db/notifications/notificationsHelpers";

// Redux Store
import { store } from "../../../../../model/store";

// Custom components
import StatementTopNav from "../nav/top/StatementTopNav";
import EditTitle from "../../../../components/edit/EditTitle";
import BackArrowIcon from "../../../../../assets/icons/chevronLeftIcon.svg?react";
import HomeIcon from "../../../../../assets/icons/homeIcon.svg?react";
import BellSlashIcon from "../../../../../assets/icons/bellSlashIcon.svg?react";
import BellIcon from "../../../../../assets/icons/bellIcon.svg?react";
import FollowMe from "../../../../../assets/icons/follow.svg?react";
import ShareIcon from "../../../../../assets/icons/shareIcon.svg?react";
import {
    calculateFontSize,
    checkArrayAndReturnByOrder,
    handleLogout,
} from "../../../../../functions/general/helpers";
import DisconnectIcon from "../../../../../assets/icons/disconnectIcon.svg?react";
import PopUpMenu from "../../../../components/popUpMenu/PopUpMenu";

// Hooks
import useStatementColor from "../../../../../functions/hooks/useStatementColor";
import useDirection from "../../../../../functions/hooks/useDirection";
import useNotificationPermission from "../../../../../functions/hooks/useNotificationPermission";
import useToken from "../../../../../functions/hooks/useToken";
import { useLanguage } from "../../../../../functions/hooks/useLanguages";
import { setFollowMeDB } from "../../../../../functions/db/statements/setStatments";

interface Props {
    title: string;
    screen: Screen;
    statement: Statement | undefined;
    topParentStatement: Statement | undefined;
    role: Role | undefined;
    showAskPermission: boolean;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementHeader: FC<Props> = ({
    title,
    screen,
    statement,
    topParentStatement,
    role,
    setShowAskPermission,
}) => {
    // Hooks
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { page } = useParams();
    const location = useLocation();
    const direction = useDirection();
    const token = useToken();
    const headerColor = useStatementColor(statement?.statementType || "");
    const permission = useNotificationPermission(token);
    const { t } = useLanguage();
    const parentStatement = store
        .getState()
        .statements.statements.find(
            (st) => st.statementId === statement?.parentId,
        );
    const parentStatementScreens = parentStatement?.subScreens || [
        Screen.QUESTIONS,
        Screen.CHAT,
        Screen.HOME,
        Screen.VOTE,
        Screen.OPTIONS,
    ];

    // Redux Store
    const user = store.getState().user.user;

    // Use States
    const [editHeader, setEditHeader] = useState<boolean>(false);

    // Variables
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

    function handleBack() {
        try {
            //in case the back should diret to home
            if (statement?.parentId === "top") {
                return navigate("/home", {
                    state: { from: window.location.pathname },
                });
            }
            //in case the user is at doc or main pagesub screen
            if (location.state && location.state.from.includes("doc")) {
                return navigate(location.state.from, {
                    state: { from: window.location.pathname },
                });
            }

            //if in evaluation or in voting --> go back to question or chat
            if (page === Screen.OPTIONS || page === Screen.VOTE) {
                return navigate(
                    `/statement/${statement?.parentId}/${checkArrayAndReturnByOrder(parentStatementScreens, Screen.QUESTIONS, Screen.CHAT)}`,
                    {
                        state: { from: window.location.pathname },
                    },
                );
            }

            //default case
            return navigate(`/statement/${statement?.parentId}/${page}`, {
                state: { from: window.location.pathname },
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function handleFollowMe() {
        try {
            if (!topParentStatement) throw new Error("No top parent statement");

            await setFollowMeDB(topParentStatement, pathname);
        } catch (error) {
            console.error(error);
        }
    }
    const menuIconStyle = {
        color: headerColor.backgroundColor,
        width: "24px",
    };

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
                    <button
                        className="page__header__wrapper__actions__iconButton"
                        onClick={handleBack}
                        style={{ cursor: "pointer" }}
                        data-cy="back-icon-header"
                    >
                        <BackArrowIcon style={{ color: headerColor.color }} />
                    </button>
                    <Link
                        className="page__header__wrapper__actions__iconButton"
                        state={{ from: window.location.pathname }}
                        to={"/home"}
                        data-cy="home-link-icon"
                    >
                        <HomeIcon style={{ color: headerColor.color }} />
                    </Link>
                </div>
                {!editHeader ? (
                    <h1
                        className={isAdmin ? "clickable" : ""}
                        onClick={handleEditTitle}
                        style={{ fontSize: titleFontSize, padding: "0 2rem" }}
                        data-cy="statement-header-title"
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
                    firstIcon={<ShareIcon style={menuIconStyle} />}
                    firstIconFunc={handleShare}
                    firstIconText={"Share"}
                    secondIcon={
                        permission ? (
                            <BellIcon style={menuIconStyle} />
                        ) : (
                            <BellSlashIcon style={menuIconStyle} />
                        )
                    }
                    secondIconFunc={() =>
                        toggleNotifications(
                            statement,
                            permission,
                            setShowAskPermission,
                            t,
                        )
                    }
                    secondIconText={permission ? "Turn off" : "Turn on"}
                    thirdIcon={<DisconnectIcon style={menuIconStyle} />}
                    thirdIconFunc={handleLogout}
                    thirdIconText={"Disconnect"}
                    fourthIcon={<FollowMe />}
                    fourthIconFunc={handleFollowMe}
                    fourthIconText={"Follow Me"}
                    role={role}
                />
            </div>
            {statement && (
                <StatementTopNav statement={statement} screen={screen} />
            )}
        </div>
    );
};

export default StatementHeader;
