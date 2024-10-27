import { Statement } from "delib-npm";
import { FC } from "react";
import SimpleEvaluation from "./simpleEvaluation/SimpleEvaluation";
import EnhancedEvaluation from "./enhancedEvaluation/EnhancedEvaluation";

interface EvaluationProps {
  parentStatement: Statement;
  statement: Statement;
}

const Evaluation: FC<EvaluationProps> = ({ parentStatement, statement }) => {
  
	const shouldDisplayScore: boolean = parentStatement.statementSettings
		?.showEvaluation
		? parentStatement.statementSettings?.showEvaluation
		: false;

	if (parentStatement.statementSettings?.enhancedEvaluation) {
		return (
			<EnhancedEvaluation
				statement={statement}
				shouldDisplayScore={shouldDisplayScore}
			/>
		);
	}

	return (
		<SimpleEvaluation
			statement={statement}
			shouldDisplayScore={shouldDisplayScore}
		/>
	);
};

export default Evaluation;
