import RadioButtonCheckedIcon from "@/assets/icons/radioButtonChecked.svg?react";
import RadioButtonEmptyIcon from "@/assets/icons/radioButtonEmpty.svg?react";
import "./RadioBox.scss";

interface Props {
    currentValue: string;
    setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
    radioValue: string;
    children?: React.ReactNode;
}

export default function RadioBox({
	currentValue,
	setCurrentValue,
	radioValue,
	children,
}: Readonly<Props>) {
	const checked = currentValue === radioValue;

	return (
		<button className="radio-box" onClick={() => setCurrentValue(radioValue)}>
			{checked ? <RadioButtonCheckedIcon /> : <RadioButtonEmptyIcon />}
			<input
				type="radio"
				name="resultsBy"
				id="favoriteOption"
				checked={checked}
				value={radioValue}
			/>
			{children}
		</button>
	);
}
