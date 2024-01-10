import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { vapidKey } from "../db/configKey";
import { messaging } from "../db/config";

const useToken = () => {
    try {
        const [token, setToken] = useState<undefined | string>(undefined);

        const storeToken = async () => {
            const msg = await messaging();
            if (!msg) throw new Error("Notifications not supported");

            const token = await getToken(msg, { vapidKey });
            if (!token) throw new Error("Token is undefined");

            setToken(token);
        };

        useEffect(() => {
            storeToken();
        }, []);

        return token;
    } catch (error) {
        console.log(error);
    }
};

export default useToken;
