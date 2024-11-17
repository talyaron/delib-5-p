import ProcessNav from './processNav/ProcessNav';
import Methods from './methods/Methods';
import styles from './Process.module.scss';
import { useContext } from 'react';
import { MainContext } from '../StatementMain';

const Process = () => {
	const { statement } = useContext(MainContext);

	return (
		<>
			<div className={styles.process}>
				<h1>{statement?.statement}</h1>
				<ProcessNav />
			</div>
			<Methods />
		</>
	);
};

export default Process;
