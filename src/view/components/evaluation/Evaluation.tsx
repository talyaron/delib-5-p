import { FC } from "react";
import SimpleEvaluation from "./simpleEvaluation/SimplEvaluation";
import { Statement } from "delib-npm";

interface EvaluationProps {
    parentStatement: Statement;
    statement: Statement;
    displayScore?: boolean;
}

const Evaluation: FC<EvaluationProps> = ({parentStatement, statement, displayScore }) => {
    return (
        <>
            {parentStatement.statementSettings?.enhancedEvaluation ? (
                <div>Advanced Evlaution...</div>
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
