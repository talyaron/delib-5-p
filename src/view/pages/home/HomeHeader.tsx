import { useEffect, useState } from "react";
import { logOut } from "../../../functions/db/auth";
import { setUser } from "../../../model/users/userSlice";
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";
import { useAppDispatch } from "../../../functions/hooks/reduxHooks";
import { t } from "i18next";

export default function HomeHeader() {
    const dispatch = useAppDispatch();

    //for deffered app install
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        //for defferd app install
        setDeferredPrompt(install.deferredPrompt);
    }, []);

    function handleLogout() {
        logOut();
        dispatch(setUser(null));
    }
    function handleInstallApp() {
        try {
            prompStore(setDeferredPrompt);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="page__header">
            <div className="page__header__title">
                <h1>{t("Delib 5")}</h1>
                <b>-</b>
                <h2>{t("Creating Agreements")}</h2>
            </div>
            <div className="btns">
                <button onClick={handleLogout}>{t("Disconnect")}</button>
                {deferredPrompt && (
                    <button onClick={handleInstallApp}>
                        {t("Install the App")}
                    </button>
                )}
            </div>
        </div>
    );
}
