import { FC, useState } from "react";
import { Access } from "delib-npm";
import styles from "./GroupAccess.module.scss";
import open from "../../../assets/icons/lockOpen.svg";
import close from "../../../assets/icons/lockClose.svg";
import lockBacground from "../../../assets/icons/lockBackground.svg";

interface Props {
    access: Access;
}
const GroupAccess: FC<Props> = ({ access }) => {
    const [accessType, setAccessType] = useState<Access>(access);

    function handleChangeAccsess() {
        setAccessType(accessType === Access.open ? Access.close : Access.open);
    }

    return (
        <div className={styles.img}>
            <div className={styles.imgs}>
                <img
                    className={styles.background}
                    src={lockBacground}
                    alt="access type"
                    onClick={handleChangeAccsess}
                />
                <img
                    className={styles.icon}
                    style={{
                        right: accessType === Access.open ? "-6px" : "62px",
                    }}
                    src={accessType === Access.open ? open : close}
                    alt="access type"
                    onClick={handleChangeAccsess}
                />
            </div>
            <div className={styles.text}>
                {accessType === Access.open ? "Open Group" : "Close Group"}
            </div>
            <input
                style={{ display: "none" }}
                type="checkbox"
                name={'access'}
                id={`toggleSwitch-access`}
                // value={accessType === Access.open ? "on" : "off"}
                onChange={handleChangeAccsess}
                checked={accessType === Access.open ?true : false}
                data-cy={`toggleSwitch-input-access`}
            />
        </div>
    );
};

export default GroupAccess;
