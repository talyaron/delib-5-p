import { FC, useState } from 'react';
import styles from './selectWithImages.module.scss';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { Method } from 'delib-npm';
import { DeliberationMethod } from '@/model/deliberation/deliberationMethodsModel';

export interface SelectOption {
	id: number;
	title: string;
	image: JSX.Element;
    method?:Method;
}

interface Props {
	options: DeliberationMethod[];
	selectedOption: DeliberationMethod | null;
	setSelectedOption: (option: DeliberationMethod) => void;
}

const SelectWithImages: FC<Props> = ({ options, selectedOption, setSelectedOption }) => {
	const { t } = useLanguage();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	
	const handleSelect = (option: DeliberationMethod) => {
		setSelectedOption(option);
		setIsOpen(false);
	};

	return (
		<div className={styles.select}>
			<button onClick={() => setIsOpen(!isOpen)} className={styles.selected}>
				{selectedOption ? (
					<div className={styles.button}>
						<span>{t(selectedOption.title)}</span>
						<div className={styles.image}>{selectedOption.defaultImage}</div>
					</div>
				) : (
					<span>{t('Deliberation method')}</span>
				)}
				<span>{isOpen ? '▲' : '▼'}</span>
			</button>

			{isOpen && (
				<div>
					<ul className={styles.open}>
						{options.map((option) => (
							<button
								className={styles.button}
								key={option.title}
								onClick={() => handleSelect(option)}
								onKeyUp={(e) => {
									if (e.key === 'Enter') handleSelect(option);
								}}
							>
								<span>{t(option.title)}</span>
								<div className={styles.image}>{option.defaultImage}</div>
							</button>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default SelectWithImages;
