import { FC } from 'react'
import { Screen, Statement } from 'delib-npm';
import { setStatmentToDB } from '../../../functions/db/statements/setStatments';

import SendIcon from '@mui/icons-material/Send';
import { getNewStatment } from '../../../functions/general/helpers';
import { useAppSelector } from '../../../functions/hooks/reduxHooks';
import { userSelector } from '../../../model/users/userSlice';

interface Props {
    statement: Statement
}

const StatementInput: FC<Props> = ({ statement }) => {

    const user = useAppSelector(userSelector);

    function handleAddStatement(e: any) {
        try {
            if(!user) throw new Error('No user');
         
            e.preventDefault();
            const value = e.target.newStatement.value;
            //remove white spaces and \n
            const _value = value.replace(/\s+/g, ' ').trim();
            if (!_value) throw new Error('No value');

            const newStatement: Statement | undefined = getNewStatment({ value, statement, user });
            if (!newStatement) throw new Error('No statement');
            newStatement.subScreens =[Screen.CHAT, Screen.OPTIONS, Screen.VOTE];
    
            setStatmentToDB(newStatement, statement);
            e.target.reset();
        } catch (error) {
            console.error(error);
        }

    }


    function handleInput(e: any) {
        try {
            let _isMobile = false;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) _isMobile = true;

            if (e.key === 'Enter' && !e.shiftKey && !_isMobile) {

                const _value = e.target.value.replace(/\s+/g, ' ').trim();
                if (!_value) {
                    e.target.value = '';
                    return;
                };

                // submit form
                if(!user) throw new Error('No user');
              
                const newStatement: Statement | undefined = getNewStatment({ value: e.target.value, statement, user });

                if (!newStatement) throw new Error('No statement');

                newStatement.subScreens =[Screen.CHAT, Screen.OPTIONS, Screen.VOTE];
                            
                setStatmentToDB(newStatement, statement);
                e.target.value = '';
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (

        <form onSubmit={handleAddStatement} name="theForm" className="page__footer statement__input">
            <textarea name='newStatement' onKeyUp={handleInput} required autoFocus={true} />
            <button className="fav"><div><SendIcon>Submit</SendIcon></div></button>
        </form>

    )
}



export default StatementInput