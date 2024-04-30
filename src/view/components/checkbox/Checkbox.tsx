import { FC, useState } from "react";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import CheckboxCheckedIcon from "../../../assets/icons/checkboxCheckedIcon.svg?react";
import CheckboxEmptyIcon from "../../../assets/icons/checkboxEmptyIcon.svg?react";
import "./Checkbox.scss";

interface CheckboxProps {
    defaultChecked: boolean;
    name: string;
    label: string;
    onChange?: (checked: boolean) => void;
}

const Checkbox: FC<CheckboxProps> = ({
    name,
    label,
    defaultChecked,
    onChange,
}: CheckboxProps) => {
    const { t } = useLanguage();

    const [checked, setChecked] = useState(defaultChecked);

    const handleChange = () => {
        setChecked((prev) => !prev);
        onChange?.(!checked);
    };

    return (
        <label
            htmlFor={name}
            onClick={handleChange}
            className={`checkbox ${checked ? "checked" : ""}`}
        >
            <div className="checkbox-icon">
                {checked ? <CheckboxCheckedIcon /> : <CheckboxEmptyIcon />}
            </div>

            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={handleChange}
            />
            <div className="checkbox-label">{t(label)}</div>
        </label>
    );
};

export default Checkbox;
