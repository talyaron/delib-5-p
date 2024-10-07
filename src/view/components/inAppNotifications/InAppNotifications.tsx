import { inAppNotificationsSelector } from '@/model/notifications/notificationsSlice';

import { useSelector } from 'react-redux'
import styles from './InAppNotifications.module.scss'
import { updateNotificationRead } from '@/controllers/db/notifications/notifications';
import { useNavigate } from 'react-router-dom';

const InAppNotifications = () => {
    const navigate = useNavigate();
    const inAppNotifications = useSelector(inAppNotificationsSelector);
    function handleUpdateRead(notificationId: string, parentId: string) {
        updateNotificationRead(notificationId);
        navigate(`/statement/${parentId}/chat`);
    }
  return (
    <div className={styles.notifications}>{
        inAppNotifications.map((notification) => (
            <div key={notification.notificationId}  className={styles.notification} onClick={()=>handleUpdateRead(notification.notificationId, notification.parentId)}>
                <div className="notification__title">{notification.text}</div>
            </div>
        ))
        }</div>
  )
}

export default InAppNotifications