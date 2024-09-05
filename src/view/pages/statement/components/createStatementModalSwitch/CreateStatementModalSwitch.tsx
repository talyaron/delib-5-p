import { Statement } from 'delib-npm';
import React from 'react';
import SimilarStatementsSuggestion from '../SimilarStatementsSuggestion/SimilarStatementsSuggestion';
import CreateStatementModal from '../createStatementModal/CreateStatementModal';

interface CreateStatementModalSwitchProps {
	useSimilarStatements: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	isQuestion: boolean;
	isMultiStage: boolean;
	parentStatement: Statement;
	toggleAskNotifications: () => void;
}

export default function CreateStatementModalSwitch({
	useSimilarStatements,
	setShowModal,
	isQuestion,
	isMultiStage,
	parentStatement,
	toggleAskNotifications,
}: CreateStatementModalSwitchProps) {
	return useSimilarStatements ? (
		<SimilarStatementsSuggestion
			setShowModal={setShowModal}
			isQuestion={isQuestion}
			parentStatement={parentStatement}
			toggleAskNotifications={toggleAskNotifications}
			isSendToStoreTemp={isMultiStage}
		/>
	) : (
		<CreateStatementModal
			parentStatement={parentStatement}
			isOption={!isQuestion}
			setShowModal={setShowModal}
			toggleAskNotifications={toggleAskNotifications}
			isSendToStoreTemp={isMultiStage}
		/>
	);
}
