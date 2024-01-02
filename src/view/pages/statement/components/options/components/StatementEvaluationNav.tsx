import React, { FC, useState } from "react";

// Third party libraries
import { Statement, Screen } from "delib-npm";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";

// Icons
import BurgerIcon from "../../../../../components/icons/BurgerIcon";
import PlusIcon from "../../../../../components/icons/PlusIcon";
import AgreementIcon from "../../../../../components/icons/AgreementIcon";
import RandomIcon from "../../../../../components/icons/RandomIcon";
import UpdateIcon from "../../../../../components/icons/UpdateIcon";
import NewestIcon from "../../../../../components/icons/NewestIcon";

interface Props {
    statement: Statement;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showNav?: boolean;
}

interface NavItems {
    link: Screen;
    name: string;
    id: string;
    icon: JSX.Element;
}

const optionsArray: NavItems[] = [
    {
        link: Screen.OPTIONS_NEW,
        name: t("New"),
        id: Screen.OPTIONS_NEW,
        icon: <NewestIcon />,
    },
    {
        link: Screen.OPTIONS_UPDATED,
        name: t("Update"),
        id: Screen.OPTIONS_UPDATED,
        icon: <UpdateIcon />,
    },
    {
        link: Screen.OPTIONS_RANDOM,
        name: t("Random"),
        id: Screen.OPTIONS_RANDOM,
        icon: <RandomIcon />,
    },
    {
        link: Screen.OPTIONS_CONSENSUS,
        name: t("Agreement"),
        id: Screen.OPTIONS_CONSENSUS,
        icon: <AgreementIcon />,
    },
];

const votesArray: NavItems[] = [
    // { link: Screen.VOTESֹֹֹ_VOTED, name: t("Vote"), id: Screen.VOTESֹֹֹ_VOTED },
    {
        link: Screen.VOTES_NEW,
        name: "New",
        id: Screen.VOTES_NEW,
        icon: <NewestIcon />,
    },
    {
        link: Screen.VOTES_UPDATED,
        name: "Update",
        id: Screen.VOTES_UPDATED,
        icon: <UpdateIcon />,
    },
    {
        link: Screen.VOTES_RANDOM,
        name: "Random",
        id: Screen.VOTES_RANDOM,
        icon: <RandomIcon />,
    },
    {
        link: Screen.VOTES_CONSENSUS,
        name: t("Agreement"),
        id: Screen.VOTES_CONSENSUS,
        icon: <AgreementIcon />,
    },
];

const StatementEvaluationNav: FC<Props> = ({ setShowModal, statement }) => {
    const { page } = useParams();

    const navArray = page === "vote" ? votesArray : optionsArray;

    const [openNav, setOpenNav] = useState(false);

    //used to check if the user can add a new option in voting and in evaluation screens
    const addOption: boolean | undefined =
        statement.statementSettings?.enableAddEvaluationOption;

    const addVotingOption: boolean | undefined =
        statement.statementSettings?.enableAddVotingOption;

    const showNavigation =
        page === "options" && addOption
            ? true
            : page === "vote" && addVotingOption
            ? true
            : false;

    const hadleMidIconClick = () => {
        if (!openNav) return setOpenNav(true);

        setShowModal(true);
        setOpenNav(false);
    };

    return (
        showNavigation && (
            <div className="bottomNav">
                <div
                    className="bottomNav__iconbox bottomNav__iconbox--burger"
                    onClick={hadleMidIconClick}
                >
                    {openNav ? (
                        <PlusIcon color="white" />
                    ) : (
                        <BurgerIcon color="white" />
                    )}
                </div>

                {navArray.map((navItem) => (
                    <Link
                        className={`bottomNav__iconbox ${
                            openNav && "bottomNav__iconbox--active"
                        }`}
                        to={navItem.link}
                    >
                        {navItem.icon}
                    </Link>
                ))}
            </div>
        )
    );
};

export default StatementEvaluationNav;
