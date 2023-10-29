import { FC, useEffect, useState, useRef } from 'react'
import { Statement } from 'delib-npm';
import { setEvaluation } from '../../../../../functions/db/evaluation/setEvaluation';
import { useAppDispatch, useAppSelector } from '../../../../../functions/hooks/reduxHooks';
import { evaluationSelector } from '../../../../../model/evaluations/evaluationsSlice';

// import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { setStatementElementHight } from '../../../../../model/statements/statementsSlice';
import StatementChatIcon from '../StatementChatMore';
import StatementChatSetOption from '../StatementChatSetOption';
import Text from '../../../../components/text/Text';
import Edit from '../../../../components/edit/Edit';

//images
import ThumbDown from '../../../../../assets/voteDown.svg';
import ThumbUp from '../../../../../assets/voteUp.svg';




interface Props {
    statement: Statement;
    showImage: Function;
    top: number;
}



const StatementOptionCard: FC<Props> = ({ statement, top }) => {
    const dispatch = useAppDispatch();
    const evaluation = useAppSelector(evaluationSelector(statement.statementId))
    // const order = useAppSelector(statementOrderSelector(statement.statementId))
    const elementRef = useRef<HTMLDivElement>(null);

    const [show, setShow] = useState(false)
    const [newTop, setNewTop] = useState(top);

    const { isOption } = statement;

    useEffect(() => {

        setNewTop(top);

    }, [top]);

    useEffect(() => {

        dispatch(setStatementElementHight({ statementId: statement.statementId, height: elementRef.current?.clientHeight }))

    }, [])

    //get element height

    return (
        <>
            <div
                className="options__card"
                style={{ top: `${newTop}px` }}
                ref={elementRef}
            >
                <div className="options__card__main">


                    <div className='options__card__text text' onClick={() => setShow(!show)}>
                        <Text text={statement.statement} />
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

                    <StatementChatSetOption statement={statement} />
                    <Edit statement={statement} />

                </div> : null}
                <div className="options__card__chat">
                    <StatementChatIcon statement={statement} />
                </div>

            </div>

        </>
    )
}

interface ThumbsProps {
    evaluation: number
    upDown: "up" | "down";
    statement: Statement
}

const Thumbs: FC<ThumbsProps> = ({ evaluation, upDown, statement }) => {
    if (upDown === "up") {
        if (evaluation > 0) {
            return (
                <div className="icon" onClick={() => setEvaluation(statement, 0)} >
                    <img src={ThumbUp} alt="vote up" />
                </div>
            )
        } else {
            return <div className="icon" style={{ opacity: 0.5 }} onClick={() => setEvaluation(statement, 1)}> <img src={ThumbUp} alt="vote up" /></div>
        }
    }
    else {
        if (evaluation < 0) {
            return (<div className="icon" onClick={() => setEvaluation(statement, 0)} ><img src={ThumbDown} alt="vote down" /></div>)
        }
        else {
            return <div className="icon" style={{ opacity: 0.5 }} onClick={() => setEvaluation(statement, -1)} ><img src={ThumbDown} alt="vote down" /></div>
        }

    }
}

export default StatementOptionCard;