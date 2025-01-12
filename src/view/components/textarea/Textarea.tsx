import React, { useRef, useEffect } from 'react';
import styles from './Textarea.module.scss';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface TextAreaProps {
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	name: string;
}

const Textarea: React.FC<TextAreaProps> = ({
	label = 'Your description',
	placeholder = 'Please write the description of your suggestion here...',
	value = '',
	name,
}) => {
	const { dir } = useLanguage();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			// Reset height to auto to get the correct scrollHeight
			textarea.style.height = 'auto';
			// Set new height based on scrollHeight
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	// Adjust height on initial render and when value changes
	useEffect(() => {
		adjustHeight();
	}, [value]);

	const handleChange = () => {
		adjustHeight();
		// onChange?.(e.target.value);
	};

	return (
		<div className={styles.container}>
			<div className={styles.labelContainer}>
				<div className={`${styles.labelWrapper} ${dir === "ltr" ? styles["labelWrapper--ltr"] : styles["labelWrapper--rtl"]}`}>
					<span className={styles.label}>{label}</span>
				</div>
			</div>
			<div className={styles.inputContainer}>
				<textarea
					name={name}
					ref={textareaRef}
					className={styles.textArea}
					placeholder={placeholder}
					defaultValue={value}
					onChange={handleChange}
					rows={3} // Start with one row
				/>
			</div>
		</div>
	);
};

export default Textarea;