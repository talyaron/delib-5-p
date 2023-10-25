import { RoomsStateSelection, Statement } from 'delib-npm';
import { FC } from 'react';
import { setRoomsStateToDB } from '../../../../../../functions/db/rooms/setRooms';
import { auth } from '../../../../../../functions/db/auth';

interface Props {
    statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {

    function handleRoomSelectionState(roomsStatus: RoomsStateSelection) {
        try {
            setRoomsStateToDB(statement, roomsStatus);
        } catch (error) {
            console.error(error);
        }
    }

    const isAdmin = auth.currentUser?.uid === statement.creatorId;


    return (
        <>
            {isAdmin ? <div className='roomsCards__admin'>
                <div className="btnBox">
                    <button className={statement.roomsState === RoomsStateSelection.SELECT_ROOMS ? "btn btn--selected" : "btn btn--secondry"} onClick={() => { handleRoomSelectionState(RoomsStateSelection.SELECT_ROOMS) }}>בחירת חדרים</button>
                    <button className={statement.roomsState === RoomsStateSelection.DIVIDE ? "btn btn--selected" : "btn btn--secondry"} onClick={() => { handleRoomSelectionState(RoomsStateSelection.DIVIDE) }}>חלוקה לחדרים</button>
                </div>
            </div> : null}
        </>
    )
}

export default RoomsAdmin