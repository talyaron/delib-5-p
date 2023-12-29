import { useEffect, useState } from "react";

// firestore functions
import { googleLogin } from "../../../functions/db/auth";
import { getIntialLocationSessionStorage } from "../../../functions/general/helpers";

// Third Party Libraries
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Redux
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../model/users/userSlice";

//img
import Logo from "../../../assets/logo/logo-128px.png";

// Constants
import { LANGUAGES } from "../../../constants/Languages";
import EnterName from "./EnterName";
// import EnterName from './EnterName';

const Start = () => {
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const user = useAppSelector(userSelector);
    const [showNameModul, setShowNameModul] = useState(false);
    const savedLang = localStorage.getItem("lang");

    useEffect(() => {
        if (user) {
            navigate(getIntialLocationSessionStorage() || "/home", {
                state: { from: window.location.pathname },
            });
        } else {
            // console.info("not logged")
        }
    }, [user]);

    return (
        <div className="splashPage">
            <h1 className="splashPage__title">{t("Delib 5")}</h1>
            <img src={Logo} alt="Delib logo" width={150} height={150} />
            <h2 className="splashPage__subTitle">{t("Creating Agreements")}</h2>
            <button className="splashPage__loginButton" onClick={googleLogin}>
                {t("Connect with Google")}
            </button>
            <div
                className="btn loginButton"
                onClick={() => setShowNameModul(true)}
            >
                {t("Login with a temporary name")}
            </div>
            <a
                href="http://delib.org"
                target="_blank"
                style={{
                    marginTop: "30px",
                    textDecoration: "none",
                }}
            >
                <h2>{t("From the Institute for Deliberative Democracy")}</h2>
            </a>
            <select
                style={{ position: "absolute", top: 20, left: 20 }}
                defaultValue={savedLang || "en"}
                onChange={(e) => {
                    const lang = e.target.value;
                    i18n.changeLanguage(lang);
                    if (lang === "he" || lang === "ar") {
                        document.body.style.direction = "rtl";
                    } else {
                        document.body.style.direction = "ltr";
                    }
                    localStorage.setItem("lang", lang);
                }}
            >
                {LANGUAGES.map(({ code, label }) => (
                    <option key={code} value={code}>
                        {label}
                    </option>
                ))}
            </select>
            {showNameModul ? (
                <EnterName setShowNameModul={setShowNameModul} />
            ) : null}
        </div>
    );
};

export default Start;
