import { QuestionType, Statement } from 'delib-npm';
import React from 'react';
import SimilarStatementsSuggestion from '../SimilarStatementsSuggestion/SimilarStatementsSuggestion';
import CreateStatementModal from '../createStatementModal/CreateStatementModal';

interface CreateStatementModalSwitchProps {
	type: QuestionType;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	isQuestion: boolean;
	isMuliStage: boolean;
	parentStatement: Statement;
	toggleAskNotifications: () => void;
}

export default function CreateStatementModalSwitch({
	type,
	setShowModal,
	isQuestion,
	isMuliStage,
	parentStatement,
	toggleAskNotifications,
}: CreateStatementModalSwitchProps) {
	return type === QuestionType.multipleSteps ? (
		<SimilarStatementsSuggestion
			setShowModal={setShowModal}
			isQuestion={isQuestion}
			parentStatement={parentStatement}
			toggleAskNotifications={toggleAskNotifications}
			isSendToStoreTemp={isMuliStage}
		/>
	) : (
		<CreateStatementModal
			parentStatement={parentStatement}
			isOption={!isQuestion}
			setShowModal={setShowModal}
			toggleAskNotifications={toggleAskNotifications}
			isSendToStoreTemp={isMuliStage}
		/>
	);
}
