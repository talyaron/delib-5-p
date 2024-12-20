import { FC } from 'react';

import { useSelector } from 'react-redux';
import InAppNotification from './inAppNotification/InAppNotification';
import styles from './InAppNotifications.module.scss';

import { useLanguage } from '@/controllers/hooks/useLanguages';
import { inAppNotificationsSelector } from '@/model/notifications/notificationsSlice';

interface Props {
	handleShowNotifications: (show: boolean) => void;
}

const InAppNotifications: FC<Props> = ({ handleShowNotifications }) => {
	const { dir } = useLanguage();
	try {
		const _inAppNotifications = [...useSelector(inAppNotificationsSelector)];

		const inAppNotifications =
			_inAppNotifications.length > 0
				? _inAppNotifications.sort((a, b) => b.createdAt - a.createdAt)
				: [];

		return (
			<>
				<button
					aria-label='Close or open Notifications'
					className={styles.background}
					onClick={() => {
						handleShowNotifications(false);
					}}
				></button>
				<div
					className={styles.notifications}
					style={{
						left: dir === 'ltr' ? '10px' : 'none',
						right: dir === 'ltr' ? 'none' : '10px',
					}}
				>
					{inAppNotifications.map((notification) => (
						<InAppNotification
							key={notification.notificationId}
							notification={notification}
						/>
					))}
				</div>
			</>
		);
	} catch (error) {
		console.error(error);

		return <div></div>;
	}
};

export default InAppNotifications;
