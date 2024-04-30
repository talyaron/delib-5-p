// CustomSwitch.js
import { useState, FC } from "react";
import styles from "./CustomSwitch.module.scss";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import { Screen, Statement } from "delib-npm";

interface Props {
    label: string;
    link: Screen;
    defaultChecked: boolean;
    statement?: Statement;
    _toggleSubScreen: (screen: Screen, statement: Statement) => void;
    children: JSX.Element;
}

const CustomSwitch: FC<Props> = ({
    label,
    defaultChecked,
    link,
    statement,
    _toggleSubScreen,
    children,
}) => {
    const [checked, setChecked] = useState(defaultChecked);
    const { t } = useLanguage();

    const subScreens = statement?.subScreens as Screen[] | undefined;

    const handleChange = () => {
        if (subScreens && subScreens.length > 0) {
            setChecked(!checked);
            if (statement) _toggleSubScreen(link, statement);
           
        }
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
                name={link.toString()}
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
