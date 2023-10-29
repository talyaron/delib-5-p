import { FC } from 'react'
import Text from '../../../../components/text/Text'
import { Statement } from 'delib-npm'

interface Props {
    statement: Statement
}

const Solution: FC<Props> = ({ statement }) => {
    if (!statement || !statement.maxConsesusStatement || !statement.maxConsesusStatement.statement) return null
    return (
        <div className='solution'>{<Text text={statement.maxConsesusStatement.statement} />}</div>
    )
}

export default Solution