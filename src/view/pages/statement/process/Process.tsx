import { useParams } from 'react-router-dom';

const Process = () => {
	const { screen, shortProcessId, sort } = useParams();

	return <div>{screen} {shortProcessId}, {sort}</div>;
};

export default Process;
