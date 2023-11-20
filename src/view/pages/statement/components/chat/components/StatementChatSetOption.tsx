import {FC} from 'react'
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Statement, StatementSubscription } from 'delib-npm';
import { setStatementisOption } from '../../../../../../functions/db/statements/setStatments';
import { useAppSelector } from '../../../../../../functions/hooks/reduxHooks';
import { statementSelector, statementSubscriptionSelector } from '../../../../../../model/statements/statementsSlice';
import { store } from '../../../../../../model/store';
import { isAuthorized } from '../../../../../../functions/general/helpers';

interface Props {
    statement: Statement
}

const StatementChatSetOption:FC<Props> = ({statement}) => {
 
  const statementSubscription:StatementSubscription|undefined = useAppSelector(statementSubscriptionSelector(statement.statementId));

  function handleSetOption(){
    try {

      if(statement.isOption){
        const cancelOption = window.confirm('Are you sure you want to cancel this option?');
        if(cancelOption){
          setStatementisOption(statement);
        }
      }else{
        setStatementisOption(statement);
      }
    
    } catch (error) {
      console.error(error);
    }
  }
  const _isAuthrized = isAuthorized(statement, statementSubscription)
  if(!_isAuthrized) return null;  
  return (
    <div className='clickable' onClick={handleSetOption}> <LightbulbIcon htmlColor={statement.isOption?'orange':'lightgray'}/></div>
  )
}

export default StatementChatSetOption;