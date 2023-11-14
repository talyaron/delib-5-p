import { FC, useEffect, useState, useRef } from 'react'
import { Statement } from 'delib-npm';
import { useAppDispatch, useAppSelector } from '../../../../../functions/hooks/reduxHooks';

// import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { setStatementElementHight } from '../../../../../model/statements/statementsSlice';
import StatementChatMore from '../StatementChatMore';
import StatementChatSetOption from '../chat/StatementChatSetOption';
import Text from '../../../../components/text/Text';


//images

import EditTitle from '../../../../components/edit/EditTitle';
import { userSelector } from '../../../../../model/users/userSlice';
import Evaluation from '../../../../components/evaluation/Evaluation';




interface Props {
    statement: Statement;
    showImage: Function;
    top: number;
   
}



const StatementOptionCard: FC<Props> = ({ statement, top }) => {
    const dispatch = useAppDispatch();
  
    const user = useAppSelector(userSelector)
    // const order = useAppSelector(statementOrderSelector(statement.statementId))
    const elementRef = useRef<HTMLDivElement>(null);

    const [show, setShow] = useState(false)
    const [newTop, setNewTop] = useState(top);
    const [edit, setEdit] = useState(false);



    useEffect(() => {

        setNewTop(top);

    }, [top]);

    useEffect(() => {

        dispatch(setStatementElementHight({ statementId: statement.statementId, height: elementRef.current?.clientHeight }))

    }, [])

    function handleEdit() {
        if (statement.creatorId === user?.uid) setEdit(true);
    }
    

    return (
        <>
            <div
                className="options__card"
                style={{ top: `${newTop}px` }}
                ref={elementRef}
            >
                <div className="options__card__main">
                   

                    <div className='options__card__text text' onClick={() => setShow(!show)}>
                        {!edit ? <div onClick={handleEdit}><Text text={statement.statement} /></div> : <EditTitle statement={statement} setEdit={setEdit} isTextArea={true} />}
                    </div>
                    
                    <Evaluation statement={statement} />


                </div>
               
                <div className="options__card__chat">
                    <StatementChatMore statement={statement} hasChildren={true}/>
                    <div className="press">
                        <StatementChatSetOption statement={statement} />
                    </div>
                </div>

            </div>

        </>
    )
}


export default StatementOptionCard;