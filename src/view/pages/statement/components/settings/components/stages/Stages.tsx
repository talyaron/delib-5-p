import { useLanguage } from '@/controllers/hooks/useLanguages';
import NewStage from './newStage/NewStage';

const Stages = () => {
	const { t } = useLanguage();

	return (
		<div className='wrapper'>
			<h2>{t('Stages')}</h2>
			<NewStage />
		</div>
	);
};

export default Stages;
