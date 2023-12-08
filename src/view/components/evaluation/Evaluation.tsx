import { FC } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Custom components
import Thumbs from "../thumbs/Thumbs";

// Redux Store

// Stetement helpers

import { isOptionFn } from "../../../functions/general/helpers";

// Style
import styles from "./Evaluation.module.scss";

// Custom Hooks
import useDirection from "../../../functions/hooks/useDirection";

interface Props {
    statement: Statement;
}

const Evaluation: FC<Props> = ({ statement }) => {
    const { con, pro } = statement;

    const isOption = isOptionFn(statement);
    const direction = useDirection();

    const { consensus: _consensus } = statement;
    const consensus = _consensus ? Math.round(_consensus * 100) / 100 : 0;

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
                    <span>{con}</span>
                    {isOption && (
                        <Thumbs statement={statement} upDown={"down"} />
                    )}
                </div>
                <div
                    className="options__card__more__vote__up"
                    style={{ flexDirection: direction }}
                >
                    {isOption && <Thumbs statement={statement} upDown={"up"} />}
                    <span>{pro}</span>
                </div>
            </div>
            <div className={styles.consensus}>{consensus}</div>
        </div>
    );
};

export default Evaluation;
