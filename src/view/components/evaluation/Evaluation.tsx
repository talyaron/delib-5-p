import { Statement } from "delib-npm";
import { FC } from "react";
import Thumbs from "../thumbs/Thumbs";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { evaluationSelector } from "../../../model/evaluations/evaluationsSlice";
import { isOptionFn } from "../../../functions/general/helpers";
import styles from "./Evaluation.module.scss";
import useDirection from "../../../functions/hooks/useDirection";

interface Props {
    statement: Statement;
}

const Evaluation: FC<Props> = ({ statement }) => {
    const isOption = isOptionFn(statement);
    const direction = useDirection();

    const evaluation = useAppSelector(
        evaluationSelector(statement.statementId)
    );
    const { consensus: _consensus } = statement;
    const consensus = _consensus ? Math.round(_consensus * 100) / 100 : 0;

    const direction =
        document.body.style.direction === "rtl" ? "row" : "row-reverse"

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
                    <span>{statement.con ? statement.con : 0}</span>
                    {isOption && (
                        <Thumbs
                            evaluation={evaluation}
                            upDown="down"
                            statement={statement}
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
                        />
                    )}
                    <span>{statement.pro ? statement.pro : 0}</span>
                </div>
            </div>
            <div className={styles.consensus}>{consensus}</div>
        </div>
    );
};

export default Evaluation;
