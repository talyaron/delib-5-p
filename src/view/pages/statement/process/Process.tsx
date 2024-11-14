
import { useParams } from 'react-router-dom';

const Process = () => {
	const { page, process } = useParams();

	return <div>{page}, {process}</div>;
};

export default Process;
