import { FC, useEffect, useState } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Custom components
import Thumbs from "../thumbs/Thumbs";

// Redux Store
import { useAppSelector } from "../../../functions/hooks/reduxHooks";

// Stetement helpers
import { evaluationSelector } from "../../../model/evaluations/evaluationsSlice";

// Custom Hooks
import useDirection from "../../../functions/hooks/useDirection";

//css
import styles from "./Evaluation.module.scss";

interface Props {
    statement: Statement;
    displayScore?: boolean;
}

const Evaluation: FC<Props> = ({ statement, displayScore = true }) => {
    const direction = useDirection();

    const initContVote = statement.con ? statement.con : 0;
    const initProVote = statement.pro ? statement.pro : 0;

    const [conVote, setConVote] = useState(initContVote);
    const [proVote, setProVote] = useState(initProVote);

    const evaluation = useAppSelector(
        evaluationSelector(statement.statementId)
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
                {displayScore && <span>{conVote}</span>}
                <div className="evaluation__box__icon">
                    <Thumbs
                        evaluation={evaluation}
                        upDown="down"
                        statement={statement}
                        setConVote={setConVote}
                        setProVote={setProVote}
                    />
                </div>
                <div className="evaluation__box__icon">
                    <Thumbs
                        evaluation={evaluation}
                        upDown="up"
                        statement={statement}
                        setProVote={setProVote}
                        setConVote={setConVote}
                    />
                </div>
                {displayScore && <span>{proVote}</span>}
            </div>
            {displayScore && <div className={styles.totalEvaluations}>{consensusToDisplay}</div>}
        </div>
    );
};

export default Evaluation;
