import { useParams } from 'react-router-dom';
import ProcessNav from './processNav/ProcessNav';

const Process = () => {
	const { screen, shortProcessId, sort } = useParams();

	return (
		<div className='wrapper'>
			{screen} {shortProcessId}, {sort}
			<ProcessNav />
		</div>
	);
};

export default Process;
