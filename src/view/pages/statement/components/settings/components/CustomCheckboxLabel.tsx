import { t } from "i18next";
import { useState } from "react";
import CheckedIcon from "../../../../../components/icons/CheckedIcon";
import UncheckedIcon from "../../../../../components/icons/UncheckedIcon";

interface CustomLabelProps {
    defaultChecked: boolean;
    name: string;
    title: string;
}

export default function CustomCheckboxLabel({
    name,
    title,
    defaultChecked,
}: CustomLabelProps) {
    const [checked, setChecked] = useState(defaultChecked);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    return (
        <label
            htmlFor={name}
            className="settings__checkboxSection__column__label"
        >
            <div onClick={handleChange}>
                {checked ? <CheckedIcon /> : <UncheckedIcon />}
            </div>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={handleChange}
                style={{ display: "none" }}
            />
            {t(`${title}`)}
        </label>
    );
}
