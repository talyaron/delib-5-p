import { RoomsStateSelection, Statement } from 'delib-npm';
import { FC } from 'react';
import { setRoomsStateToDB } from '../../../../../../functions/db/rooms/setRooms';
import NavAdmin from './nav/NavAdmin';
import AdminChoose from './AdminChoose'
import _styles from './admin.module.css?inline';
const styles = _styles as any;

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




    return (
        <>
            <div className={styles.admin}>
                <AdminChoose statement={statement} />

            </div>
            <NavAdmin roomSelectionFn={handleRoomSelectionState} statement={statement} />
        </>
    )
}

export default RoomsAdmin