import { FC, useEffect, useState } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Custom components
import Thumb from "../../../../../../../components/thumb/Thumb";

// Redux Store
import { useAppSelector } from "../../../../../../../../controllers/hooks/reduxHooks";

// Statement helpers
import { evaluationSelector } from "../../../../../../../../model/evaluations/evaluationsSlice";

// Custom Hooks
import useDirection from "../../../../../../../../controllers/hooks/useDirection";

//css
import styles from "./SimpleEvaluation.module.scss";

interface Props {
    statement: Statement;
    shouldDisplayScore?: boolean;
}

const SimpleEvaluation: FC<Props> = ({
    statement,
    shouldDisplayScore = true,
}) => {
    const direction = useDirection();

    const initContVote = statement.con ? statement.con : 0;
    const initProVote = statement.pro ? statement.pro : 0;

    const [conVote, setConVote] = useState(initContVote);
    const [proVote, setProVote] = useState(initProVote);

    const evaluation = useAppSelector(
        evaluationSelector(statement.statementId),
    );

    const { consensus } = statement;
    const consensusToDisplay = consensus
        ? Math.round(consensus * 100) / 100
        : 0;

    useEffect(() => {
        setConVote(initContVote);
        setProVote(initProVote);
    }, [statement.con, statement.pro]);

    return (
        <div className="evaluation">
            <div
                className="evaluation__box"
                style={{ flexDirection: direction }}
            >
                {shouldDisplayScore && <span>{conVote}</span>}
                <div className="evaluation__box__icon">
                    <Thumb
                        evaluation={evaluation || 0}
                        upDown="down"
                        statement={statement}
                        setConVote={setConVote}
                        setProVote={setProVote}
                    />
                </div>
                <div className="evaluation__box__icon">
                    <Thumb
                        evaluation={evaluation || 0}
                        upDown="up"
                        statement={statement}
                        setProVote={setProVote}
                        setConVote={setConVote}
                    />
                </div>
                {shouldDisplayScore && <span>{proVote}</span>}
            </div>
            {shouldDisplayScore && (
                <div className={styles.totalEvaluations}>
                    {consensusToDisplay}
                </div>
            )}
        </div>
    );
};

export default SimpleEvaluation;
