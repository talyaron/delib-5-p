import React, { FC, useState } from "react";

// Third party imports
import { Screen, Statement } from "delib-npm";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// Helpers
import toggleNotifications from "../../../../../functions/db/notifications/notificationsHelpers";

// Redux Store
import { store } from "../../../../../model/store";

// Custom components
import StatementTopNav from "../nav/top/StatementTopNav";
import EditTitle from "../../../../components/edit/EditTitle";
import BackArrowIcon from "../../../../components/icons/BackArrowIcon";
import HomeIcon from "../../../../components/icons/HomeIcon";
import BellSlashIcon from "../../../../components/icons/BellSlashIcon";
import BellIcon from "../../../../components/icons/BellIcon";
import ShareIcon from "../../../../components/icons/ShareIcon";
import {
    calculateFontSize,
    handleLogout,
} from "../../../../../functions/general/helpers";
import DisconnectIcon from "../../../../components/icons/DisconnectIcon";
import PopUpMenu from "../../../../components/popUpMenu/PopUpMenu";

// Hooks
import useStatementColor from "../../../../../functions/hooks/useStatementColor";
import useDirection from "../../../../../functions/hooks/useDirection";
import useNotificationPermission from "../../../../../functions/hooks/useNotificationPermission";
import useToken from "../../../../../functions/hooks/useToken";

interface Props {
    title: string;
    screen: Screen;
    statement: Statement |undefined;
    showAskPermission: boolean;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
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
    const { page } = useParams();
    const location = useLocation();
    const direction = useDirection();
    const token = useToken();

    const headerColor = useStatementColor(statement?.statementType || "");

    const permission = useNotificationPermission(token);

    const [editHeader, setEditHeader] = useState<boolean>(false);

    const titleFontSize = calculateFontSize(title, 16, 25);

    const isAdmin = statement?.creatorId === user?.uid;

    function handleShare() {
        const baseUrl = window.location.origin;

        const shareData = {
            title: ("Delib: We create agreements together"),
            text: ("Invited:") + statement?.statement,
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
                        permission ? (
                            <BellIcon color={headerColor.backgroundColor} />
                        ) : (
                            <BellSlashIcon
                                color={headerColor.backgroundColor}
                            />
                        )
                    }
                    secondIconFunc={() =>
                        toggleNotifications(
                            statement,
                            permission,
                            setShowAskPermission,
                        )
                    }
                    secondIconText={permission ? "Turn off" : "Turn on"}
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
