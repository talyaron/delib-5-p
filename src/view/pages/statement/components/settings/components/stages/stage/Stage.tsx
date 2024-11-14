import React, { useState } from 'react';
import styles from './Stage.module.scss';
import { Method, Stage } from 'delib-npm';
import { getDeliberationMethod } from '@/model/deliberation/deliberationMethodsModel';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface StageProps {
	stage: Stage;
}

const StageAccordion: React.FC<StageProps> = ({ stage }) => {
	const { t } = useLanguage();
	const { title } = stage;
	const [isOpen, setIsOpen] = useState(false);
	const method = stage.method as Method;
	const deliberationMethod = getDeliberationMethod(method);
	const defaultImage = deliberationMethod
		? deliberationMethod.defaultImage
		: null;

	const toggleAccordion = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={styles.accordion}>
			<button className={styles.accordionHeader} onClick={toggleAccordion}>
				<div>
					{defaultImage && <div className={styles.img}>{defaultImage}</div>}
					{title && <h4>{t(title)}</h4>}
				</div>
				<span>{isOpen ? '-' : '+'}</span>
			</button>

			<div className={`${styles.accordionContent} ${isOpen && styles.open}`}>
				<div>content on another page</div>
			</div>
		</div>
	);
};

export default StageAccordion;
