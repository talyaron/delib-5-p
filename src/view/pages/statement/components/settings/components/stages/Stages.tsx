import { useLanguage } from '@/controllers/hooks/useLanguages';

const Stages = () => {
	const { t } = useLanguage();
	
	return (
		<div>
			<h2>{t('Stages')}</h2>
		</div>
	);
};

export default Stages;
