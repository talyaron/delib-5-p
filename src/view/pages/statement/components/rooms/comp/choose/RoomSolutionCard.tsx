import { Statement } from 'delib-npm';
import { FC } from 'react';

interface Props {
    statement: Statement
}

const RoomSolutionCard: FC<Props> = ({ statement }) => {
    return (
        <div className='roomsCards__solutionCard'>{statement.statement}</div>
    )
}

export default RoomSolutionCard