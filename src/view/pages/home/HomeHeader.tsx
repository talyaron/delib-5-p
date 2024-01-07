import { useEffect, useState } from "react";
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";
import { t } from "i18next";
import { handleLogout } from "../../../functions/general/helpers";

// icons
import elipsIcon from "../../../assets/elipsIcon.svg";
import installIcon from "../../../assets/installIcon.svg";
import disconnectlIcon from "../../../assets/disconnectIcon.svg";

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
        <div className="homePage__header">
            <h1 className="homePage__header__homeTitle">Conversations</h1>
            <div className="homePage__header__icons">
                <img
                    className="homePage__header__icons__headerIcon"
                    src={installIcon}
                    alt="install_icon"
                    onClick={handleInstallApp}
                />
                <img
                    className="homePage__header__icons__headerIcon"
                    src={elipsIcon}
                    alt="elips_icon"
                />
                <div className="homePage__header__icons__homeMenu">
                    <img
                        className="homePage__header__icons__homeMenu__icon"
                        src={disconnectlIcon}
                        alt="disconnect_icon"
                    />
                    <p className="homePage__header__icons__homeMenu__icon">
                        Disconnect
                    </p>
                </div>
            </div>
            <button onClick={handleLogout}>{t("Disconnect")}</button>
        </div>
    );
}
