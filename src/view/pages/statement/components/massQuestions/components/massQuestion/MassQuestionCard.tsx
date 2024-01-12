import { Statement, StatementSubscription } from "delib-npm";
import React, { FC, useEffect, useState } from "react";
import styles from "./MassQuestion.module.scss";
import { handleSetQuestionFromMassCard } from "./MassQuestionCardCont";
import { listenToUserAnswer } from "../../../../../../../functions/db/statements/getStatement";
import { t } from "i18next";
import EditTitle from "../../../../../../components/edit/EditTitle";
import SetEdit from "../../../../../../components/edit/SetEdit";
import { isAuthorized } from "../../../../../../../functions/general/helpers";
import { useAppSelector } from "../../../../../../../functions/hooks/reduxHooks";
import { statementSubscriptionSelector } from "../../../../../../../model/statements/statementsSlice";

interface Props {
    statement: Statement;
    setAnswerd: React.Dispatch<React.SetStateAction<boolean[]>>;
    index: number;
}

const MassQuestionCard: FC<Props> = ({ statement, setAnswerd, index }) => {
    const statementSubscription: StatementSubscription | undefined =
        useAppSelector(statementSubscriptionSelector(statement.statementId));

    const [answer, setAnswer] = useState<Statement | null>(null);
    const [isEdit, setEdit] = useState(false);
    useEffect(() => {
        setAnswerd((answerd: boolean[]) => {
            const _answerd = [...answerd];
            _answerd[index] = answer ? true : false;

            return _answerd;
        });
    }, [answer]);

    useEffect(() => {
        let usub: () => void;
        listenToUserAnswer(statement.statementId, setAnswer).then((uns) => {
            usub = uns;
        });

        return () => {
            usub();
        };
    }, []);

    return (
        <div className={styles.card}>
            <div className={styles.title}>
                <SetEdit
                    isAuthrized={isAuthorized(statement, statementSubscription)}
                    setEdit={setEdit}
                    edit={isEdit}
                />

                <h3>
                    <EditTitle
                        statement={statement}
                        isEdit={isEdit}
                        setEdit={setEdit}
                        onlyTitle={true}
                    />
                </h3>
            </div>
            <label>{t("Answer")}:</label>
            <textarea
                onBlur={(ev: any) => {
                    handleSetQuestionFromMassCard({
                        question: statement,
                        answer,
                        text: ev.target.value,
                    });
                }}
                onKeyUp={(ev: any) => {
                    if (ev.key === "Enter" && !ev.shiftKey) {
                        handleSetQuestionFromMassCard({
                            question: statement,
                            answer,
                            text: ev.target.value,
                        });
                    }
                }}
                className={styles.answer}
                placeholder="תשובה"
                defaultValue={answer?.statement}
                name="answer"
                id="answer"
            />
        </div>
    );
};

export default MassQuestionCard;
