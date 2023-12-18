import { FC } from "react";
import { LANGUAGES } from "../../../constants/Languages";
import { handleSetLanguage } from "./LanguageSelectorCont";

interface Props{
    handleSelect?:Function
}

const LanguageSelector:FC<Props> = ({handleSelect}) => {
    const savedLang = localStorage.getItem("lang");
    return (
        <select
            defaultValue={savedLang || "en"}
            name="language"
            onChange={(event) => handleSelect ? handleSelect(event) : handleSetLanguage(event)}
        >
            {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>
                    {label}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelector;
