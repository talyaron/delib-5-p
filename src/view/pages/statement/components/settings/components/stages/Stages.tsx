import { useLanguage } from '@/controllers/hooks/useLanguages';
import NewStage from './newStage/NewStage';
import { statementStagesSelector } from '@/model/stages/stagesSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StageAccordion from './stage/Stage';

const Stages = () => {
	const { t } = useLanguage();
	const {statementId} = useParams();
	const stages = useSelector(statementStagesSelector(statementId)).sort((a, b) => a.order - b.order);

	return (
		<div className='wrapper'>
			<h2>{t('Stages')}</h2>
			{stages.map((stage) => (
				<StageAccordion key={stage.stageId} stage={stage} />
			))}
			<NewStage />
		</div>
	);
};

export default Stages;
