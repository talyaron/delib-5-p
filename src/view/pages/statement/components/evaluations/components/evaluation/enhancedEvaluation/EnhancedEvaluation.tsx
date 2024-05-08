import { Statement } from "delib-npm";
import { FC, useState } from "react";

import { setEvaluationToDB } from "../../../../../../../../controllers/db/evaluation/setEvaluation";
import { useAppSelector } from "../../../../../../../../controllers/hooks/reduxHooks";
import { evaluationSelector } from "../../../../../../../../model/evaluations/evaluationsSlice";
import { EnhancedEvaluationThumb } from "./EnhancedEvaluationModel";
import {
    getEvaluationThumbIdByScore,
    getEvaluationThumbsToDisplay,
} from "../../../statementEvaluationCont";
import "./EnhancedEvaluation.scss";

interface EnhancedEvaluationProps {
    statement: Statement;
    shouldDisplayScore?: boolean;
}

const EnhancedEvaluation: FC<EnhancedEvaluationProps> = ({
    statement,
    shouldDisplayScore,
}) => {
    const evaluationScore = useAppSelector(
        evaluationSelector(statement.statementId),
    );
    const {totalEvaluators} = statement;

    const [isEvaluationPanelOpen, setIsEvaluationPanelOpen] = useState(false);

    const evaluationsThumbs = getEvaluationThumbsToDisplay({
        evaluationScore,
        isEvaluationPanelOpen,
    });

    const roundedEvaluationScore = Math.round(statement.consensus * 100) / 100;

    return (
        <div className="enhanced-evaluation">
            <div
                className="evaluation-thumbs"
                onClick={() => {
                    setIsEvaluationPanelOpen(!isEvaluationPanelOpen);
                }}
            >
                {evaluationsThumbs.map((evaluationThumb) => (
                    <EvaluationThumb
                        key={evaluationThumb.id}
                        evaluationThumb={evaluationThumb}
                        evaluationScore={evaluationScore || 0}
                        statement={statement}
                        isEvaluationPanelOpen={isEvaluationPanelOpen}
                    />
                ))}
            </div>
            {shouldDisplayScore && (
                <div
                    className={`evaluation-score ${statement.consensus < 0 ? "negative" : ""}`}
                >
                    {roundedEvaluationScore} 
                    {totalEvaluators && totalEvaluators > 0 && <span className="total-evaluators">{" "}({totalEvaluators})</span>}
                  
                </div>
            )}
        </div>
    );
};

export default EnhancedEvaluation;

interface EvaluationThumbProps {
    statement: Statement;
    evaluationScore: number | undefined;
    evaluationThumb: EnhancedEvaluationThumb;
    isEvaluationPanelOpen: boolean;
}

const EvaluationThumb: FC<EvaluationThumbProps> = ({
    evaluationThumb,
    evaluationScore = 0,
    statement,
    isEvaluationPanelOpen,
}) => {
    const handleSetEvaluation = (): void => {
        if (isEvaluationPanelOpen) {
            setEvaluationToDB(statement, evaluationThumb.evaluation);
        }
    };

    const isThumbActive =
        evaluationThumb.id === getEvaluationThumbIdByScore(evaluationScore);

    return (
        <button
            className={`evaluation-thumb ${isThumbActive ? "active" : ""}`}
            style={{ backgroundColor: evaluationThumb.color }}
            onClick={handleSetEvaluation}
        >
            <img src={evaluationThumb.svg} alt={evaluationThumb.alt} />
        </button>
    );
};
