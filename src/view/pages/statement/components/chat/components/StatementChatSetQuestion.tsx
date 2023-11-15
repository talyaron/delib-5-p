import { Statement } from 'delib-npm';
import {FC} from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { updateIsQuestion } from '../../../../../../functions/db/statements/setStatments';

interface Props {
    statement: Statement;
}



const StatementChatSetQuestion:FC<Props> = ({statement}) => {

    function handleSetQuestion(){
        updateIsQuestion(statement);
    }
    
  return (
    <div className='clickable' onClick={handleSetQuestion}><HelpOutlineIcon htmlColor={statement.isQuestion?'blue':'lightgray'}/></div>
  )
}

export default StatementChatSetQuestion