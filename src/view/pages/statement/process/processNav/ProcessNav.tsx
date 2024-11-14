import { statementStagesSelector } from '@/model/stages/stagesSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './ProcessNav.module.scss';
import ProcessPoint from './processPoint/ProcessPoint';

const ProcessNav = () => {
	const { statementId } = useParams();
	const stages = useSelector(statementStagesSelector(statementId));

	return (
		<div>
			<div className={styles.line}>
				{stages.map((stage, i) => {
					const isStart = i === 0;
					const isEnd = i === stages.length - 1;

					return (
						<ProcessPoint
							key={i}
							stage={stage}
							isEnd={isEnd}
							isStart={isStart}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default ProcessNav;
