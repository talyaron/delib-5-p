import React, { useState, ChangeEvent } from 'react';
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
	const [inputValue, setInputValue] = useState<string>(value);

	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setInputValue(e.target.value);
		onChange?.(e.target.value);
	};

	const handleClear = (): void => {
		setInputValue('');
		onChange?.('');
	};

	return (
		<div className={styles.container}>
			<div
				className={`${styles.label} ${dir === "ltr" ? styles["label--ltr"] : styles["label--rtl"]
					}`}
			>
				{label}
			</div>
			<div className={styles.inputContainer}>
				{image && (
					<img
						src={image}
						alt="search"
						className={styles.searchIcon}
						width={24}
						height={24}
					/>
				)}
				<input
					name={name}
					type="text"
					value={inputValue}
					onChange={handleChange}
					placeholder={placeholder}
					className={styles.input}
				/>
				{inputValue && (
					<button
						onClick={handleClear}
						className={styles.clearButton}
						type="button"
						aria-label="Clear input"
					>
						<img
							src="https://dashboard.codeparrot.ai/api/assets/Z2PctANhjipAogi1"
							alt=""
							className={styles.clearIcon}
							width={24}
							height={24}
						/>
					</button>
				)}
			</div>
		</div>
	);
};

export default Input;