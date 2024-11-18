import { stageByShortIdSelector } from '@/model/stages/stagesSlice';
import { Method } from 'delib-npm';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import StatementChat from '../../components/chat/StatementChat';
import StatementSuggestions from '../../components/evaluations/StatementSuggestions';

const Methods = () => {
	const { statementId, shortProcessId } = useParams();
	const stage = useSelector(
		stageByShortIdSelector(statementId, shortProcessId)
	);
	const method:Method | "chat" =
		shortProcessId === 'chat' || !shortProcessId ? 'chat' : stage?.method;

	switch(method){
		case Method.suggestions:
			return <StatementSuggestions />;
        default:
            return <StatementChat />;
    }
};

export default Methods;
