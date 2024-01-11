import { Statement, Collections, StatementSubscription } from "delib-npm";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import { t } from "i18next";
import { messaging, DB } from "./db/config";
import { getUserFromFirebase } from "./db/users/usersGeneral";
import { vapidKey } from "./db/configKey";
import logo from "../assets/logo/logo-96px.png";

export async function getUserPermissionToNotifications(): Promise<boolean> {
    try {
        if (!window.hasOwnProperty("Notification"))
            throw new Error("Notification not supported");
        if (Notification.permission === "granted") return true;

        if (Notification.permission === "denied") return false;

        //in case the user didn't set the notification permission yet
        alert(
            t(
                "Please confirm notifications to receive updates on new comments\nYou can disable notifications at any time"
            )
        );
        const permission = await Notification.requestPermission();

        if (permission !== "granted") throw new Error("Permission not granted");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function onLocalMessage() {
    try {
        const msg = await messaging();
        if (!msg) throw new Error("msg is undefined");

        return onMessage(msg, (payload) => {
            if (payload.data?.creatorId === getUserFromFirebase()?.uid) return;

            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    const title = payload.data?.title || "Delib";

                    const notification = new Notification(title, {
                        body: payload.data?.body || "",
                        data: { url: payload.data?.url || "" },
                        icon: logo,
                    });

                    const notificationSound = new Audio(
                        "https://delib-5.web.app/assets/sound/sweet_notification.mp3"
                    );

                    notificationSound.autoplay = true;
                    notificationSound.volume = 0.3;

                    notificationSound.play();

                    notification.onclick = (event) => {
                        const target = event.target as Notification;

                        const url = target.data.url;

                        window.open(url, "_blank");
                    };
                } else {
                    console.error("Unable to get permission to notify.");
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}

export async function setStatmentSubscriptionNotificationToDB(
    statement: Statement | undefined
) {
    try {
        const msg = await messaging();
        if (!msg) throw new Error("Notifications not supported");

        const token = await getToken(msg, { vapidKey });
        if (!token)
            throw new Error(
                "Token is undefined in setstatementSubscriptionNotificationToDB."
            );

        if (!statement) throw new Error("Statement is undefined");
        const { statementId } = statement;

        //ask user for permission to send notifications
        await getUserPermissionToNotifications();

        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");

        const statementsSubscribeId = `${user.uid}--${statementId}`;
        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementsSubscribeId
        );
        const statementSubscriptionDB = await getDoc(statementsSubscribeRef);

        if (!statementSubscriptionDB.exists()) {
            //set new subscription
            const tokenArr = [token];

            await setDoc(
                statementsSubscribeRef,
                {
                    user,
                    userId: user.uid,
                    statementId,
                    token: tokenArr,
                    notification: true,
                    lastUpdate: Timestamp.now().toMillis(),
                    statementsSubscribeId,
                    statement,
                },
                { merge: true }
            );
        } else {
            // update subscription -> Remove notifications
            const statementSubscription =
                statementSubscriptionDB.data() as StatementSubscription;

            const tokenArr = statementSubscription.token
                ? [...statementSubscription.token]
                : [];

            // If token is already in the array, remove it, otherwise add it
            if (!tokenArr.includes(token)) {
                tokenArr.push(token);
            } else {
                tokenArr.splice(tokenArr.indexOf(token), 1);
            }

            await setDoc(
                statementsSubscribeRef,
                {
                    token: tokenArr,
                    notification: !statementSubscription.notification,
                },
                { merge: true }
            );
        }
    } catch (error) {
        console.error(error);
    }
}
