import { useEffect, useState } from "react";
import { logOut } from "../../../functions/db/auth";
import { setUser } from "../../../model/users/userSlice";
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";
import { useAppDispatch } from "../../../functions/hooks/reduxHooks";
import { t } from "i18next";

// icons
import elipsIcon from "../../../assets/elipsIcon.svg";
import installIcon from "../../../assets/installIcon.svg";

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
        <div className="homePage__header">
            <div className="homePage__header__title">
                <h1 className="homePage__header__title__homeTitle">
                    Conversations
                </h1>
            </div>
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
            </div>
            {/* <div className="btns">
                <button onClick={handleLogout}>{t("Disconnect")}</button>
                {deferredPrompt && (
                    <button onClick={handleInstallApp}>
                        {t("Install the App")}
                    </button>
                )}
            </div> */}
        </div>
    );
}
