import React, { FC, useEffect, useState } from "react";

// Third party imports
import { Statement, StatementSubscription } from "delib-npm";

// Styles
import styles from "./MassQuestion.module.scss";

// Custom Components
import { handleSetQuestionFromMassCard } from "./MassQuestionCardCont";
import EditTitle from "../../../../../../components/edit/EditTitle";
import SetEdit from "../../../../../../components/edit/SetEdit";

// db Functions
import { listenToUserAnswer } from "../../../../../../../functions/db/statements/listenToStatements";
import { isAuthorized } from "../../../../../../../functions/general/helpers";

// Redux store
import { useAppSelector } from "../../../../../../../functions/hooks/reduxHooks";
import { statementSubscriptionSelector } from "../../../../../../../model/statements/statementsSlice";
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";

interface Props {
    statement: Statement;
    setAnswered: React.Dispatch<React.SetStateAction<boolean[]>>;
    index: number;
}

const MassQuestionCard: FC<Props> = ({ statement, setAnswered, index }) => {
    const { t } = useLanguage();

    const statementSubscription: StatementSubscription | undefined =
        useAppSelector(statementSubscriptionSelector(statement.statementId));

    const [answer, setAnswer] = useState<Statement | null>(null);
    const [isEdit, setEdit] = useState(false);

    useEffect(() => {
        setAnswered((answered: boolean[]) => {
            const _answered = [...answered];
            _answered[index] = answer ? true : false;

            return _answered;
        });
    }, [answer]);

    useEffect(() => {
        let usub: undefined | (() => void);
        listenToUserAnswer(statement.statementId, setAnswer).then((uns) => {
            usub = uns;
        });

        return () => {
            if (usub) usub();
        };
    }, []);

    const _isAuthorized = isAuthorized(statement, statementSubscription);

    return (
        <div className={styles.card}>
            <div className={styles.title}>
                <SetEdit
                    isAuthorized={_isAuthorized}
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
