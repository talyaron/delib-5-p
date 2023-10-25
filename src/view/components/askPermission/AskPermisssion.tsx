import {FC} from 'react';
import Modal from '../modal/Modal'
import notifications from '../../../assets/notifications.png'
import styles from './AskPermisssion.module.scss';

interface Props {
    showFn: Function
}

const AskPermisssion:FC<Props> = ({showFn}) => {
    return (
        <Modal>
            <div className={styles.notifications}>
            <h2>כדי שתוכלו לתקשר אחד עם השניה</h2>
            <p>יש צורך לקבל התראות</p>
            <p> אנא אשרו התראות עבור דליב</p>
            <img src={notifications} alt="הסבר איך לפתוח את ההתראות" />
            <div className="btns">
                <button className="btn btn--cancel" onClick={()=>showFn(false)}>סגירה</button>
               
            </div>
            </div>
        </Modal>
    )
}

export default AskPermisssion