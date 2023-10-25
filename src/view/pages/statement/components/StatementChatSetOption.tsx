import {FC} from 'react'
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Statement } from 'delib-npm';
import { setStatementisOption } from '../../../../functions/db/statements/setStatments';
import { auth } from '../../../../functions/db/auth';
import { useAppSelector } from '../../../../functions/hooks/reduxHooks';
import { statementSelector } from '../../../../model/statements/statementsSlice';

interface Props {
    statement: Statement
}

const StatementChatSetOption:FC<Props> = ({statement}) => {
  const parentStatement = useAppSelector(statementSelector(statement.parentId));

  function handleSetOption(){
    try {
      const user = auth.currentUser;
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
    <div className="icon" onClick={handleSetOption}> <LightbulbIcon htmlColor={statement.isOption?'orange':'lightgray'}/></div>
  )
}

export default StatementChatSetOption;