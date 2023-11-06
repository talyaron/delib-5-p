import { FC } from 'react';
import ChatIcon from '../../../../assets/chat.svg';
import { setStatmentGroupToDB } from '../../../../functions/db/statements/setStatments';
import { Statement, StatementSubscription, StatementType } from 'delib-npm';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../functions/hooks/reduxHooks';
import { statementSubscriptionSelector } from '../../../../model/statements/statementsSlice';

interface Props {
    statement: Statement
    page?: any;
    hasChildren: boolean;
}

const StatementChatMore: FC<Props> = ({ statement, page,hasChildren }) => {
    const statementSubscription: StatementSubscription | undefined = useAppSelector(statementSubscriptionSelector(statement.statementId))
    let messagesRead = 0;
    if (statementSubscription) messagesRead = statementSubscription.totalSubStatementsRead || 0;
    const messages = statement.totalSubStatements || 0;
    
    const navigate = useNavigate();
    if (statement.hasChildren === false) return null;

    if(!hasChildren) return null;

    return (
        <div className="more clickable" onClick={() => handleCreateSubStatements(statement, navigate, page)}>
            <div className="icon">
                {statement.type === StatementType.GROUP && (messages - messagesRead) > 0 ? <div className="redCircle">
                    {messages - messagesRead < 10 ? messages - messagesRead : `9+`}
                </div> : null}
                <img src={ChatIcon} alt="chat icon" style={{ opacity: statement.totalSubStatements && statement.totalSubStatements > 0 ? 1 : 0.5 }} />
            </div>
            <div className='text'>{statement.lastMessage ? statement.lastMessage : "שיחות..."}</div>
        </div>
    )
}

export default StatementChatMore;

export function handleCreateSubStatements(statement: Statement, navigate: Function, page?: any) {
    try {
        if (!page) {
            setStatmentGroupToDB(statement);
            navigate(`/home/statement/${statement.statementId}`)
            return
        }

        page.classList.add('page--anima__forwardOutScreen');
        page.onanimationend = () => {
            setStatmentGroupToDB(statement);

            page.classList.remove('page--anima__forwardOutScreen');
            navigate(`/home/statement/${statement.statementId}`)
        }
    } catch (error) {
        console.error(error);
    }



}