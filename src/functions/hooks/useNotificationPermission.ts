import { useEffect, useState } from "react";
import { useAppSelector } from "./reduxHooks";
import {
    hasTokenSelector,
    statementNotificationSelector,
} from "../../model/statements/statementsSlice";
import { useParams } from "react-router-dom";

const useNotificationPermission = (token: string) => {
    try {
        const { statementId } = useParams();

        if (!statementId) throw new Error("statementId not found");

        const [permission, setPermission] = useState(
            Notification.permission === "granted"
        );
        const hasNotifications = useAppSelector(
            statementNotificationSelector(statementId)
        );

        const hasToken = useAppSelector(hasTokenSelector(token, statementId));

        useEffect(() => {
            setPermission(
                Notification.permission === "granted" &&
                    hasNotifications &&
                    hasToken
            );
        }, [hasToken, hasNotifications, Notification.permission]);

        return permission;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default useNotificationPermission;
