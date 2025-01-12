import { Statement, StatementType } from 'delib-npm';
import React from 'react';
import CreateStatementModal from '../createStatementModal/CreateStatementModal';
import SimilarStatementsSuggestion from '../newStatemement/newStatement';

interface CreateStatementModalSwitchProps {
	useSimilarStatements: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	isQuestion: boolean;
	isMultiStage: boolean;
	parentStatement: Statement;
	allowedTypes?: StatementType[];

}

export default function CreateStatementModalSwitch({
	useSimilarStatements,
	setShowModal,
	isQuestion,
	isMultiStage,
	parentStatement,
	allowedTypes

}: CreateStatementModalSwitchProps) {
	return useSimilarStatements ? (
		<SimilarStatementsSuggestion />
	) : (
		<CreateStatementModal
			parentStatement={parentStatement}
			isOption={!isQuestion}
			setShowModal={setShowModal}
			isSendToStoreTemp={isMultiStage}
			allowedTypes={allowedTypes}
		/>
	);
}
