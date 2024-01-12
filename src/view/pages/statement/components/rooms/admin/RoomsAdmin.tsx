import { Statement } from 'delib-npm';
import { FC } from 'react';
import AdminChoose from './AdminChoose'
import _styles from './admin.module.css';

const styles = _styles as any;

interface Props {
    statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {

    
    return (
        <>
            <div className={styles.admin}>
                <AdminChoose statement={statement} />
            </div>
            
        </>
    )
}

export default RoomsAdmin