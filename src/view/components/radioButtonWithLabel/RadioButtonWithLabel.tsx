import { ComponentProps } from "react";
import RadioButtonCheckedIcon from "@/assets/icons/radioButtonChecked.svg?react";
import RadioButtonEmptyIcon from "@/assets/icons/radioButtonEmpty.svg?react";
import "./RadioButtonWithLabel.scss";

interface RadioButtonWithLabelProps extends ComponentProps<"input"> {
	labelText: string;
	id: string;
}

export default function RadioButtonWithLabel({
	labelText,
	id,
	checked,
	...inputProps
}: RadioButtonWithLabelProps) {
	return (
		<label
			htmlFor={id}
			className={`radio-button-with-label ${checked ? "checked" : ""}`}
		>
			{checked ? <RadioButtonCheckedIcon /> : <RadioButtonEmptyIcon />}
			<input
				id={id}
				type="radio"
				name="resultsBy"
				checked={checked}
				{...inputProps}
			/>
			{labelText}
		</label>
	);
}
