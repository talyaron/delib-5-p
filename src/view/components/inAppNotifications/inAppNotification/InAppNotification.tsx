import { NotificationType } from "delib-npm";
import { FC } from "react";
import styles from "./InAppNotification.module.scss";
import { updateNotificationRead } from "@/controllers/db/notifications/notifications";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteInAppNotificationsByParentId } from "@/model/notifications/notificationsSlice";

interface Props {
  notification: NotificationType;
}
const InAppNotification: FC<Props> = ({ notification }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	function handleUpdateRead(notificationId: string, parentId: string) {
		updateNotificationRead(notificationId, parentId);
		dispatch(deleteInAppNotificationsByParentId(parentId));
		navigate(`/statement/${parentId}/chat`);
	}

	function getInitials(name: string) {
		const nameArray = name.split(" ");

		return (
			nameArray[0].charAt(0).toUpperCase() +
      nameArray[nameArray.length - 1].charAt(0).toUpperCase()
		);
	}

	const parentStatement =
    notification.parentStatement && notification.parentStatement.length > 50
    	? notification.parentStatement.slice(0, 50) + "..."
    	: notification.parentStatement;
	const text =
    notification.text.length > 50
    	? notification.text.slice(0, 50) + "..."
    	: notification.text;

	return (
		<button
			aria-label="Notification"
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
			) : (
				<div className={styles.image}>
					{getInitials(notification.creatorName)}
				</div>
			)}
			<div className={styles.texts}>
				{parentStatement && (
					<div className={styles.from}>{parentStatement}:</div>
				)}
				<div className={styles.title}>{text}</div>
			</div>
		</button>
	);
};

export default InAppNotification;
