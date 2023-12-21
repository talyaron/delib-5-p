import {FC} from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface Props {
    isAuthrized: boolean;
    setEdit: Function;
    edit:boolean
}

const StatementChatSetEdit:FC<Props> = ({isAuthrized,setEdit, edit}) => {
  return (
    <div>
        {isAuthrized && <div className='clickable' onClick={()=>setEdit(!edit)}><ModeEditIcon htmlColor={edit?'blue':'lightgray'}/></div>}
    </div>
  )
}

export default StatementChatSetEdit