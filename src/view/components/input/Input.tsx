import React, { useState } from 'react';
import styles from './Input.module.scss';

interface SearchInputProps {
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
}

const Input: React.FC<SearchInputProps> = ({
	label = 'Your name',
	placeholder = 'Search...',
	value = '',
	onChange,
}) => {
	const [inputValue, setInputValue] = useState(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		onChange?.(e.target.value);
	};

	const handleClear = () => {
		setInputValue('');
		onChange?.('');
	};

	return (
		<div className={styles.container}>
			<div className={styles.label}>{label}</div>
			<div className={styles.inputContainer}>
				<img
					src="https://dashboard.codeparrot.ai/api/assets/Z2PctANhjipAogi0"
					alt="search"
					className={styles.searchIcon}
					width={24}
					height={24}
				/>
				<input
					type="text"
					value={inputValue}
					onChange={handleChange}
					placeholder={placeholder}
					className={styles.input}
				/>
				{inputValue && (
					<img
						src="https://dashboard.codeparrot.ai/api/assets/Z2PctANhjipAogi1"
						alt="clear"
						className={styles.clearIcon}
						onClick={handleClear}
						width={24}
						height={24}
					/>
				)}
			</div>
		</div>
	);
};

export default Input;

