import { FC } from "react";

// Icons
import ChatIcon from "../../../../../../assets/icons/roundedChatDotIcon.svg?react";

// Statements functions
import { statementSubscriptionSelector } from "../../../../../../model/statements/statementsSlice";

// Third party
import { Statement, StatementSubscription, StatementType } from "delib-npm";
import { useNavigate } from "react-router-dom";

// Redux
import { useAppSelector } from "../../../../../../functions/hooks/reduxHooks";

// Helpers
import { statementTitleToDisplay } from "../../../../../../functions/general/helpers";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

import styles from "./StatementChatMore.module.scss";

interface Props {
    statement: Statement;
    page?: any;
    color?: string;
}

const StatementChatMore: FC<Props> = ({ statement }) => {
    // Hooks
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Redux store
    const statementSubscription: StatementSubscription | undefined =
        useAppSelector(statementSubscriptionSelector(statement.statementId));

    // Variables
    const messagesRead = statementSubscription?.totalSubStatementsRead || 0;
    const messages = statement.totalSubStatements || 0;

    const { statementType } = statement;
    if (statementType === StatementType.statement) return;

    const messageToDisplay = statement.lastMessage
        ? statementTitleToDisplay(statement.lastMessage, 20).shortVersion
        : t("Conversations");

    return (
        <div
            className={styles.statementChatMore}
            onClick={() =>
                navigate(`/statement/${statement.statementId}/chat`, {
                    state: { from: window.location.pathname },
                })
            }
        >
            <div className={styles.icon}>
                {messages - messagesRead > 0 && (
                    <div className="redCircle">
                        {messages - messagesRead < 10
                            ? messages - messagesRead
                            : `9+`}
                    </div>
                )}
                <ChatIcon />
            </div>
            <div className={styles.text}>{messageToDisplay}</div>
        </div>
    );
};

export default StatementChatMore;
