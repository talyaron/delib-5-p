import CheckboxCheckedIcon from "@/assets/icons/checkboxCheckedIcon.svg?react";
import CheckboxEmptyIcon from "@/assets/icons/checkboxEmptyIcon.svg?react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { FC } from "react";
import "./Checkbox.scss";
import VisuallyHidden from "../accessibility/toScreenReaders/VisuallyHidden";

interface CheckboxProps {
  name?: string;
  label: string;
  isChecked: boolean;
  toggleSelection: () => void;
}

const Checkbox: FC<CheckboxProps> = ({
	name,
	label,
	isChecked,
	toggleSelection,
}: CheckboxProps) => {
	const { t } = useLanguage();

	return (
		<div className={`checkbox ${isChecked ? "checked" : ""}`}>
			<label

				// className={`checkbox ${isChecked ? "checked" : ""}`}
				htmlFor={`checkbox-${label}`}
				onClick={toggleSelection}
			>
				<VisuallyHidden labelName={t(label)} />
			</label>
			<button
				type="button"
				className="checkbox-icon"
				onClick={toggleSelection}
				onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
					if (e.key === "Enter") {
						e.preventDefault();
						toggleSelection();
					}
				}}
				aria-label={isChecked ? "Uncheck" : "Check"}
			>
				{isChecked ? <CheckboxCheckedIcon /> : <CheckboxEmptyIcon />}
			</button>

			<input
				type="checkbox"
				name={name}
				id={`checkbox-${label}`}
				checked={isChecked}
				onChange={toggleSelection}
			/>

			<div className="checkbox-label">{t(label)}</div>
		</div>
	);
};

export default Checkbox;
