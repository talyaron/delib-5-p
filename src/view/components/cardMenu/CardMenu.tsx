import { FC } from "react";
import styles from "./CardMenu.module.scss";
import useDirection from "../../../functions/hooks/useDirection";

interface Props {
    children: any;
    setOpenMenu: Function;
}



const CardMenu: FC<Props> = ({ children, setOpenMenu }) => {

    const direction = useDirection();
    // console.log(_direction)
    // const direction = _direction === "row" ? "right:.9rem; left:unset" : "ltr";
    
    return (
        <>
            <div className={styles.menu} style={direction === 'row'?{right:`.9rem`, left:'unset'}:{left:'.9rem'}}>{children}</div>
            <div
                className={styles.background}
                onClick={() => setOpenMenu(false)}
            ></div>
        </>
    );
};

export default CardMenu;
