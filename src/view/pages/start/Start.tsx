import { useEffect, useState } from "react";
import styles from "./Start.module.scss";

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
import googleLogo from "../../../assets/icons/googleSimpleLogo.svg"
import moreRight from "../../../assets/icons/moreRight.svg";
import moreLeft from "../../../assets/icons/moreLeft.svg";

// Constants
import { LANGUAGES } from "../../../constants/Languages";
import EnterName from "./EnterName";
import useDirection from "../../../functions/hooks/useDirection";

// import EnterName from './EnterName';

const Start = () => {
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const user = useAppSelector(userSelector);
    const [showNameModul, setShowNameModul] = useState(false);
    const savedLang = localStorage.getItem("lang");
    const direction = (useDirection() === "row") ? "row" : "row-reverse";

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
            <div className={styles.h1}>
                {t("Delib")} <span className={styles.number}>5</span>
            </div>
            <div className={styles.h2}>{t("Creating Agreements")}</div>
            <img
                className={styles.logo}
                src={Logo}
                alt="Delib logo"
                width="10%"
                style={{}}
            />

            <select
                className={styles.language}
                defaultValue={savedLang || "he"}
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
            <div
                className={styles.anonymous}
                onClick={() => setShowNameModul(true)}
                //@ts-ignore
                style={{ direction }}
            >
                {t("Login with a temporary name")}{" "}
                <img
                    src={direction === "row" ? moreRight : moreLeft}
                    alt="login anonymously"
                />
            </div>
            <button
                className={styles.googleLogin}
                onClick={googleLogin}
            >
                <img
                    src={direction === "row-reverse" ? moreRight : moreLeft}
                    alt="login anonymously"
                />
                <img src={googleLogo} alt="login with google" />
                {t("Connect with Google")}
                
            </button>

            <a
                href="http://delib.org"
                target="_blank"
                style={{
                    marginTop: "30px",
                    textDecoration: "none",
                }}
            >
                <footer className={styles.ddi}>{t("From the Institute for Deliberative Democracy")}</footer>
            </a>

            {showNameModul ? (
                <EnterName setShowNameModul={setShowNameModul} />
            ) : null}
        </div>
    );
};

export default Start;
