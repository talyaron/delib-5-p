import {FC} from 'react'
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Statement } from 'delib-npm';
import { setStatementisOption } from '../../../../functions/db/statements/setStatments';
import { useAppSelector } from '../../../../functions/hooks/reduxHooks';
import { statementSelector } from '../../../../model/statements/statementsSlice';
import { store } from '../../../../model/store';

interface Props {
    statement: Statement
}

const StatementChatSetOption:FC<Props> = ({statement}) => {
  const parentStatement = useAppSelector(statementSelector(statement.parentId));

  function handleSetOption(){
    try {
      const user = store.getState().user.user;
      const statementsManagerId = parentStatement?.creatorId;
      const statementManagerId = statement.creatorId;
      if(user?.uid === statementsManagerId || user?.uid === statementManagerId || !statement.isOption){
        setStatementisOption(statement);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className='clickable' onClick={handleSetOption}> <LightbulbIcon htmlColor={statement.isOption?'orange':'lightgray'}/></div>
  )
}

export default StatementChatSetOption;