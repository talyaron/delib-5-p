import { FC, useEffect } from "react";
import Menu from "@/view/components/menu/Menu";
import MenuOption from "@/view/components/menu/MenuOption";
import EditIcon from "@/assets/icons/editIcon.svg?react";
import DeleteIcon from "@/assets/icons/delete.svg?react";
import LightBulbIcon from "@/assets/icons/lightBulbIcon.svg?react";
import { isOptionFn, Statement } from "delib-npm";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { deleteStatementFromDB } from "@/controllers/db/statements/deleteStatements";

interface Props {
  statement: Statement;
  isAuthorized: boolean;
  isCardMenuOpen: boolean;
  setIsCardMenuOpen: (isOpen: boolean) => void;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
  handleSetOption: () => void;
}

const SolutionMenu: FC<Props> = ({
	statement,
	isAuthorized,
	isCardMenuOpen,
	setIsCardMenuOpen,
	isEdit,
	setIsEdit,
	handleSetOption,
}) => {
	const { t } = useLanguage();

	if (!isAuthorized) return null;

	useEffect(() => {
		if (isCardMenuOpen) {
			setTimeout(() => {
				setIsCardMenuOpen(false);
			}, 5000);
		}
	}, [isCardMenuOpen]);

	return (
		<Menu
			setIsOpen={setIsCardMenuOpen}
			isMenuOpen={isCardMenuOpen}
			iconColor="#5899E0"
		>
			{isAuthorized && (
				<MenuOption
					label={t("Edit Text")}
					icon={<EditIcon />}
					onOptionClick={() => {
						setIsEdit(!isEdit);
						setIsCardMenuOpen(false);
					}}
				/>
			)}
			{isAuthorized && (
				<MenuOption
					isOptionSelected={isOptionFn(statement)}
					icon={<LightBulbIcon />}
					label={
						isOptionFn(statement)
							? t("Unmark as a Solution")
							: t("Mark as a Solution")
					}
					onOptionClick={() => {
						handleSetOption();
						setIsCardMenuOpen(false);
					}}
				/>
			)}
			{isAuthorized && (
				<MenuOption
					label={t("Delete")}
					icon={<DeleteIcon />}
					onOptionClick={() => {
						deleteStatementFromDB(statement, isAuthorized);
						setIsCardMenuOpen(false);
					}}
				/>
			)}
		</Menu>
	);
};

export default SolutionMenu;
