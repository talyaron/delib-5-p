import { FC } from "react"

// Icons
import ChatIcon from "../../../../../assets/chat.svg"

// Statements functions
import { setStatmentGroupToDB } from "../../../../../functions/db/statements/setStatments"
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice"

// Third party
import { Statement, StatementSubscription, StatementType } from "delib-npm"
import { useNavigate } from "react-router-dom"
import { t } from "i18next"

// Redux
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks"

interface Props {
    statement: Statement
    page?: any
}

const StatementChatMore: FC<Props> = ({ statement }) => {
    const statementSubscription: StatementSubscription | undefined = useAppSelector(statementSubscriptionSelector(statement.statementId))
    let messagesRead = 0;
    if (statementSubscription) messagesRead = statementSubscription.totalSubStatementsRead || 0;
    const messages = statement.totalSubStatements || 0;
    
    const navigate = useNavigate();
   
    const {statementType} = statement;
    if(statementType === StatementType.statement ) return null;


    return (
        <div
            className="more clickable"
            onClick={() => handleCreateSubStatements(statement, navigate)}
        >
            <div className="icon">
                {statement.type === StatementType.statement &&
                messages - messagesRead > 0 ? (
                    <div className="redCircle">
                        {messages - messagesRead < 10
                            ? messages - messagesRead
                            : `9+`}
                    </div>
                ) : null}
                <img
                    src={ChatIcon}
                    alt="chat icon"
                    style={{
                        opacity:
                            statement.totalSubStatements &&
                            statement.totalSubStatements > 0
                                ? 1
                                : 0.5,
                    }}
                />
            </div>
            <div className="text">
                {statement.lastMessage
                    ? statement.lastMessage
                    : t("Conversations")}
            </div>
        </div>
    )
}

export default StatementChatMore

export function handleCreateSubStatements(
    statement: Statement,
    navigate: Function
) {
    try {
        // setStatmentGroupToDB(statement)
        navigate(`/home/statement/${statement.statementId}/chat`, {
            state: { from: window.location.pathname },
        })
    } catch (error) {
        console.error(error)
    }
}
