import { useEffect, useState } from "react";
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";
import { t } from "i18next";
import { handleLogout } from "../../../functions/general/helpers";

export default function HomeHeader() {
    //for deffered app install
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        //for defferd app install
        setDeferredPrompt(install.deferredPrompt);
    }, []);

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
