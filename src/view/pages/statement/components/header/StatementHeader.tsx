import React, { FC, useState } from "react";


// Third party imports
import { Role, Screen, Statement } from "delib-npm";
import { Link, useLocation } from "react-router-dom";

// Helpers
import toggleNotifications from "../../../../../functions/db/notifications/notificationsHelpers";

// Redux Store
import { store } from "../../../../../model/store";

// Custom components
import StatementTopNav from "../nav/top/StatementTopNav";
import EditTitle from "../../../../components/edit/EditTitle";
import HomeIcon from "../../../../../assets/icons/homeIcon.svg?react";
import BellSlashIcon from "../../../../../assets/icons/bellSlashIcon.svg?react";
import BellIcon from "../../../../../assets/icons/bellIcon.svg?react";
import FollowMe from "../../../../../assets/icons/follow.svg?react";
import ShareIcon from "../../../../../assets/icons/shareIcon.svg?react";
import {
    calculateFontSize,
    handleLogout,
} from "../../../../../functions/general/helpers";
import DisconnectIcon from "../../../../../assets/icons/disconnectIcon.svg?react";

// Hooks
import useStatementColor from "../../../../../functions/hooks/useStatementColor";
import useNotificationPermission from "../../../../../functions/hooks/useNotificationPermission";
import useToken from "../../../../../functions/hooks/useToken";
import { useLanguage } from "../../../../../functions/hooks/useLanguages";
import { setFollowMeDB } from "../../../../../functions/db/statements/setStatments";
import Menu from "../../../../components/menu/Menu";
import MenuOption from "../../../../components/menu/MenuOption";
import { useDispatch } from "react-redux";
import Back from "./Back";

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
    setShowAskPermission,
}) => {
    // Hooks
    const { pathname } = useLocation();

    const token = useToken();
    const headerColor = useStatementColor(statement?.statementType || "");
    const permission = useNotificationPermission(token);
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { t, dir } = useLanguage();
    const parentStatement = store
        .getState()
        .statements.statements.find(
            (st) => st.statementId === statement?.parentId,
        );
  

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
        <div className={`page__header ${dir}`} style={headerColor}>
            <div className="page__header__wrapper">
                <div className="page__header__wrapper__actions">
                    <Back parentStatement={parentStatement} statement={statement} headerColor={headerColor} />
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

                <Menu
                    setIsOpen={setIsHeaderMenuOpen}
                    isMenuOpen={isHeaderMenuOpen}
                    iconColor={headerColor.color}
                >
                    <MenuOption
                        label={t("Share")}
                        icon={<ShareIcon style={menuIconStyle} />}
                        onOptionClick={handleShare}
                    />

                    <MenuOption
                        label={t(permission ? "Turn off" : "Turn on")}
                        icon={
                            permission ? (
                                <BellIcon style={menuIconStyle} />
                            ) : (
                                <BellSlashIcon style={menuIconStyle} />
                            )
                        }
                        onOptionClick={() =>
                            toggleNotifications(
                                statement,
                                permission,
                                setShowAskPermission,
                                t,
                            )
                        }
                    />
                    <MenuOption
                        label={t("Disconnect")}
                        icon={<DisconnectIcon style={menuIconStyle} />}
                        onOptionClick={() => handleLogout(dispatch)}
                    />
                    {isAdmin && (
                        <MenuOption
                            label={t("Follow Me")}
                            icon={<FollowMe style={menuIconStyle} />}
                            onOptionClick={handleFollowMe}
                        />
                    )}
                </Menu>
            </div>
            {statement && (
                <StatementTopNav statement={statement} screen={screen} />
            )}
        </div>
    );
};

export default StatementHeader;
