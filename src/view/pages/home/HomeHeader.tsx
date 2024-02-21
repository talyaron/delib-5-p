import { useEffect, useState } from "react";

// Helpers
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";

// icons
import elipsIcon from "../../../assets/icons/elipsIcon.svg";
import installIcon from "../../../assets/icons/installIcon.svg";

// Components
import HomeMenu from "../../components/homeMenu/HomeMenu";
import { useLanguage } from "../../../functions/hooks/useLanguages";

export default function HomeHeader() {
    // Use State
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState(false);

    const { languageData } = useLanguage();

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
                <div className="homePage__header__wrapper__title">
                    {languageData["Delib"]}
                </div>
                <div className="homePage__header__wrapper__icons">
                    {deferredPrompt && (
                        <img
                            className="homePage__header__wrapper__icons__installIcon"
                            src={installIcon}
                            alt="install_icon"
                            onClick={handleInstallApp}
                        />
                    )}
                    {openMenu && <HomeMenu setOpenMenu={setOpenMenu} />}
                    <img
                        className="homePage__header__wrapper__icons__elipsIcon"
                        src={elipsIcon}
                        alt="elips_icon"
                        onClick={() => setOpenMenu(true)}
                    />
                </div>
            </div>
        </div>
    );
}
