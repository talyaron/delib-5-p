import { FC, useState } from "react";
import styles from "./CardMenu.module.scss";
import MoreIcon from "../../../assets/icons/MoreIcon";

interface Props {
    children: any;
}

const CardMenu: FC<Props> = ({ children }) => {
    if (!children) return null;
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            <div onClick={() => setOpenMenu((prev) => !prev)}>
                <MoreIcon />
                {openMenu && (
                    <>
                        <div className={styles.menu}>{children}</div>
                        <div className={styles.background}></div>
                    </>
                )}
            </div>
        </>
    );
};

export default CardMenu;
