import { Stage } from 'delib-npm';
import { FC } from 'react';
import styles from './ProcessPoint.module.scss';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
	stage?: Stage;
	isStart?: boolean;
	isEnd?: boolean;
	isChat?: boolean;
}

const ProcessPoint: FC<Props> = ({
	stage,
	isStart = false,
	isEnd = false,
	isChat,
}) => {
	const { statementId, shortProcessId } = useParams();
	if (!stage && !isChat) return null;
	const { t } = useLanguage();
	const navigate = useNavigate();

	const title = isChat ? 'Chat' : stage?.title || 'stage';
	const shortId = !shortProcessId ? 'chat' : isChat ? 'chat' : stage?.shortId;

	const isSelected = !shortProcessId
		? shortId === 'chat' && isChat //in no process, chat is selected by default
		: shortId == shortProcessId;
	const isEnabled = stage?.enabled === false  ? false : true;
	const elementColor = isEnabled ? 'var(--icon-blue)' : 'var(--disabled)';
	const to = isEnabled?`/statement/${statementId}/process/${isChat ? 'chat' : stage?.shortId}`:"";

	function handleNavigate(){
		if(isEnabled){
			navigate(to);
		}
	}

	return (
		<button className={styles.stage} onClick={handleNavigate} style={{cursor:isEnabled?"pointer":"not-allowed"}}>
			<div className={styles.top}>
				<div
					className={styles.line}
					style={{
						backgroundColor: isStart ? 'transparent' : 'var(--disabled)',
					}}
				></div>
				<div
					className={`${styles.point} ${isSelected && styles['point--selected']}`}
					style={{ backgroundColor: elementColor }}
				>
					<div className={styles.innerPoint}>
						<div></div>
					</div>
					<div className={styles.messages}></div>
				</div>
				<div
					className={styles.line}
					style={{ backgroundColor: isEnd ? 'transparent' : 'var(--disabled)' }}
				></div>
			</div>
			<div className={styles.label}>{t(title)}</div>
		</button>
	);
};

export default ProcessPoint;
