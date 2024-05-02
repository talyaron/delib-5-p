import "./enableNotifications.scss";
import NotificationsGraphic from "../../../assets/svg-graphics/notifications.svg?react";
import Modal from "../modal/Modal";
import { setStatmentSubscriptionToDB } from "../../../controllers/db/subscriptions/setSubscriptions";
import { Role, Statement } from "delib-npm";
import { setStatmentSubscriptionNotificationToDB } from "../../../controllers/db/notifications/notifications";

interface Props {
    setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
    statement: Statement | undefined;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EnableNotifications({
    setAskNotifications,
    statement,
    setShowAskPermission,
}: Props) {
    if (!statement) throw new Error("No statement");

    const userAskedForNotification = true;
    const getNotifications = true;

    const handleCancelClick = async () => {
        await setStatmentSubscriptionToDB(
            statement,
            Role.admin,
            userAskedForNotification,
        );
        setAskNotifications(false);
    };

    const handleEnableNotificationsClick = async () => {
        const permission = await Notification.requestPermission();

        if (permission === "granted")
            await setStatmentSubscriptionNotificationToDB(
                statement,
                getNotifications,
            );
        else setShowAskPermission(true);

        await setStatmentSubscriptionToDB(
            statement,
            Role.admin,
            userAskedForNotification,
        );

        setAskNotifications(false);
    };

    return (
        <Modal>
            <div
                className="enableNotifications"
                data-cy="enable-notifications-popup"
            >
                <NotificationsGraphic />
                <p className="enableNotifications__title">Don'T Miss Out!</p>
                <p className="enableNotifications__text">
                    Enable push notifications to stay updated on messages
                </p>
                <div className="enableNotifications__btnBox">
                    <button
                        onClick={handleCancelClick}
                        className="enableNotifications__btnBox__cancel"
                    >
                        Not now
                    </button>
                    <button
                        onClick={handleEnableNotificationsClick}
                        className="enableNotifications__btnBox__enable"
                        data-cy="enable-notifications-popup-enable"
                    >
                        Enable notifications
                    </button>
                </div>
            </div>
        </Modal>
    );
}
