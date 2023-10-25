import { Statement } from 'delib-npm'
import { FC } from 'react'
import StatementRoomCard from './StatementRoomCard';

interface Props {
    subStatements: Statement[];
    setShowModal:Function;
}


const SelectRoom: FC<Props> = ({ subStatements,setShowModal }) => {
    return (
        <>
            <h2>חלוקה לחדרים</h2>
            <div className="roomsCards__wrapper">

                {subStatements.map((subStatement: Statement) => {
                    return <StatementRoomCard key={subStatement.statementId} statement={subStatement} />
                })}

            </div>
            <div className="fav fav--fixed" onClick={() => setShowModal(true)}>
                <div>+</div>
            </div>

        </>
    )
}

export default SelectRoom