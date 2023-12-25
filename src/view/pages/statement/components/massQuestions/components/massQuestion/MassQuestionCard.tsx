import { Statement } from "delib-npm";
import { FC } from "react";
import styles from "./MassQuestion.module.scss";
import { handleSetQuestionFromMassCard } from "./MassQuestionCardCont";

interface Props {
    statement: Statement;
    answers: Statement[];
    index: number;
}

const MassQuestionCard: FC<Props> = ({ statement, index, answers }) => {
    return (
        <div className={styles.card}>
            <p>{statement.statement}</p>
            <textarea
                onBlur={(ev: any) =>
                    handleSetQuestionFromMassCard(
                        statement,
                        ev.target.value,
                        answers,
                        index
                    )
                }
                className={styles.answer}
                placeholder="תשובה"
                name="answer"
                id="answer"
            />
        </div>
    );
};

export default MassQuestionCard;
