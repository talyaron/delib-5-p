import { useLanguage } from '@/controllers/hooks/useLanguages';
import { statementSelector } from '@/model/statements/statementsSlice';
import { SetFavorite } from '@/view/components/setFavorite/SetFavorite';
import { Statement } from 'delib-npm';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Explanation: FC = () => {
	const { t } = useLanguage();
	const { statementId } = useParams();
	const statement: Statement | undefined = useSelector(
		statementSelector(statementId)
	);

	return (
		<div className="screen">
			<div className="wrapper">
				<div className="screen__title">
					<span>{t('Explanation')}</span>
					<SetFavorite statement={statement} />
				</div>
				<h1>{statement?.statement}</h1>
				<p>{statement?.description}</p>
			</div>
		</div>
	);
};

export default Explanation;
