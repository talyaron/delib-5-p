import { ComponentProps, FC } from "react";
import IconButton from "../iconButton/IconButton";
import EllipsisIcon from "../../../assets/icons/ellipsisIcon.svg?react";
import "./Menu.scss";

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
    return (
        <div className="menu-container">
            <IconButton onClick={() => setIsOpen(!isMenuOpen)}>
                <EllipsisIcon style={{ color: iconColor }} />
            </IconButton>

            {isMenuOpen && (
                <div className="menu-content">
                    {children}{" "}
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
