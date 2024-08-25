import React, { FC, useState } from "react";

// Third party imports
import {
  Role,
  Screen,
  Statement,
  StatementSubscription,
  StatementType,
} from "delib-npm";
import { useLocation } from "react-router-dom";

// Helpers
import toggleNotifications from "@/controllers/db/notifications/notificationsHelpers";

// Redux Store
import { store } from "@/model/store";

// Custom components
import StatementTopNav from "../nav/top/StatementTopNav";
import EditTitle from "@/view/components/edit/EditTitle";
import BellSlashIcon from "@/assets/icons/bellSlashIcon.svg?react";
import BellIcon from "@/assets/icons/bellIcon.svg?react";
import FollowMe from "@/assets/icons/follow.svg?react";
import ShareIcon from "@/assets/icons/shareIcon.svg?react";
import {
  calculateFontSize,
  getTitle,
  handleLogout,
} from "@/controllers/general/helpers";
import DisconnectIcon from "@/assets/icons/disconnectIcon.svg?react";

// Hooks
import useStatementColor from "@/controllers/hooks/useStatementColor";
import useNotificationPermission from "@/controllers/hooks/useNotificationPermission";
import useToken from "@/controllers/hooks/useToken";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { setFollowMeDB } from "@/controllers/db/statements/setStatements";
import Menu from "@/view/components/menu/Menu";
import MenuOption from "@/view/components/menu/MenuOption";
import { useDispatch } from "react-redux";
import Back from "./Back";
import HomeButton from "./HomeButton";
import InvitePanel from "./invitePanel/InvitePanel";

// icons
import InvitationIcon from "@/assets/icons/invitation.svg?react";

interface Props {
  screen: Screen;
  statement: Statement | undefined;
  statementSubscription: StatementSubscription | undefined;
  topParentStatement: Statement | undefined;
  role: Role | undefined;
  showAskPermission: boolean;
  setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementHeader: FC<Props> = ({
  screen,
  statement,
  statementSubscription,
  topParentStatement,
  setShowAskPermission,
  role,
}) => {
  // Hooks
  const { pathname } = useLocation();
  const title = getTitle(statement);

  const token = useToken();
  const headerColor = useStatementColor(
    statement?.statementType || StatementType.statement
  );
  const permission = useNotificationPermission(token);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const dispatch = useDispatch();
  const { t, dir } = useLanguage();
  const parentStatement = store
    .getState()
    .statements.statements.find((st) => st.statementId === statement?.parentId);

  // Redux Store
  const user = store.getState().user.user;
  const isAdmin = statement?.creatorId === user?.uid || role === Role.admin;

  // Use States
  const [editHeader, setEditHeader] = useState<boolean>(false);

  // Variables
  const titleFontSize = calculateFontSize(title, 16, 25);

  // Checks if enableNavigationalElements is allowed
  console.log(
    "statement?.statementSettings?.enableNavigationalElements",
    statement?.statementSettings?.enableNavigationalElements
  );
  const enableNavigationalElements =
    statement?.statementSettings?.enableNavigationalElements !== undefined
      ? statement?.statementSettings?.enableNavigationalElements
      : true;

  function handleShare() {
    const baseUrl = window.location.origin;

    const shareData = {
      title: t("Delib: We create agreements together"),
      text: t("Invited:") + statement?.statement,
      url: `${baseUrl}${pathname}`,
    };
    navigator.share(shareData);
  }
  function handleEditTitle(): void {
    if (statementSubscription?.role === Role.admin) {
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

  function handleInvitePanel() {
    try {
      setShowInvitationModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  const menuIconStyle = {
    color: headerColor.backgroundColor,
    width: "24px",
  };
  console.log("enableNavigationalElements", enableNavigationalElements);
  console.log("isAdmin", isAdmin);

  return (
    <div
      className={`page__header ${dir}`}
      style={{ ...headerColor, direction: dir }}
    >
      <div className="page__header__wrapper">
        {(enableNavigationalElements || isAdmin) && (
          <div className="page__header__wrapper__actions">
            <Back
              parentStatement={parentStatement}
              statement={statement}
              headerColor={headerColor}
            />
            <HomeButton headerColor={headerColor} />
          </div>
        )}

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
            onlyTitle={true}
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
                t
              )
            }
          />
          <MenuOption
            label={t("Disconnect")}
            icon={<DisconnectIcon style={menuIconStyle} />}
            onOptionClick={() => handleLogout(dispatch)}
          />
          {isAdmin && (
            <>
              <MenuOption
                label={t("Follow Me")}
                icon={<FollowMe style={menuIconStyle} />}
                onOptionClick={handleFollowMe}
              />
              <MenuOption
                label={t("Invite with PIN number")}
                icon={<InvitationIcon style={menuIconStyle} />}
                onOptionClick={handleInvitePanel}
              />
            </>
          )}
        </Menu>
      </div>
      {statement && (
        <StatementTopNav
          statement={statement}
          screen={screen}
          statementSubscription={statementSubscription}
        />
      )}
      {showInvitationModal && (
        <InvitePanel
          setShowModal={setShowInvitationModal}
          statementId={statement?.statementId}
          pathname={pathname}
        />
      )}
    </div>
  );
};

export default StatementHeader;
