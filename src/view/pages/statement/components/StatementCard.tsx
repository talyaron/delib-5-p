import { FC } from 'react'

import { Link } from 'react-router-dom'
import { Statement } from 'delib-npm'
import Text from '../../../components/text/Text'
import Edit from '../../../components/edit/Edit'

interface Props {
    statement: Statement
}

const StatementCard: FC<Props> = ({ statement }) => {
    return (

        <div className='card statementCard' >
            <Link className='href--undecorated' to={`/home/statement/${statement.statementId}`}>
                <Text text={statement.statement} />
                {statement.lastMessage ? <p className='statementCard__next'>{statement.lastMessage}</p> : null}
            </Link>
            <div className="statementCard__more">
                <Edit statement={statement} />
            </div>
        </div>

    )
}

export default StatementCard