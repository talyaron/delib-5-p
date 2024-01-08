import { useEffect, useState } from "react";
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";

// icons
import elipsIcon from "../../../assets/elipsIcon.svg";
import installIcon from "../../../assets/installIcon.svg";
import HomeMenu from "../../components/homeMenu/HomeMenu";

export default function HomeHeader() {
    //for deffered app install
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState(false);

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
            <div className="homePage__header__wrapper">
                <h1 className="homePage__header__wrapper__homeTitle">
                    Conversations
                </h1>
                <div className="homePage__header__wrapper__icons">
                    {deferredPrompt && (
                        <img
                            className="homePage__header__wrapper__icons__installIcon"
                            src={installIcon}
                            alt="install_icon"
                            onClick={handleInstallApp}
                        />
                    )}
                    <img
                        className="homePage__header__wrapper__icons__elipsIcon"
                        src={elipsIcon}
                        alt="elips_icon"
                        onClick={() => setOpenMenu(true)}
                    />
                    {openMenu && <HomeMenu />}
                </div>
            </div>
        </div>
    );
}
