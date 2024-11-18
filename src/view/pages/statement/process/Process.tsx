import ProcessNav from './processNav/ProcessNav';
import Methods from './methods/Methods';
import styles from './Process.module.scss';
import { useContext } from 'react';
import { MainContext } from '../StatementMain';
import { statementStagesSelector } from '@/model/stages/stagesSlice';
import { useSelector } from 'react-redux';

const Process = () => {
	const { statement } = useContext(MainContext);
	if (!statement) return null;
	const stages = useSelector(statementStagesSelector(statement.statementId));
	const hasStages = stages.length > 0;

	return (
		<div className={`page__main ${styles.process}`}>
			<div className="wrapper">
				<h1>{statement?.statement}</h1>

				{hasStages && (
					<div>
						<ProcessNav />
					</div>
				)}
				<div className={styles.description}>{statement?.description}</div>
				<Methods />
			</div>
		</div>
	);
};

export default Process;
