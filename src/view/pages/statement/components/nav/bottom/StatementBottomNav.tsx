import React, { FC, useState } from "react";

// Third party libraries
import { Statement, Screen, StatementType } from "delib-npm";
import { Link, useParams } from "react-router-dom";

// Icons
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
import "./StatementBottomNav.scss";
import SortIcon from "../../../../../components/icons/SortIcon";
import useWindowDimensions from "../../../../../../controllers/hooks/useWindowDimentions";
import { useLanguage } from "../../../../../../controllers/hooks/useLanguages";

interface Props {
  statement: Statement;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNavigationOpen?: (statement: any) => void;
  isNavigationOpen?: boolean;
  showNav?: boolean;
  currentPage?: string;
}

const StatementBottomNav: FC<Props> = ({
  statement,
  setIsNavigationOpen,
  isNavigationOpen,
  currentPage,
}) => {
  const { page } = useParams();

  const { t } = useLanguage();

  const navItems = getNavigationScreens(page);
  const [isMainButtonVisible, setIsMainButtonVisible] = useState(true);
  const [isSmallIcon, setIsSmallIcon] = useState(false);

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
  showAddOptionEvaluation || showAddOptionVoting || showAddQuestion;
  if (!setIsNavigationOpen) {
    return null;
  }

  //nav button handler
  const handleMidIconClick = () => {
    if (!isNavigationOpen) {
      setIsNavigationOpen(true);
      setIsSmallIcon(true);
    } else {
      setIsNavigationOpen(false);
      setIsMainButtonVisible(false);
      setIsSmallIcon(true);

      setTimeout(() => {
        setIsMainButtonVisible(true);
        setIsSmallIcon(false);
      }, 1000);
    }
  };

  const { width } = useWindowDimensions();
  const smallScreen = width < 1024;

  return (
    <>
      {isNavigationOpen && (
        <div className="invisibleBackground" onClick={handleMidIconClick} />
      )}
      <div className="statement-bottom-nav">
        {smallScreen ? (
          <div
            style={{
              visibility: isNavigationOpen
                ? "hidden"
                : isMainButtonVisible
                  ? "visible"
                  : "hidden",
            }}
          >
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
              <>
                {isSmallIcon ? (
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
                    style={{}}
                  >
                    <SortIcon />
                    <p>{t(`Sort ${currentPage}s`)}</p>
                  </div>
                )}
              </>
            ) : isSmallIcon ? (
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
                style={{}}
              >
                <SortIcon />
                <p>{t(`Sort ${currentPage}s`)}</p>
              </div>
            )}
          </div>
        )}

        {navItems.map((navItem, index) => (
          <div
            className={`open-nav-icon ${isNavigationOpen ? "navActive" : ""}`}
            key={index}
          >
            <Link
              to={navItem.link}
              key={navItem.id}
              onClick={() => handleMidIconClick()}
            >
              <NavIcon
                name={navItem.name}
                color={statementColor.backgroundColor}
              />
            </Link>
          </div>
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
