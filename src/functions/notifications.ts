import { t } from "i18next"

export async function getUserPermissionToNotifications(): Promise<boolean> {
    try {
        if (!window.hasOwnProperty("Notification"))
            throw new Error("Notification not supported")
        if (Notification.permission === "granted") return true

        if (Notification.permission === "denied") return false

        //in case the user didn't set the notification permission yet
        alert(
            t(
                "Please confirm notifications to receive updates on new comments\nYou can disable notifications at any time"
            )
        )
        const permission = await Notification.requestPermission()

        if (permission !== "granted") throw new Error("Permission not granted")
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
