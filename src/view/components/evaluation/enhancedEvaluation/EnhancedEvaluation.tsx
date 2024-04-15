import { Statement } from "delib-npm";
import { FC, useState } from "react";
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
    displayScore?: boolean;
}

const EnhancedEvaluation: FC<EnhancedEvaluationProps> = ({
    statement,
    displayScore,
}) => {
    const evaluation = useAppSelector(
        evaluationSelector(statement.statementId),
    );

    const [evalPanelClose, setEvalPanelClose] = useState(true);

    if (evaluation === undefined && evalPanelClose) {
        const _enhancedEvaluationsThumbs = [
            enhancedEvaluationsThumbs[0],
            enhancedEvaluationsThumbs[enhancedEvaluationsThumbs.length - 1],
        ];

        return (
            <div className={styles.box}>
                <div
                    className={styles.container}
                    onClick={() => {
                        setEvalPanelClose(false);
                    }}
                >
                    {_enhancedEvaluationsThumbs.map((evl, i) => (
                        <EvaluationThumb
                            key={i}
                            evl={evl}
                            evaluation={evaluation || 0}
                            statement={statement}
                            press={false}
                        />
                    ))}
                </div>
                <div
                    className={styles.evaluation}
                    style={{ color: statement.consensus < 0 ? "red" : "black" }}
                >
                    {Math.round(statement.consensus * 100) / 100}
                </div>
            </div>
        );
    }

    if (evalPanelClose) {
        const evaluatedThumbId: string = evlaluationToIcon(
            evaluation,
            enhancedEvaluationsThumbs,
        );
        const evaluatedThumb: EnhancedEvaluationThumbs =
            enhancedEvaluationsThumbs.find(
                (evl) => evl.id === evaluatedThumbId,
            ) || enhancedEvaluationsThumbs[2];

        return (
            <div
                className={styles.box}
                onClick={() => setEvalPanelClose(false)}
            >
                <div className={styles.container}>
                    {[evaluatedThumb].map((evl, i) => (
                        <EvaluationThumb
                            key={i}
                            evl={evl}
                            evaluation={evaluation || 0}
                            statement={statement}
                        />
                    ))}
                </div>
                {displayScore && (
                    <div
                        className={styles.evaluation}
                        style={{
                            color: statement.consensus < 0 ? "red" : "black",
                        }}
                    >
                        {Math.round(statement.consensus * 100) / 100}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.box}>
            <div
                className={styles.container}
                onClick={() => setEvalPanelClose(true)}
            >
                {enhancedEvaluationsThumbs.map((evl, i) => (
                    <EvaluationThumb
                        key={i}
                        evl={evl}
                        evaluation={evaluation}
                        statement={statement}
                    />
                ))}
            </div>
            <div
                className={styles.evaluation}
                style={{ color: statement.consensus < 0 ? "red" : "black" }}
            >
                {Math.round(statement.consensus * 100) / 100}
            </div>
        </div>
    );
};

export default EnhancedEvaluation;

interface ThumbProps {
    statement: Statement;
    evaluation: number | undefined;
    evl: EnhancedEvaluationThumbs;
    press?: boolean;
}
function EvaluationThumb({
    evl,
    evaluation = 0,
    statement,
    press,
}: ThumbProps) {
    function handleSetEvaluation(evaluation: number) {
        setEvaluationToDB(statement, evaluation);
    }
    return (
        <button
            onClick={() => {
                if (press !== false) {
                    handleSetEvaluation(evl.evaluation);
                }
            }}
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
