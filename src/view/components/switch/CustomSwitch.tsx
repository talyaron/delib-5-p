// CustomSwitch.js
import { useState, FC } from "react";
import styles from "./CustomSwitch.module.scss";
import { t } from "i18next";

interface Props {
    label: string;
    link: string;
    defaultChecked?: boolean;
}

const CustomSwitch: FC<Props> = ({ label, defaultChecked, link }) => {
    const [checked, setChecked] = useState(defaultChecked);

    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div className={styles.switch}>
            <div
                className={styles.tag}
                onClick={() => {
                    setChecked(!checked);
                }}
                style={{
                    right: checked ? "0%" : "50%",
                    backgroundColor: `${checked ? "#787FFF" : "#D4D6F8"}`,
                }}
            ></div>
            <div
                className={styles.off}
                onClick={() => {
                    setChecked(!checked);
                }}
                style={{
                    left: checked ? "0%" : "50%",
                    color: checked ? "#3B4F7D" : "#6E8AA6",
                }}
            >
                {t(label)}
            </div>
            <input
                style={{ display: "none" }}
                type="checkbox"
                name={link}
                id="toggleSwitch"
                className="switch-input"
                defaultChecked={checked}
                onChange={handleChange}
                value={checked ? "on" : "off"}
            />
        </div>
    );
};

export default CustomSwitch;
