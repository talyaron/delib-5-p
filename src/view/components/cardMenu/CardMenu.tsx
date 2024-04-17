import { FC, useState } from "react";
import styles from "./CardMenu.module.scss";
import EllipsisIcon from "../../../assets/icons/ellipsisIcon.svg?react";
import IconButton from "../iconButton/IconButton";

interface Props {
    children: any;
    isMe: boolean;
}

const CardMenu: FC<Props> = ({ children, isMe }) => {
    if (!children) return null;
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            {children && (
                <IconButton
                    onClick={() => setOpenMenu(!openMenu)}
                    data-cy="chat-more-icon"
                >
                    <EllipsisIcon style={{ color: "#5899E0" }} />
                </IconButton>
            )}
            {openMenu && (
                <>
                    <div
                        className={styles.menu}
                        onClick={() => setOpenMenu(!openMenu)}
                        style={
                            !isMe
                                ? { right: `.9rem`, left: "unset" }
                                : { left: ".9rem" }
                        }
                    >
                        {children}
                    </div>
                    <div
                        className={styles.background}
                        onClick={() => setOpenMenu(false)}
                    ></div>
                </>
            )}
        </>
    );
};

export default CardMenu;
