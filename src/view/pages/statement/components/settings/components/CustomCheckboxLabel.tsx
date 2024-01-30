import { t } from "i18next";
import { useState } from "react";
import CheckedIcon from "../../../../../components/icons/CheckedIcon";
import UncheckedIcon from "../../../../../components/icons/UncheckedIcon";

interface CustomLabelProps {
    defaultChecked: boolean | undefined;
    name: string;
    title: string;
}

export default function CustomCheckboxLabel({
    name,
    title,
    defaultChecked,
}: CustomLabelProps) {
    const [checked, setChecked] = useState(defaultChecked);
    console.log("CustomCheckboxLabel", name, checked);

    return (
        <label
            htmlFor={name}
            className="settings__checkboxSection__column__label"
        >
            <div onClick={() => setChecked((prev) => !prev)}>
                {checked ? <CheckedIcon /> : <UncheckedIcon />}
            </div>
            <input
                type="checkbox"
                name={name}
                checked={defaultChecked}
                value={checked ? "on" : "off"}
                style={{ display: "none" }}
            />
            {t(`${title}`)}
        </label>
    );
}
