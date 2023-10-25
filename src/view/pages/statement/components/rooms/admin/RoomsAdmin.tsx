import { RoomsStateSelection, Statement } from 'delib-npm';
import { FC } from 'react';
import { setRoomsStateToDB } from '../../../../../../functions/db/rooms/setRooms';
import NavAdmin from './nav/NavAdmin';
import AdminChoose from './AdminChoose'
import styles from './admin.module.scss';

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
        <div className={styles.admin}>
            <AdminChoose statement={statement} />
            <NavAdmin roomSelectionFn={handleRoomSelectionState} />
        </div>
    )
}

export default RoomsAdmin