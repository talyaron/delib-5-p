import { useEffect, useState } from "react";
import { install } from "../../../main";
import { prompStore } from "../main/mainCont";

// icons
import elipsIcon from "../../../assets/elipsIcon.svg";
import installIcon from "../../../assets/installIcon.svg";
import HomeMenu from "../../components/homeMenu/HomeMenu";
import { t } from "i18next";
import useDirection from "../../../functions/hooks/useDirection";

export default function HomeHeader() {
    //for deffered app install
    //@ts-ignore TODO: fix this
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState(false);

    const _direction = useDirection();
    const direction = _direction === "row" ? "ltr" : "rtl";

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
                    {t("Delib 5")}
                </div>
                <div className="homePage__header__wrapper__icons">
                    <img
                        className="homePage__header__wrapper__icons__installIcon"
                        src={installIcon}
                        alt="install_icon"
                        onClick={handleInstallApp}
                    />
                    <div
                        style={{
                            position: "relative",
                            right: direction === "ltr" ? "-4rem" : "-9rem",
                        }}
                    >
                        {openMenu && <HomeMenu setOpenMenu={setOpenMenu} />}
                    </div>
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
