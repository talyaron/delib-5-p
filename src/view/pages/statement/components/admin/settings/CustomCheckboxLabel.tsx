import React from "react";
import { t } from "i18next";

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
