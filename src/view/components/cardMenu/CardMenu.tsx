import { FC } from "react";
import styles from "./CardMenu.module.scss";

interface Props {
    children: any;
    setOpenMenu: Function;
}

const CardMenu: FC<Props> = ({ children, setOpenMenu }) => {
    return (
        <>
            <div className={styles.menu}>{children}</div>
            <div
                className={styles.background}
                onClick={() => setOpenMenu(false)}
            ></div>
        </>
    );
};

export default CardMenu;
