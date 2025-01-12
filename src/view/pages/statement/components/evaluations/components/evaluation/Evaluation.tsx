import { Statement } from "delib-npm";
import { FC } from "react";
import EnhancedEvaluation from "./enhancedEvaluation/EnhancedEvaluation";
import SimpleEvaluation from "./simpleEvaluation/SimpleEvaluation";

interface EvaluationProps {
	parentStatement: Statement | undefined;
	statement: Statement;
}

const Evaluation: FC<EvaluationProps> = ({ parentStatement, statement }) => {

	try {
		if (!parentStatement) throw new Error('parentStatement is not defined');

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
	} catch (error) {
		console.error(error);
		
return null;
	}
};

export default Evaluation;
