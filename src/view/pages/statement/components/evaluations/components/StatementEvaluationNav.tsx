import React, { FC, useState } from "react";

// Third party libraries
import { Statement, Screen } from "delib-npm";
import { Link, useParams } from "react-router-dom";


// Icons
import BurgerIcon from "../../../../../components/icons/BurgerIcon";
import PlusIcon from "../../../../../components/icons/PlusIcon";
import AgreementIcon from "../../../../../components/icons/AgreementIcon";
import RandomIcon from "../../../../../components/icons/RandomIcon";
import UpdateIcon from "../../../../../components/icons/UpdateIcon";
import NewestIcon from "../../../../../components/icons/NewestIcon";
import useStatementColor from "../../../../../../functions/hooks/useStatementColor";

interface Props {
    statement: Statement;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showNav?: boolean;
}

interface NavItems {
    link: Screen;
    name: string;
    id: string;
}

const optionsArray: NavItems[] = [
    {
        link: Screen.OPTIONS_NEW,
        name: "New",
        id: Screen.OPTIONS_NEW,
    },
    {
        link: Screen.OPTIONS_UPDATED,
        name: "Update",
        id: Screen.OPTIONS_UPDATED,
    },
    {
        link: Screen.OPTIONS_RANDOM,
        name: "Random",
        id: Screen.OPTIONS_RANDOM,
    },
    {
        link: Screen.OPTIONS_CONSENSUS,
        name: "Agreement",
        id: Screen.OPTIONS_CONSENSUS,
    },
];

const votesArray: NavItems[] = [
    {
        link: Screen.VOTES_NEW,
        name: "New",
        id: Screen.VOTES_NEW,
    },
    {
        link: Screen.VOTES_UPDATED,
        name: "Update",
        id: Screen.VOTES_UPDATED,
    },
    {
        link: Screen.VOTES_RANDOM,
        name: "Random",
        id: Screen.VOTES_RANDOM,
    },
    {
        link: Screen.VOTESֹֹֹ_VOTED,
        name: "Agreement",
        id: Screen.VOTESֹֹֹ_VOTED,
    },

    // {
    //     link: Screen.VOTES_CONSENSUS,
    //     name: t("Agreement"),
    //     id: Screen.VOTES_CONSENSUS,
    //     icon: <AgreementIcon />,
    // },
];

const StatementEvaluationNav: FC<Props> = ({ setShowModal, statement }) => {
    const { page } = useParams();

    const navArray = page === "vote" ? votesArray : optionsArray;

    const [openNav, setOpenNav] = useState(false);

    const statementColor = useStatementColor(statement.statementType || "");

    //used to check if the user can add a new option in voting and in evaluation screens
    const addOption: boolean | undefined =
        statement.statementSettings?.enableAddEvaluationOption;

    const addVotingOption: boolean | undefined =
        statement.statementSettings?.enableAddVotingOption;

    const showNavigation =
        page === "options" ? true : page === "vote" ? true : false;

    const showAddOptionEvaluation = page === "options" && addOption;
    const showAddOptionVoting = page === "vote" && addVotingOption;

    const hadleMidIconClick = () => {
        if (!openNav) return setOpenNav(true);
        if (showAddOptionEvaluation || showAddOptionVoting) {
            setShowModal(true);
        }
        setOpenNav(false);
    };

    const icon = (name: string, color: string) => {
        switch (name) {
            case "New":
                return <NewestIcon color={color} />;
            case "Update":
                return <UpdateIcon color={color} />;
            case "Random":
                return <RandomIcon color={color} />;
            case "Agreement":
                return <AgreementIcon color={color} />;
            default:
                return <></>;
        }
    };

    const navStyle = {
        bottom: page === "vote" ? "unset" : "3rem",
        height: page === "vote" ? "4.5rem" : "unset",
    };

    return (
        showNavigation && (
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
                        onClick={hadleMidIconClick}
                    >
                        {openNav &&
                        (showAddOptionEvaluation || showAddOptionVoting) ? (
                            <PlusIcon color={statementColor.color} />
                        ) : (
                            <BurgerIcon color={statementColor.color} />
                        )}
                    </div>

                    {navArray.map((navItem) => (
                        <Link
                            className={`bottomNav__iconbox ${
                                openNav && "bottomNav__iconbox--active"
                            }`}
                            to={navItem.link}
                            key={navItem.id}
                        >
                            {icon(navItem.name, statementColor.backgroundColor)}
                        </Link>
                    ))}
                </div>
            </>
        )
    );
};

export default StatementEvaluationNav;
