import { Statement } from "delib-npm";
import {
    getUserPermissionToNotifications,
    setStatementSubscriptionNotificationToDB,
} from "./notifications";

export default async function toggleNotifications(
    statement: Statement | undefined,
    permission: boolean,
    setShowAskPermission: (show: boolean) => void,
    t: (key: string) => string,
) {
    try {
        if (!statement)
            throw new Error("Statement is undefined in toggleNotifications");

        const isPermited = await getUserPermissionToNotifications(t);

        if (!isPermited) return setShowAskPermission(true);

        setStatementSubscriptionNotificationToDB(statement, !permission);
    } catch (error) {
        console.error(error);
    }
}
