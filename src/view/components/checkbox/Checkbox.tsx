import { FC } from "react";
import { useLanguage } from "../../../controllers/hooks/useLanguages";
import CheckboxCheckedIcon from "../../../assets/icons/checkboxCheckedIcon.svg?react";
import CheckboxEmptyIcon from "../../../assets/icons/checkboxEmptyIcon.svg?react";
import "./Checkbox.scss";

interface CheckboxProps {
    name?: string;
    label: string;
    isChecked: boolean;
    toggleSelection: VoidFunction;
}

const Checkbox: FC<CheckboxProps> = ({
    name,
    label,
    isChecked,
    toggleSelection,
}: CheckboxProps) => {
    const { t } = useLanguage();

    return (
        <label className={`checkbox ${isChecked ? "checked" : ""}`} htmlFor={`checkbox-${label}`}>
            <div className="checkbox-icon">
                {isChecked ? <CheckboxCheckedIcon /> : <CheckboxEmptyIcon />}
            </div>

            <input
                type="checkbox"
                name={name}
                id={`checkbox-${label}`}
                checked={isChecked}
                onChange={toggleSelection}
            />

            <div className="checkbox-label">{t(label)}</div>
        </label>
    );
};

export default Checkbox;
