import { FC, useState } from "react";
import styles from "./CardMenu.module.scss";
import MoreIcon from "../../../assets/icons/MoreIcon";

interface Props {
    children: any;
    isMe: boolean;
}

const CardMenu: FC<Props> = ({ children, isMe }) => {
    if (!children) return null;
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            <div onClick={() => setOpenMenu(true)}>
                <MoreIcon />
            </div>
            {openMenu && (
                <>
                    <div
                        className={styles.menu}
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
