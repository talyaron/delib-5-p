import "./enableNotifications.scss";
import pointer from "@/assets/images/woman.png";
import Modal from "../modal/Modal";
import { setStatementSubscriptionToDB } from "@/controllers/db/subscriptions/setSubscriptions";
import { Role, Statement } from "delib-npm";
import { setStatementSubscriptionNotificationToDB } from "@/controllers/db/notifications/notifications";
import woman from "@/assets/images/woman.png";

interface Props {
  setAskNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  statement: Statement | undefined;
  setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EnableNotifications2page({
  setAskNotifications,
  statement,
  setShowAskPermission,
}: Props) {
  if (!statement) throw new Error("No statement");

  const userAskedForNotification = true;
  const getNotifications = true;

  const handleCancelClick = async () => {
    await setStatementSubscriptionToDB(
      statement,
      Role.admin,
      userAskedForNotification,
    );
    setAskNotifications(false);
  };

  const handleEnableNotificationsClick = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted")
      await setStatementSubscriptionNotificationToDB(
        statement,
        getNotifications,
      );
    else setShowAskPermission(true);

    await setStatementSubscriptionToDB(
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
        <div className="enableNotifications__header">
          <img src={pointer} alt="Pointer" className="pointer" />
          <p className="enableNotifications__title">Don't Miss Out!</p>
        </div>
        <p className="enableNotifications__text">
          Enable push notifications to stay updated on messages
        </p>
        <p className="enableNotifications__subtext">
          We'll send you notifications when someone responds to your messages
        </p>
        <div className="enableNotifications__image">
          <img src={woman} alt="Woman" />
        </div>
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
        <p className="enableNotifications__footer">
          You can always change your notification settings later
        </p>
      </div>
    </Modal>
  );
}
