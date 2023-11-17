import { FC } from "react"
import ChatIcon from "../../../../assets/chat.svg"
import { setStatmentGroupToDB } from "../../../../functions/db/statements/setStatments"
import { Statement, StatementSubscription, StatementType } from "delib-npm"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../../functions/hooks/reduxHooks"
import { statementSubscriptionSelector } from "../../../../model/statements/statementsSlice"

interface Props {
    statement: Statement
    page?: any;
}

const StatementChatMore: FC<Props> = ({ statement, page }) => {
    const statementSubscription: StatementSubscription | undefined = useAppSelector(statementSubscriptionSelector(statement.statementId))
    let messagesRead = 0;
    if (statementSubscription) messagesRead = statementSubscription.totalSubStatementsRead || 0;
    const messages = statement.totalSubStatements || 0;
    
    const navigate = useNavigate();
   
    const {isOption, isQuestion} = statement;
    if(!(isOption || isQuestion)) return null;

    return (
        <div
            className="more clickable"
            onClick={() => handleCreateSubStatements(statement, navigate)}
        >
            <div className="icon">
                {statement.type === StatementType.GROUP &&
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
                {statement.lastMessage ? statement.lastMessage : "שיחות..."}
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
        setStatmentGroupToDB(statement)
        navigate(`/home/statement/${statement.statementId}`)
    } catch (error) {
        console.error(error)
    }
}
