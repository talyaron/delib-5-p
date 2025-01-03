import { useContext, useEffect, useRef } from 'react';
import { StatementContext } from '../../../StatementCont';
import SuggestionCards from '../../evaluations/components/suggestionCards/SuggestionCards';
import styles from './StagePage.module.scss'
import StatementBottomNav from '../../nav/bottom/StatementBottomNav';
import { useLanguage } from '@/controllers/hooks/useLanguages';

const StagePage = () => {
	const { t } = useLanguage();
	const { statement } = useContext(StatementContext);
	const stageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateHeight = () => {
			if (stageRef.current) {
				const topPosition = stageRef.current.getBoundingClientRect().top;
				const viewportHeight = window.innerHeight;
				const newHeight = viewportHeight - topPosition;
				stageRef.current.style.height = `${newHeight}px`;
			}
		};

		// Initial height calculation
		updateHeight();

		// Update height on window resize
		window.addEventListener('resize', updateHeight);

		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	}, []);


	const stageName = statement?.statement ? `: ${t(statement.statement)}` : "";

	return (
		<div
			ref={stageRef}
			className={styles.stage}
		>
			<div className={styles.wrapper}>
				<h2>{t("Stage")}{statement?.statement && stageName}</h2>
				<p className="mb-4">Stage description</p>
				<SuggestionCards />
				<div className={styles.bottomNav}>
					<StatementBottomNav />
				</div>
			</div>
		</div>
	);
};

export default StagePage;

