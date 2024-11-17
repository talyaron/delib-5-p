import { Stage } from 'delib-npm';
import { FC } from 'react';
import styles from './ProcessPoint.module.scss';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface Props {
	stage?: Stage;
    isStart?: boolean;
    isEnd?: boolean;
	isChat?: boolean;
}

const ProcessPoint: FC<Props> = ({ stage, isStart = false, isEnd = false, isChat}) => {
	if(!stage && !isChat) return null;
    const {t} = useLanguage();
	const title = isChat ? "Chat" : stage?.title || "stage";

	return (
		<div className={styles.point}>
			<div className={styles.circle}>
				<div style={{backgroundColor:isStart?'transparent':"var(--disabled)"}}></div>
				<div>
                    <div className={styles.messages}></div>
                </div>
				<div style={{backgroundColor:isEnd?'transparent':"var(--disabled)"}}></div>
			</div>
			<div className={styles.label}>{t(title)}</div>
		</div>
	);
};

export default ProcessPoint;
