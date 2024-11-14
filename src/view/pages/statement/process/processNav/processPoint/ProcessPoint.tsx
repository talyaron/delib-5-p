import { Stage } from 'delib-npm';
import { FC } from 'react';
import styles from './ProcessPoint.module.scss';

interface Props {
	stage: Stage;
    isStart: boolean;
    isEnd: boolean;
}

const ProcessPoint: FC<Props> = ({ stage, isStart, isEnd }) => {
	return (
		<div className={styles.point}>
			<div className={styles.circle}>
				<div style={{backgroundColor:isStart?'transparent':"var(--disabled)"}}></div>
				<div>
                    <div className={styles.messages}></div>
                </div>
				<div style={{backgroundColor:isEnd?'transparent':"var(--disabled)"}}></div>
			</div>
			<div className={styles.label}>{stage.title}</div>
		</div>
	);
};

export default ProcessPoint;
