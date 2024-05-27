import { ComponentProps, FC, useEffect } from "react";
import IconButton from "../iconButton/IconButton";
import EllipsisIcon from "../../../assets/icons/ellipsisIcon.svg?react";
import "./Menu.scss";
import { useLanguage } from "../../../controllers/hooks/useLanguages";

interface MenuProps extends ComponentProps<"div"> {
  iconColor: string;
  isMenuOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Menu: FC<MenuProps> = ({
	iconColor,
	isMenuOpen,
	setIsOpen,
	children,
}) => {
	const { dir } = useLanguage();

	useEffect(() => {
		if (isMenuOpen) {
			const timer = setTimeout(() => {
				setIsOpen(false);
			}, 2000);

			return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or isMenuOpen changes
		}
	}, [isMenuOpen, setIsOpen]);

	if (!children) {
		return null;
	}

	return (
		<div className="menu">
			<IconButton onClick={() => setIsOpen(!isMenuOpen)}>
				<EllipsisIcon style={{ color: iconColor }} />
			</IconButton>

			{isMenuOpen && (
				<div className={`menu-content ${dir}`}>
					{children}
					<div
						className="invisibleBackground"
						onClick={() => setIsOpen(false)}
					/>
				</div>
			)}
		</div>
	);
};

export default Menu;
