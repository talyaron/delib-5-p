// CustomSwitch.js
import { useState, FC } from "react";
import styles from "./CustomSwitch.module.scss";
// import { useLanguage } from "../../../functions/hooks/useLanguages";

interface Props {
    label: string;
    secondaryLabel?: string; // if you want to have a secondary label (the value of it will be checked===true)
    link: string;
    defaultChecked: boolean;
}

const CustomSwitch: FC<Props> = ({
    label,
    defaultChecked,
    link,
    secondaryLabel,
}) => {
    const [checked, setChecked] = useState(defaultChecked);
    // const { languageData } = useLanguage();

    const handleChange = () => {
        setChecked(!checked);
    };

    const tagPosition =
        document.body.style.direction === "ltr"
            ? {
                  backgroundColor: `${checked ? "#4E88C7" : "#D4D6F8"}`,
                  left: checked ? "0%" : "50%",
              }
            : {
                  backgroundColor: `${checked ? "#4E88C7" : "#D4D6F8"}`,
                  right: checked ? "0%" : "50%",
              };

    const labelPosition =
        document.body.style.direction === "ltr"
            ? {
                  color: checked ? "#3B4F7D" : "#6E8AA6",
                  right: checked ? "0%" : "50%",
              }
            : {
                  color: checked ? "#3B4F7D" : "#6E8AA6",
                  left: checked ? "0%" : "50%",
              };

    return (
        <div className={styles.switch}>
            <div
                className={styles.tag}
                onClick={() => {
                    setChecked(!checked);
                }}
                style={tagPosition}
            ></div>
            <div
                className={styles.label}
                onClick={() => {
                    setChecked(!checked);
                }}
                style={labelPosition}
                data-cy={`toggleSwitch-${link}`}
            >
                {labelName(checked, label, secondaryLabel)}
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

function labelName(checked: boolean, label: string, secondaryLabel?: string) {
   
    if (secondaryLabel) {
        return checked ? secondaryLabel : label;
    }

    return label;
}
