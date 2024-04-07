import { useEffect, useState } from "react";

// Helpers
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";

// icons
import EllipsisIcon from "../../../assets/icons/ellipsisIcon.svg?react";
import InstallIcon from "../../../assets/icons/installIcon.svg?react";

// Components
import HomeMenu from "../../components/homeMenu/HomeMenu";
import { useLanguage } from "../../../functions/hooks/useLanguages";

export default function HomeHeader() {
    // Use State
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState(false);

    const { t } = useLanguage();

    useEffect(() => {
        // for deferred app install
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
                <div
                    className="homePage__header__wrapper__title"
                    children={t("Delib")}
                />
                <div className="homePage__header__wrapper__icons">
                    {deferredPrompt && (
                        <button
                            onClick={handleInstallApp}
                            className="homePage__header__wrapper__icons__iconButton"
                        >
                            <InstallIcon />
                        </button>
                    )}
                    <button
                        onClick={() => setOpenMenu(true)}
                        className="homePage__header__wrapper__icons__iconButton"
                    >
                        <EllipsisIcon />
                    </button>
                    {openMenu && <HomeMenu setOpenMenu={setOpenMenu} />}
                </div>
            </div>
        </div>
    );
}
