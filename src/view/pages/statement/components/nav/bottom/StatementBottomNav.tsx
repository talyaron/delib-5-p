import React, { FC } from "react";

// Third party libraries
import { Statement, Screen, StatementType } from "delib-npm";
import { Link, useParams } from "react-router-dom";

// Icons
// import LightIcon from "../../../../../../assets/icons/lightBulbIcon.svg?react";
// import NavQuestionIcon from "../../../../../../assets/icons/questionIcon.svg?react";
// import PlusIcon from "../../../../../../assets/icons/plusIcon.svg?react";
import AgreementIcon from "../../../../../../assets/icons/agreementIcon.svg?react";
import RandomIcon from "../../../../../../assets/icons/randomIcon.svg?react";
import UpdateIcon from "../../../../../../assets/icons/updateIcon.svg?react";
import NewestIcon from "../../../../../../assets/icons/newIcon.svg?react";
import useStatementColor from "../../../../../../controllers/hooks/useStatementColor";
import {
  NavItem,
  optionsArray,
  questionsArray,
  votesArray,
} from "./StatementBottomNavModal";
// import IconButton from "../../../../../components/iconButton/IconButton";
import "./StatementBottomNav.scss";
// import NewIconButton from "../../../../../components/iconButton/NewIconButton";
import SortIcon from "../../../../../components/icons/SortIcon";
import useWindowDimensions from "../../../../../../controllers/hooks/useWindowDimentions";

interface Props {
  statement: Statement;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavigationOpen?: (statement: any) => void;
  isNavigationOpen?: boolean;
  showNav?: boolean;
  currentPage?: string;
}

const StatementBottomNav: FC<Props> = ({
  // setShowModal,
  statement,
  setIsNavigationOpen,
  isNavigationOpen,
  currentPage,
}) => {
  const { page } = useParams();
  // const MainIcon = page === Screen.QUESTIONS ? NavQuestionIcon : LightIcon;

  const navItems = getNavigationScreens(page);

  const statementColor = useStatementColor(
    statement.statementType || StatementType.statement
  );

  //used to check if the user can add a new option in voting and in evaluation screens
  const addOption: boolean | undefined =
    statement.statementSettings?.enableAddEvaluationOption;

  const addVotingOption: boolean | undefined =
    statement.statementSettings?.enableAddVotingOption;

  const showAddOptionEvaluation = page === Screen.OPTIONS && addOption;
  const showAddOptionVoting = page === Screen.VOTE && addVotingOption;
  const showAddQuestion = page === Screen.QUESTIONS;
  // const isAddOption =
  showAddOptionEvaluation || showAddOptionVoting || showAddQuestion;
  if (!setIsNavigationOpen) {
    return null;
  }

  const handleMidIconClick = () => {
    if (!isNavigationOpen) return setIsNavigationOpen(true);
    setIsNavigationOpen(false);
  };

  // const navStyle = {
  //   bottom: page === "vote" ? "unset" : "3rem",
  //   height: page === "vote" ? "4rem" : "unset",
  // };

  const { width } = useWindowDimensions();
  const smallScreen = width < 1024;

  return (
    <>
      {isNavigationOpen && (
        <div
          className="invisibleBackground"
          onClick={() => setIsNavigationOpen(false)}
        />
      )}
      <div className="statement-bottom-nav">
        {/* <IconButton
          className="open-nav-icon burger"
          style={statementColor}
          onClick={handleMidIconClick}
          data-cy="bottom-nav-mid-icon"
        >
          {isNavigationOpen && isAddOption ? (
            <PlusIcon style={{ color: statementColor.color }} />
          ) : (
            <MainIcon style={{ color: statementColor.color }} />
          )} */}
        {/* </IconButton> */}
        {smallScreen ? (
          <div style={{ visibility: isNavigationOpen ? "hidden" : "visible" }}>
            <div
              className="statement-bottom-nav__sortButton"
              onClick={handleMidIconClick}
            >
              <SortIcon />
            </div>
          </div>
        ) : (
          <div>
            {isNavigationOpen ? (
              <div
                className="statement-bottom-nav__sortButton"
                onClick={handleMidIconClick}
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  padding: "0",
                }}
              >
                <SortIcon />
              </div>
            ) : (
              <div
                className="statement-bottom-nav__sortButton"
                onClick={handleMidIconClick}
              >
                <SortIcon />
                <p>Sort {currentPage}</p>
              </div>
            )}
          </div>
        )}

        {navItems.map((navItem) => (
          <>
            <div
              className={`open-nav-icon ${isNavigationOpen ? "navActive" : ""}`}
            >
              <Link
                to={navItem.link}
                key={navItem.id}
                onClick={() => setIsNavigationOpen(false)}
              >
                <NavIcon
                  name={navItem.name}
                  color={statementColor.backgroundColor}
                />
              </Link>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default StatementBottomNav;

function getNavigationScreens(page: string | undefined): NavItem[] {
  if (!page) return optionsArray;

  switch (page) {
    case Screen.VOTE:
      return votesArray;
    case Screen.OPTIONS:
      return optionsArray;
    case Screen.QUESTIONS:
      return questionsArray;
    default:
      return optionsArray;
  }
}

interface NavIconProps {
  name: string;
  color: string;
}

const NavIcon: FC<NavIconProps> = ({ name, color }) => {
  const props = { style: { color } };
  switch (name) {
    case "New":
      return <NewestIcon {...props} />;
    case "Update":
      return <UpdateIcon {...props} />;
    case "Random":
      return <RandomIcon {...props} />;
    case "Agreement":
      return <AgreementIcon {...props} />;
    default:
      return null;
  }
};
