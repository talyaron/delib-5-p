import { useLanguage } from '@/controllers/hooks/useLanguages';
import { SetFavorite } from '@/view/components/setFavorite/SetFavorite';
import { Statement } from 'delib-npm';
import { FC } from 'react';

interface Props {
	statement: Statement | undefined;
}

const Explanation: FC<Props> = ({ statement }) => {
	const { t } = useLanguage();

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
