import { FC } from "react";
import SimpleEvaluation from "./simpleEvaluation/SimplEvaluation";
import { Statement } from "delib-npm";
import EnhancedEvaluation from "./enhancedEvaluation/EnhancedEvaluation";

interface EvaluationProps {
    parentStatement: Statement;
    statement: Statement;
}

const Evaluation: FC<EvaluationProps> = ({ parentStatement, statement }) => {
    const shouldDisplayScore =
        parentStatement.statementSettings?.showEvaluation || false;

    const props = {
        statement,
        shouldDisplayScore,
    } as const;

    if (parentStatement.statementSettings?.enhancedEvaluation) {
        return <EnhancedEvaluation {...props} />;
    }

    return <SimpleEvaluation {...props} />;
};

export default Evaluation;
