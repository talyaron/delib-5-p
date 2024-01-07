import { t } from "i18next";
import CheckedIcon from "../../../../components/icons/CheckedIcon";
import { useState } from "react";
import UncheckedIcon from "../../../../components/icons/UncheckedIcon";

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
    return (
        <label htmlFor={name} className="label">
            <input
                type="checkbox"
                name={name}
                defaultChecked={defaultChecked}
            />
            {t(`${title}`)}
        </label>
    );
}
