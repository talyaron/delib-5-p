import { statementStagesSelector } from '@/model/stages/stagesSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './ProcessNav.module.scss';
import ProcessPoint from './processPoint/ProcessPoint';

const ProcessNav = () => {
	const { statementId } = useParams();
	const stages = useSelector(statementStagesSelector(statementId));

	return (
		<div className="wrapper">
			<div className={styles.line}>
				<ProcessPoint isChat={true} isStart={true} />
				{stages.map((stage, i) => {
					const isEnd = i === stages.length - 1;

					return <ProcessPoint key={i} stage={stage} isEnd={isEnd} />;
				})}
			</div>
		</div>
	);
};

export default ProcessNav;
