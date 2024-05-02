import React, { FC, useState } from "react";

// Third party libraries
import { Statement, Screen } from "delib-npm";
import { Link, useParams } from "react-router-dom";

// Icons
import BurgerIcon from "../../../../../../assets/icons/burgerIcon.svg?react";
import PlusIcon from "../../../../../../assets/icons/plusIcon.svg?react";
import AgreementIcon from "../../../../../../assets/icons/agreementIcon.svg?react";
import RandomIcon from "../../../../../../assets/icons/randomIcon.svg?react";
import UpdateIcon from "../../../../../../assets/icons/updateIcon.svg?react";
import NewestIcon from "../../../../../../assets/icons/newIcon.svg?react";
import useStatementColor from "../../../../../../controllers/hooks/useStatementColor";
import {
    optionsArray,
    questionsArray,
    votesArray,
} from "./StatementBottomNavModal";

interface Props {
    statement: Statement;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showNav?: boolean;
}

const StatementBottomNav: FC<Props> = ({ setShowModal, statement }) => {
    const { page } = useParams();

    const navArray = getPageArray(page);

    const [openNav, setOpenNav] = useState(false);

    const statementColor = useStatementColor(statement.statementType || "");

    //used to check if the user can add a new option in voting and in evaluation screens
    const addOption: boolean | undefined =
        statement.statementSettings?.enableAddEvaluationOption;

    const addVotingOption: boolean | undefined =
        statement.statementSettings?.enableAddVotingOption;

    const showAddOptionEvaluation = page === Screen.OPTIONS && addOption;
    const showAddOptionVoting = page === Screen.VOTE && addVotingOption;
    const showAddQuestion = page === Screen.QUESTIONS;
    const isAddOption =
        showAddOptionEvaluation || showAddOptionVoting || showAddQuestion;

    const handleMidIconClick = () => {
        if (!openNav) return setOpenNav(true);
        if (isAddOption) {
            setShowModal(true);
        }
        setOpenNav(false);
    };

    const navStyle = {
        bottom: page === "vote" ? "unset" : "3rem",
        height: page === "vote" ? "4rem" : "unset",
    };

    return (
        <>
            {openNav && (
                <div
                    className="invisibleBackground"
                    onClick={() => setOpenNav(false)}
                />
            )}
            <div className="bottomNav" style={navStyle}>
                <div
                    className="bottomNav__iconbox bottomNav__iconbox--burger"
                    style={statementColor}
                    onClick={handleMidIconClick}
                    data-cy="bottom-nav-mid-icon"
                >
                    {openNav && isAddOption ? (
                        <PlusIcon style={{ color: statementColor.color }} />
                    ) : (
                        <BurgerIcon style={{ color: statementColor.color }} />
                    )}
                </div>

                {navArray.map((navItem) => (
                    <Link
                        className={`bottomNav__iconbox ${
                            openNav && "bottomNav__iconbox--active"
                        }`}
                        to={navItem.link}
                        key={navItem.id}
                        onClick={() => setOpenNav(false)}
                    >
                        <NavIcon
                            name={navItem.name}
                            color={statementColor.backgroundColor}
                        />
                    </Link>
                ))}
            </div>
        </>
    );
};

export default StatementBottomNav;

function getPageArray(page: string | undefined) {
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
