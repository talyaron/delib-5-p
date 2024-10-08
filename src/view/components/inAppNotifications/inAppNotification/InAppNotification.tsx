import { NotificationType } from "delib-npm";
import { FC } from "react";
import styles from "./InAppNotification.module.scss";
import { updateNotificationRead } from "@/controllers/db/notifications/notifications";
import { useNavigate } from "react-router-dom";

interface Props {
  notification: NotificationType;
}
const InAppNotification: FC<Props> = ({ notification }) => {
  const navigate = useNavigate();

  function handleUpdateRead(notificationId: string, parentId: string) {
    updateNotificationRead(notificationId);
    navigate(`/statement/${parentId}/chat`);
  }

  function getInitials(name: string) {
    const nameArray = name.split(" ");
    return nameArray[0].charAt(0).toUpperCase() + nameArray[nameArray.length - 1].charAt(0).toUpperCase();
  }

  const text = notification.text.length > 50 ? notification.text.slice(0, 50) + "..." : notification.text;

  return (
    <div
      className={styles.notification}
      onClick={() =>
        handleUpdateRead(notification.notificationId, notification.parentId)
      }
    >
      {notification.creatorImage ? (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${notification.creatorImage})` }}
        ></div>
      ) : (<div
      className={styles.image}
    >{getInitials(notification.creatorName)}</div>)}
      <div className={styles.title}>{text}</div>
    </div>
  );
};

export default InAppNotification;
