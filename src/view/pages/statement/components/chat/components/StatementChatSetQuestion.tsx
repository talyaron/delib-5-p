import { Statement } from 'delib-npm';
import {FC} from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { updateIsQuestion } from '../../../../../../functions/db/statements/setStatments';
import { isOptionFn } from '../../../../../../functions/general/helpers';

interface Props {
    statement: Statement;
}



const StatementChatSetQuestion:FC<Props> = ({statement}) => {

    function handleSetQuestion(){
        updateIsQuestion(statement);
    }
    
  return (
    <div className='clickable' onClick={handleSetQuestion}><HelpOutlineIcon htmlColor={isOptionFn(statement)?'blue':'lightgray'}/></div>
  )
}

export default StatementChatSetQuestion