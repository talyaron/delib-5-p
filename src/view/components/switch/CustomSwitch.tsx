// CustomSwitch.js
import { useState, FC, ComponentProps } from "react";
import styles from "./CustomSwitch.module.scss";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import { Screen, Statement } from "delib-npm";

interface Props extends ComponentProps<"div"> {
    label: string;
    link: Screen;
    defaultChecked: boolean;
    statement:Statement |undefined;
}

const CustomSwitch: FC<Props> = ({ label, defaultChecked, link, children, statement}) => {
    const [checked, setChecked] = useState(defaultChecked);
    const { t } = useLanguage();
   
    const handleChange = () => {
        if(!statement) return;
        const {subScreens} = statement;
        if(!subScreens) return;
        //in case it exists in the subScreens remove it
        if(subScreens.includes(link){

        }
      const isLastTab=  checkOnTabs(link,  !checked);
         if(!isLastTab)
        setChecked( !checked)  
        }
    
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
