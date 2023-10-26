import { FC } from 'react'

import { Link } from 'react-router-dom'
import { Statement } from 'delib-npm'
import Text from '../../../components/text/Text'
import Edit from '../../../components/edit/Edit'
import StatementChat from './StatementChatMore'

interface Props {
    statement: Statement
}

const StatementCard: FC<Props> = ({ statement }) => {
    return (

        <div className='statementCard' >
            <div className="statementCard__main">
                <Link className='href--undecorated' to={`/home/statement/${statement.statementId}`}>
                    <Text text={statement.statement} />
                </Link>
            </div>
            <div className="statementCard__more">
                <StatementChat statement={statement} />
                <Edit statement={statement} />
            </div>
        </div>

    )
}

export default StatementCard