import { inAppNotificationsSelector } from '@/model/notifications/notificationsSlice';

import { useSelector } from 'react-redux'
import styles from './InAppNotifications.module.scss'

import InAppNotification from './inAppNotification/InAppNotification';
import { useLanguage } from '@/controllers/hooks/useLanguages';

const InAppNotifications = () => {
  const {dir} = useLanguage();
  try {
    const _inAppNotifications = [...useSelector(inAppNotificationsSelector)]
    console.log(_inAppNotifications)
    const inAppNotifications =_inAppNotifications.length>0? _inAppNotifications.sort((a, b) => b.createdAt - a.createdAt):[]
    
    return (
        <div className={styles.notifications} style={{left:dir === 'ltr'?"10px":"none", right:dir=== "ltr"?"none":"10px"}}>{
            inAppNotifications.map((notification) => (
                <InAppNotification key={notification.notificationId} notification={notification} />
            ))
            }</div>
      )
  } catch (error) {
    console.error(error)
    return <div></div>
  }
 
}

export default InAppNotifications