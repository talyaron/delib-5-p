import { Screen, SortType, StatementType } from "delib-npm";
import React, { FC, useContext, useState } from "react";

// Third party libraries
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

// Icons
import AgreementIcon from "@/assets/icons/agreementIcon.svg?react";
import NewestIcon from "@/assets/icons/newIcon.svg?react";
import PlusIcon from "@/assets/icons/plusIcon.svg?react";
import RandomIcon from "@/assets/icons/randomIcon.svg?react";
import SortIcon from "@/assets/icons/sort.svg?react";
import UpdateIcon from "@/assets/icons/updateIcon.svg?react";

import { decreesUserSettingsLearningRemain } from "@/controllers/db/learning/setLearning";
import useStatementColor from "@/controllers/hooks/useStatementColor";
import "./StatementBottomNav.scss";
import { userSettingsSelector } from "@/model/users/userSlice";
import StartHere from "@/view/components/startHere/StartHere";
import { StatementContext } from "../../../StatementCont";
import { sortItems } from "./StatementBottomNavModal";

interface Props {
	showNav?: boolean;
}

const StatementBottomNav: FC<Props> = () => {

	const { statementId } = useParams();
	const { statement, setNewStatementType, handleSetNewStatement } = useContext(StatementContext);

	const timesRemainToLearnAddOption = useSelector(userSettingsSelector)?.learning?.addOptions || 0;

	const [showSorting, setShowSorting] = useState(false);
	const [showStartHere, setShowStartHere] = useState(timesRemainToLearnAddOption > 0);

	const statementColor = useStatementColor({ statement });

	//used to check if the user can add a new option in voting and in evaluation screens

	function handleCreateNewOption() {
		setNewStatementType(StatementType.option);
		handleSetNewStatement(true);
	}

	const handleAddOption = () => {
		handleCreateNewOption()
		setShowStartHere(false);
		decreesUserSettingsLearningRemain({ addOption: true });


	};

	function handleSortingClick() {
		setShowSorting(!showSorting);
	}


	return (
		<>
			{showStartHere && <StartHere setShow={setShowStartHere} />}
			<div
				className={
					showSorting
						? "statement-bottom-nav statement-bottom-nav--show"
						: "statement-bottom-nav"
				}
			>
				<div className="add-option-button-wrapper">

					<button
						className="add-option-button"
						aria-label="Add option"
						style={statementColor}
						onClick={handleAddOption}
						data-cy="bottom-nav-mid-icon"
					>
						<PlusIcon style={{ color: statementColor.color }} />
					</button>
					<div className="sort-menu">
						{sortItems.map((navItem, i) => (
							<div
								key={`item-id-${i}`}
								className={`sort-menu__item  ${showSorting ? "active" : ""}`}
							>
								<Link
									className={`open-nav-icon ${showSorting ? "active" : ""}`}
									to={`/statement/${statementId}/main/${navItem.link}`}
									aria-label="Sorting options"
									key={navItem.id}
									onClick={() => setShowSorting(false)}
								>
									<NavIcon
										name={navItem.id}
										color={statementColor.backgroundColor}
									/>
								</Link>
								<span className="button-name">{navItem.name}</span>
							</div>
						))}
						<button
							className="sort-button"
							onClick={handleSortingClick}
							aria-label="Sort items"
						>
							<SortIcon />
						</button>
					</div>
				</div>

			</div>
		</>
	);
};

export default StatementBottomNav;



interface NavIconProps {
	name: string;
	color: string;
}

const NavIcon: FC<NavIconProps> = ({ name, color }) => {
	const props = { style: { color } };
	switch (name) {
		case SortType.newest:
			return <NewestIcon {...props} />;
		case SortType.mostUpdated:
			return <UpdateIcon {...props} />;
		case SortType.random:
			return <RandomIcon {...props} />;
		case SortType.accepted:
			return <AgreementIcon {...props} />;
		default:
			return null;
	}
};
