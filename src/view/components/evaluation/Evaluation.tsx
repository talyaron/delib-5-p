import { FC } from "react";
import SimpleEvaluation from "./simpleEvaluation/SimplEvaluation";
import { Statement } from "delib-npm";
import EnhancedEvaluation from "./enhancedEvaluation/EnhancedEvaluation";

interface EvaluationProps {
    parentStatement: Statement;
    statement: Statement;
    
}

const Evaluation: FC<EvaluationProps> = ({parentStatement, statement }) => {
    const displayScore = parentStatement.statementSettings?.showEvaluation || false;
    return (
        <>
            {parentStatement.statementSettings?.enhancedEvaluation ? (
                <EnhancedEvaluation statement={statement} displayScore={displayScore} />
            ) : (
                <SimpleEvaluation
                    statement={statement}
                    displayScore={displayScore}
                />
            )}
        </>
    );
};

export default Evaluation;
