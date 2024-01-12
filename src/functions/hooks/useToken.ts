import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { vapidKey } from "../db/configKey";
import { messaging } from "../db/config";

const useToken = () => {
    try {
        const [token, setToken] = useState<string>("");

        const storeToken = async () => {
            const msg = await messaging();

            if (!msg) throw new Error("Notifications not supported");

            const token = await getToken(msg, { vapidKey });
            if (!token) throw new Error("Token is undefined in useToken.");

            setToken(token);
        };

        useEffect(() => {
            storeToken();
        }, []);

        return token;
    } catch (error) {
        console.error(error);
        
return "";
    }
};

export default useToken;
