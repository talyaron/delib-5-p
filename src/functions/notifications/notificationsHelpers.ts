import { Statement } from "delib-npm";
import {
    getUserPermissionToNotifications,
    setStatmentSubscriptionNotificationToDB,
} from "./notifications";

export default async function toggleNotifications(
    statement: Statement,
    permission: boolean,
    setShowAskPermission: (show: boolean) => void,
) {
    const isPermited = await getUserPermissionToNotifications();

    if (!isPermited) return setShowAskPermission(true);

    setStatmentSubscriptionNotificationToDB(statement, !permission);
}
