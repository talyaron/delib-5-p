import { FC, useState } from 'react';
import styles from './selectWithImages.module.scss';

export interface SelectOption {
	id: number;
	title: string;
	image: JSX.Element;
}

interface Props {
	options: SelectOption[];
}

const SelectWithImages: FC<Props> = ({ options }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

	const handleSelect = (option: SelectOption) => {
		setSelectedOption(option);
		setIsOpen(false);
	};

	return (
		<div className={styles.select}>
			<button onClick={() => setIsOpen(!isOpen)} className={styles.selected}>
				{selectedOption ? (
					<div className={styles.button}>
						<span>{selectedOption.title}</span>
						{selectedOption.image}
					</div>
				) : (
					<span>Select an option</span>
				)}
				<span>{isOpen ? '▲' : '▼'}</span>
			</button>

			{isOpen && (
				<div>
					<ul className={styles.open}>
						{options.map((option) => (
							<button
								className={styles.button}
								key={option.id}
								onClick={() => handleSelect(option)}
								onKeyUp={(e) => {
									if (e.key === 'Enter') handleSelect(option);
								}}
							>
								<span>{option.title}</span>
								{option.image}
							</button>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default SelectWithImages;
