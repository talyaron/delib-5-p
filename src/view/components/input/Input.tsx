import React, { useState } from 'react';
import styles from './Input.module.scss';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface SearchInputProps {
	label?: string;
	placeholder?: string;
	value?: string;
	image?: string;
	onChange?: (value: string) => void;
	name: string;
}

const Input: React.FC<SearchInputProps> = ({
	label = 'Your name',
	placeholder = 'Search...',
	value = '',
	image,
	onChange,
	name
}) => {
	const { dir } = useLanguage();
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
			<div className={`${styles.label} ${dir === "ltr" ? styles["label--ltr"] : styles["label--rtl"]}`}>{label}</div>
			<div className={styles.inputContainer}>
				{image && <img
					src={image}
					alt="search"
					className={styles.searchIcon}
					width={24}
					height={24}
				/>}
				<input
					name={name}
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

