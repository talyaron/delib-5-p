import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { vapidKey } from "../../controllers/db/notifications/configkey";
import { messaging } from "../db/config";

const useToken = () => {
  try {
    const [token, setToken] = useState<string>("");

    const storeToken = async () => {
      const msg = await messaging();

      if (!msg) throw new Error("Notifications not supported");

      if (Notification.permission !== "granted") return;

      const token = await getToken(msg, { vapidKey });
      if (!token) throw new Error("Token is undefined in useToken.");

      setToken(token);
    };

    useEffect(() => {
      storeToken();
    }, [Notification.permission]);

    return token;
  } catch (error) {
    console.error(error);

    return "";
  }
};

export default useToken;
