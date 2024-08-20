import { useRef, Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from "./passwordUi.module.scss";

interface PasswordProps {
	passwordLength: 4;
	values: string[],
	handleSubmit: () => void
	setValues: Dispatch<SetStateAction<string[]>>
}

const PasswordInput = ({ handleSubmit, passwordLength: length, values, setValues }: PasswordProps) => {
	const inputs = useRef<(HTMLInputElement | null)[]>([]);
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const val = event.target.value;
		if (/^[0-9]$/.test(val) || val === '') {
			const newValues = [...values];
			newValues[index] = val;
			setValues(newValues);
			if (val && index < length - 1) {
				inputs.current[index + 1]?.focus();
			}
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (event.key === "Backspace" && !values[index] && index > 0) {
			inputs.current[index - 1]?.focus();
		}
	}

	useEffect(() => {
		if (values.every((val => val !== '')) && (!isSubmitted)) {
			setIsSubmitted(true)
			handleSubmit();
		}
		else {
			setIsSubmitted(false)
		}
	}, [values, handleSubmit]);

	return (
		<div className={styles.passwordUi__inputSection} >
			{values.map((val, index) => (
				<input
					key={index}
					ref={(element) => { inputs.current[index] = element }}
					maxLength={1}
					type="text"
					value={val}
					onKeyDown={(event) => handleKeyDown(event, index)}
					onChange={(event) => handleChange(event, index)}
				/>
			))}
		</div>
	);
};

export default PasswordInput;
