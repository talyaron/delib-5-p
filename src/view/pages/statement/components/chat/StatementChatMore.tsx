import { FC } from "react";

// Icons
import ChatIcon from "../../../../components/icons/ChatIcon";

// Statements functions
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice";

// Third party
import { Statement, StatementSubscription, StatementType } from "delib-npm";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";

// Redux
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks";

interface Props {
    statement: Statement;
    page?: any;
}

const StatementChatMore: FC<Props> = ({ statement }) => {
    const { page } = useParams();
    const statementSubscription: StatementSubscription | undefined =
        useAppSelector(statementSubscriptionSelector(statement.statementId));
    let messagesRead = 0;
    if (statementSubscription)
        messagesRead = statementSubscription.totalSubStatementsRead || 0;
    const messages = statement.totalSubStatements || 0;

    const navigate = useNavigate();


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
                <ChatIcon color={page ? "black" : "white"} />
            </div>
            <div className="text">
                {statement.lastMessage
                    ? statement.lastMessage
                    : t("Conversations")}
            </div>
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
