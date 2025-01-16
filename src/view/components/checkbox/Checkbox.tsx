import { FC, useState } from "react";
import CheckboxCheckedIcon from "@/assets/icons/checkboxCheckedIcon.svg?react";
import CheckboxEmptyIcon from "@/assets/icons/checkboxEmptyIcon.svg?react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import "./Checkbox.scss";
import VisuallyHidden from "../accessibility/toScreenReaders/VisuallyHidden";

interface CheckboxProps {
	name?: string;
	label: string;
	isChecked: boolean;
	onChange: (checked: boolean) => void;
}

const Checkbox: FC<CheckboxProps> = ({
	name,
	label,
	isChecked,
	onChange,
}: CheckboxProps) => {
	const { t } = useLanguage();
	const [_isChecked, setIsChecked] = useState(isChecked);

	const handleChange = () => {
		setIsChecked(!_isChecked);
		onChange(!_isChecked);
	};

	return (
		<div
			className={`checkbox ${_isChecked ? "checked" : ""}`}
			onClick={handleChange}
		>
			<label
				htmlFor={`checkbox-${label}`}
			>
				<VisuallyHidden labelName={t(label)} />
			</label>
			<button
				type="button"
				className="checkbox-icon"
				onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
					if (e.key === "Enter") {
						e.preventDefault();
					}
				}}
				aria-label={_isChecked ? "Uncheck" : "Check"}
			>
				{_isChecked ? <CheckboxCheckedIcon /> : <CheckboxEmptyIcon />}
			</button>
			<input
				type="checkbox"
				name={name}
				id={`checkbox-${label}`}
				checked={_isChecked}
				onChange={handleChange}
			/>
			<div className="checkbox-label">{t(label)}</div>
		</div>
	);
};

export default Checkbox;