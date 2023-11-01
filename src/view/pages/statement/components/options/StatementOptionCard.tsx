import { FC, useEffect, useState, useRef } from 'react'
import { Statement } from 'delib-npm';
import { useAppDispatch, useAppSelector } from '../../../../../functions/hooks/reduxHooks';
import { evaluationSelector } from '../../../../../model/evaluations/evaluationsSlice';

// import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { setStatementElementHight } from '../../../../../model/statements/statementsSlice';
import StatementChatIcon from '../StatementChatMore';
import StatementChatSetOption from '../StatementChatSetOption';
import Text from '../../../../components/text/Text';


//images

import EditTitle from '../../../../components/edit/EditTitle';
import { userSelector } from '../../../../../model/users/userSlice';
import Thumbs from '../../../../components/thumbs/Thumbs';




interface Props {
    statement: Statement;
    showImage: Function;
    top: number;
}



const StatementOptionCard: FC<Props> = ({ statement, top }) => {
    const dispatch = useAppDispatch();
    const evaluation = useAppSelector(evaluationSelector(statement.statementId))
    const user = useAppSelector(userSelector)
    // const order = useAppSelector(statementOrderSelector(statement.statementId))
    const elementRef = useRef<HTMLDivElement>(null);

    const [show, setShow] = useState(false)
    const [newTop, setNewTop] = useState(top);
    const [edit, setEdit] = useState(false);

    const { isOption } = statement;

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
                    {statement.consensus ? <div className='options__card__solution text'>{statement.consensus}</div> : null}


                </div>
                {true ? <div className="options__card__more">
                    <div className="options__card__more__vote">
                        <div className="options__card__more__vote__up">
                            <span>{statement.pro ? statement.pro : 0}</span>
                            {isOption ? <Thumbs evaluation={evaluation} upDown='up' statement={statement} /> : null}

                        </div>
                        <div className="options__card__more__vote__down">
                            {isOption ? <Thumbs evaluation={evaluation} upDown='down' statement={statement} /> : null}
                            <span>{statement.con ? statement.con : 0}</span>
                        </div>
                    </div>
                    <div className="press">
                        <StatementChatSetOption statement={statement} />
                    </div>


                </div> : null}
                <div className="options__card__chat">
                    <StatementChatIcon statement={statement} />
                </div>

            </div>

        </>
    )
}


export default StatementOptionCard;