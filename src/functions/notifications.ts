export async function getUserPermissionToNotifications(): Promise<boolean> {
    try {
       
        if (!("Notification" in window)) throw new Error("Notification not supported");
        if (Notification.permission === "granted") return true;
       
        if (Notification.permission === "denied") throw new Error("Permission not granted");
       
        //in case the user didn't set the notification permission yet
        alert("אנא אשר/י התראות, כדי לקבל עדכונים על תגובות חדשות\nתוכל/י לבטל את ההתראות בכל זמן");
        const permission = await Notification.requestPermission();
        
        if (permission !== "granted") throw new Error("Permission not granted");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}