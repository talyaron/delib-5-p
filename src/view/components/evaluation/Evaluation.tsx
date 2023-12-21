import { FC, useEffect, useState } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Custom components
import Thumbs from "../thumbs/Thumbs";

// Redux Store
import { useAppSelector } from "../../../functions/hooks/reduxHooks";

// Stetement helpers
import { evaluationSelector } from "../../../model/evaluations/evaluationsSlice";
import { isOptionFn } from "../../../functions/general/helpers";

// Style
import styles from "./Evaluation.module.scss";

// Custom Hooks
import useDirection from "../../../functions/hooks/useDirection";

interface Props {
    statement: Statement;
}

const Evaluation: FC<Props> = ({ statement }) => {
    const isOption = isOptionFn(statement);
    const direction = useDirection();

    const initContVote = statement.con ? statement.con : 0;
    const initProVote = statement.pro ? statement.pro : 0;

    const [conVote, setConVote] = useState(initContVote);
    const [proVote, setProVote] = useState(initProVote);

    const evaluation = useAppSelector(
        evaluationSelector(statement.statementId)
    );

    const { consensus: _consensus } = statement;
    const consensus = _consensus ? Math.round(_consensus * 100) / 100 : 0;

    useEffect(() => {
        setConVote(initContVote);
        setProVote(initProVote);
    }, [statement.con, statement.pro]);

    return (
        <div className={styles.evaluation}>
            <div
                className="options__card__more__vote"
                style={{ flexDirection: direction }}
            >
                <div
                    className="options__card__more__vote__down"
                    style={{ flexDirection: direction }}
                >
                    <span>{conVote}</span>
                    {isOption && (
                        <Thumbs
                            evaluation={evaluation}
                            upDown="down"
                            statement={statement}
                            setConVote={setConVote}
                            setProVote={setProVote}
                        />
                    )}
                </div>
                <div
                    className="options__card__more__vote__up"
                    style={{ flexDirection: direction }}
                >
                    {isOption && (
                        <Thumbs
                            evaluation={evaluation}
                            upDown="up"
                            statement={statement}
                            setProVote={setProVote}
                            setConVote={setConVote}
                        />
                    )}
                    <span>{proVote}</span>
                </div>
            </div>
            <div className={styles.consensus}>{consensus}</div>
        </div>
    );
};

export default Evaluation;
