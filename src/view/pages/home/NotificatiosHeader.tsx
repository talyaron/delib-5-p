import {  useState } from "react";
import { useSelector } from "react-redux";
import Bell from "@/assets/icons/bellIcon.svg?react";
import { inAppNotificationsSelector } from "@/model/notifications/notificationsSlice";
import InAppNotifications from "@/view/components/inAppNotifications/InAppNotifications";

const NotificationHeader = () => {
	const inAppNotifications = useSelector(inAppNotificationsSelector);
	const [showNotifications, setShowNotifications] = useState(false);

	function handleShowNotifications(show: boolean) {
		setShowNotifications(show);
	}

	return (
		<div className="homePage__header__wrapper__notifications">
			<button onClick={() => handleShowNotifications(!showNotifications)} className="homePage__header__wrapper__notifications__btn">
				<Bell />
				{inAppNotifications.length > 0 && <div className="redCircle"></div>}
			</button>
			{inAppNotifications.length > 0 && showNotifications && (
				<InAppNotifications handleShowNotifications={handleShowNotifications}/>
			)}
		</div>
	);
};

export default NotificationHeader;
