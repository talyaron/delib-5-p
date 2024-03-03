import { Statement } from "delib-npm";
import {
    getUserPermissionToNotifications,
    setStatmentSubscriptionNotificationToDB,
} from "./notifications";

export default async function toggleNotifications(
    statement: Statement | undefined,
    permission: boolean,
    setShowAskPermission: (show: boolean) => void,
    languageData: Record<string, string>,
) {
    try {
        if (!statement)
            throw new Error("Statement is undefined in toggleNotifications");

        const isPermited = await getUserPermissionToNotifications(languageData);

        if (!isPermited) return setShowAskPermission(true);

        setStatmentSubscriptionNotificationToDB(statement, !permission);
    } catch (error) {
        console.log(error);
    }
}
