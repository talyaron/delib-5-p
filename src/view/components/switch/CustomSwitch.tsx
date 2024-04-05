// CustomSwitch.js
import { useState, FC, ComponentProps } from "react";
import styles from "./CustomSwitch.module.scss";
import { useLanguage } from "../../../functions/hooks/useLanguages";

interface Props extends ComponentProps<"div"> {
    label: string;
    link: string;
    defaultChecked: boolean;
}

const CustomSwitch: FC<Props> = ({ label, defaultChecked, link, children }) => {
    const [checked, setChecked] = useState(defaultChecked);
    const { t } = useLanguage();

    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div className={`${styles.switch} ${checked ? styles.checked : ""}`}>
            <div
                className={styles.tag}
                onClick={handleChange}
                children={children}
            />
            <div
                className={styles.label}
                onClick={handleChange}
                data-cy={`toggleSwitch-${link}`}
            >
                {t(label)}
            </div>
            <input
                style={{ display: "none" }}
                type="checkbox"
                name={link}
                id={`toggleSwitch-${link}`}
                className="switch-input"
                onChange={handleChange}
                value={checked ? "on" : "off"}
                checked={checked}
                data-cy={`toggleSwitch-input-${link}`}
            />
        </div>
    );
};

export default CustomSwitch;
