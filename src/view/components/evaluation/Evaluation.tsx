import { Statement } from 'delib-npm'
import {FC} from 'react'
import Thumbs from '../thumbs/Thumbs';

interface Props {
    statement:Statement,
    evaluation:number
}

const Evaluation:FC<Props> = ({statement, evaluation}) => {
    const {isOption} = statement;
  return (
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
  )
}

export default Evaluation