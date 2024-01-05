import { FC } from "react";

// Icons
import ChatIcon from "../../../../components/icons/ChatIcon";

// Statements functions
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice";

// Third party
import { Statement, StatementSubscription, StatementType } from "delib-npm";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { t } from "i18next";

// Redux
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks";
import { statementTitleToDisplay } from "../../../../../functions/general/generating";

interface Props {
    statement: Statement;
    page?: any;
    color?: string;
}

const StatementChatMore: FC<Props> = ({ statement, color }) => {
    const statementSubscription: StatementSubscription | undefined =
        useAppSelector(statementSubscriptionSelector(statement.statementId));
    let messagesRead = 0;
    if (statementSubscription)
        messagesRead = statementSubscription.totalSubStatementsRead || 0;
    const messages = statement.totalSubStatements || 0;

    const navigate = useNavigate();

    const { statementType } = statement;
    if (statementType === StatementType.statement) return null;

    const messageToDisplay = statement.lastMessage
        ? statementTitleToDisplay(statement.lastMessage, 20).shortVersion
        : t("Conversations");

    return (
        <div
            className="more clickable"
            onClick={() => handleCreateSubStatements(statement, navigate)}
        >
            <div className="icon">
                {messages - messagesRead > 0 && (
                    <div className="redCircle">
                        {messages - messagesRead < 10
                            ? messages - messagesRead
                            : `9+`}
                    </div>
                )}
                {/* <BsChatLeftText size="1.5rem" /> */}
                <ChatIcon statementType={statementType} color={color} />
            </div>
            <div className="text">{messageToDisplay}</div>
        </div>
    );
};

export default StatementChatMore;

export function handleCreateSubStatements(
    statement: Statement,
    navigate: NavigateFunction
) {
    try {
        // setStatmentGroupToDB(statement)
        navigate(`/statement/${statement.statementId}/chat`, {
            state: { from: window.location.pathname },
        });
    } catch (error) {
        console.error(error);
    }
}
