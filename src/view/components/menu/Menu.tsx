import { ComponentProps, FC } from "react";
import IconButton from "../iconButton/IconButton";
import EllipsisIcon from "@/assets/icons/ellipsisIcon.svg?react";
import "./Menu.scss";
import { useLanguage } from "@/controllers/hooks/useLanguages";

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
						role="button"
						aria-label="Close menu"
						tabIndex={0}
					/>
				</div>
			)}
		</div>
	);
};

export default Menu;
