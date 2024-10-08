import { inAppNotificationsSelector } from "@/model/notifications/notificationsSlice";
import InAppNotifications from "@/view/components/inAppNotifications/InAppNotifications";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import Bell from "@/assets/icons/bellIcon.svg?react";

interface Props {}

const NotificationHeader: FC<Props> = () => {
  const inAppNotifications = useSelector(inAppNotificationsSelector);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="homePage__header__wrapper__notifications">
      <button onClick={() => setShowNotifications(!showNotifications)}>
        <Bell />{" "}
        {inAppNotifications.length > 0 && <div className="redCircle"></div>}
      </button>
      {inAppNotifications.length > 0 && showNotifications && (
        <InAppNotifications />
      )}
    </div>
  );
};

export default NotificationHeader;
