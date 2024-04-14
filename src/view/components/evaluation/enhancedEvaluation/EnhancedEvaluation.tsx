import { Statement } from "delib-npm";
import { FC } from "react";
import styles from "./EnhancedEvaluation.module.scss";

import { setEvaluationToDB } from "../../../../functions/db/evaluation/setEvaluation";
import { useAppSelector } from "../../../../functions/hooks/reduxHooks";
import { evaluationSelector } from "../../../../model/evaluations/evaluationsSlice";
import {
    enhancedEvaluationsThumbs,
    EnhancedEvaluationThumbs,
} from "./EnhancedEvaluationModel";
import { evlaluationToIcon } from "./EnhancedEvaluationCont";

interface EnhancedEvaluationProps {
    statement: Statement;
}

const EnhancedEvaluation: FC<EnhancedEvaluationProps> = ({ statement }) => {
    const evaluation = useAppSelector(
        evaluationSelector(statement.statementId),
    );

    console.log(Math.round(statement.consensus*1000)/1000)

    if (evaluation === undefined) {
        const _enhancedEvaluationsThumbs = [
            enhancedEvaluationsThumbs[0],
            enhancedEvaluationsThumbs[enhancedEvaluationsThumbs.length - 1],
        ];

        return (
            <div className={styles.box}>
                <div className={styles.container}>
                    {_enhancedEvaluationsThumbs.map((evl, i) => (
                        <EvaluationThumb
                            key={i}
                            evl={evl}
                            evaluation={evaluation || 0}
                            statement={statement}
                        />
                    ))}
                  
                </div>
                <div className={styles.evaluation} style={{color:statement.consensus<0?"red":'black'}}>{Math.round(statement.consensus*100)/100}</div>
            </div>
        );
    }

    return (
        <div className={styles.box}>
            <div className={styles.container}>
                {enhancedEvaluationsThumbs.map((evl, i) => (
                    <EvaluationThumb
                        key={i}
                        evl={evl}
                        evaluation={evaluation}
                        statement={statement}
                    />
                ))}
               
            </div>
            <div className={styles.evaluation} style={{color:statement.consensus<0?"red":'black'}}>{Math.round(statement.consensus*100)/100}</div>
        </div>
    );
};

export default EnhancedEvaluation;

interface ThumbProps {
    statement: Statement;
    evaluation: number;
    evl: EnhancedEvaluationThumbs;
}
function EvaluationThumb({ evl, evaluation, statement }: ThumbProps) {
    function handleSetEvaluation(evaluation: number) {
        setEvaluationToDB(statement, evaluation);
    }
    return (
        <button
            onClick={() => handleSetEvaluation(evl.evaluation)}
            style={{
                backgroundColor: evl.color,
                opacity:
                    evl.id ===
                    evlaluationToIcon(evaluation, enhancedEvaluationsThumbs)
                        ? 1
                        : 0.8,
            }}
            className={`${styles.item} ${evl.id === evlaluationToIcon(evaluation, enhancedEvaluationsThumbs) ? styles.active : ""}`}
        >
            <img src={evl.svg} alt="like" />
        </button>
    );
}
