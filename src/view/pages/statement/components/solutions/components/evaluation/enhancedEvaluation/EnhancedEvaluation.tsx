import { Statement } from "delib-npm";
import { FC, useState } from "react";

import { setEvaluationToDB } from "@/controllers/db/evaluation/setEvaluation";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { evaluationSelector } from "@/model/evaluations/evaluationsSlice";
import {
  enhancedEvaluationsThumbs,
  EnhancedEvaluationThumb,
} from "./EnhancedEvaluationModel";
import { getEvaluationThumbIdByScore } from "../../../statementSolutionsCont";
import "./EnhancedEvaluation.scss";
import { useLanguage } from "@/controllers/hooks/useLanguages";

interface EnhancedEvaluationProps {
  statement: Statement;
  shouldDisplayScore?: boolean;
}

const EnhancedEvaluation: FC<EnhancedEvaluationProps> = ({
  statement,
  shouldDisplayScore,
}) => {
  const evaluationScore = useAppSelector(
    evaluationSelector(statement.statementId)
  );
  

  const { dir } = useLanguage();

  const [isEvaluationPanelOpen, setIsEvaluationPanelOpen] = useState(false);

  const { sumPro, sumCon, numberOfEvaluators } = statement.evaluation || {
    sumPro: 0,
    sumCon: 0,
    numberOfEvaluators: 0,
  };

  return (
    <div
      className={`enhanced-evaluation ${dir === "ltr" ? "mirrorReverse" : ""}`}
    >
      <div className="evaluation-bar">
        {shouldDisplayScore && sumCon}
        <div
          className="evaluation-thumbs"
          role="button"
          onClick={() => {
            setIsEvaluationPanelOpen(!isEvaluationPanelOpen);
          }}
        >
          {enhancedEvaluationsThumbs.map((evaluationThumb) => (
            <EvaluationThumb
              key={evaluationThumb.id}
              evaluationThumb={evaluationThumb}
              evaluationScore={evaluationScore}
              statement={statement}
            />
          ))}
        </div>
        {shouldDisplayScore && (
          <div
            className={`evaluation-score ${statement.consensus < 0 ? "negative" : ""}`}
          >
            {sumPro}
            {numberOfEvaluators && numberOfEvaluators > 0 && (
              <span className="total-evaluators"> ({numberOfEvaluators})</span>
            )}
          </div>
        )}
      </div>
	  <div className="evaluation-explain">
		{"Like <- Evaluation -> Don't-like"}
	  </div>
    </div>
  );
};

export default EnhancedEvaluation;

interface EvaluationThumbProps {
  statement: Statement;
  evaluationScore: number | undefined;
  evaluationThumb: EnhancedEvaluationThumb;
}

const EvaluationThumb: FC<EvaluationThumbProps> = ({
  evaluationThumb,
  evaluationScore,
  statement,
}) => {
  const handleSetEvaluation = (): void => {
    setEvaluationToDB(statement, evaluationThumb.evaluation);
  };

  const isThumbActive =
    evaluationScore !== undefined &&
    evaluationThumb.id === getEvaluationThumbIdByScore(evaluationScore);

  return (
    <button
      className={`evaluation-thumb ${isThumbActive ? "active" : ""}`}
      style={{
        backgroundColor: isThumbActive
          ? evaluationThumb.colorSelected
          : evaluationThumb.color,
      }}
      onClick={handleSetEvaluation}
    >
      <img src={evaluationThumb.svg} alt={evaluationThumb.alt} />
    </button>
  );
};
