import { FC } from "react";
import SimpleEvaluation from "./simpleEvaluation/SimplEvaluation";
import { Statement } from "delib-npm";
import EnhancedEvaluation from "./enhancedEvaluation/EnhancedEvaluation";

interface EvaluationProps {
    parentStatement: Statement;
    statement: Statement;
    displayScore?: boolean;
}

const Evaluation: FC<EvaluationProps> = ({parentStatement, statement, displayScore }) => {
    return (
        <>
            {parentStatement.statementSettings?.enhancedEvaluation ? (
                <EnhancedEvaluation statement={statement} />
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
