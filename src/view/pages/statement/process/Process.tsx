import { useParams } from 'react-router-dom';
import ProcessNav from './processNav/ProcessNav';
import Methods from './methods/Methods';

const Process = () => {
	const { screen, shortProcessId, sort } = useParams();

	return (
		<div>
			{screen} {shortProcessId}, {sort}
			<ProcessNav />
			<Methods />
		</div>
	);
};

export default Process;
