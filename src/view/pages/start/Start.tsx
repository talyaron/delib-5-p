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

import EnterName from "./EnterName";
import LanguageSelector from "../../components/language/LanguageSelector";

// import EnterName from './EnterName';

const Start = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useAppSelector(userSelector);
    const [showNameModul, setShowNameModul] = useState(false);
    

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
        <div className="page splashPage">
            <h1 className="splashPage__title">{t("Delib 5")}</h1>
            <img src={Logo} alt="Delib logo" />
            <h2 className="splashPage__subTitle">{t("Creating Agreements")}</h2>
            <LanguageSelector />
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
          
            {showNameModul ? (
                <EnterName setShowNameModul={setShowNameModul} />
            ) : null}
        </div>
    );
};

export default Start;
