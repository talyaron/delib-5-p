import { useEffect, useState } from "react";
import styles from "./Start.module.scss";

// firestore functions
import { googleLogin } from "../../../functions/db/auth";
import { getIntialLocationSessionStorage } from "../../../functions/general/helpers";

// Third Party Libraries
import { useNavigate } from "react-router-dom";

// Redux
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../model/users/userSlice";

//img
import Logo from "../../../assets/logo/512 px SVG.svg";
import googleLogo from "../../../assets/icons/googleSimpleLogo.svg";
import moreRight from "../../../assets/icons/moreRight.svg";
import moreLeft from "../../../assets/icons/moreLeft.svg";

// Constants
import { LANGUAGES } from "../../../constants/Languages";
import EnterName from "../../components/enterName/EnterName";
import useDirection from "../../../functions/hooks/useDirection";

// import EnterName from './EnterName';

const Start = () => {
    const navigate = useNavigate();
    const user = useAppSelector(userSelector);
    const [showNameModul, setShowNameModul] = useState(false);
    const savedLang = localStorage.getItem("lang");
    const direction = useDirection();

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
                {("Delib")} <span className={styles.number}>5</span>
            </div>
            <div className={styles.h2}>{("Creating Agreements")}</div>
            <img
                className={styles.logo}
                src={Logo}
                alt="Delib logo"
                height="20%"
                style={{}}
            />
            <select
                className={styles.language}
                defaultValue={savedLang || "he"}
            >
                {LANGUAGES.map(({ code, label }) => (
                    <option key={code} value={code}>
                        {label}
                    </option>
                ))}
            </select>
            <div
                data-cy="anonymous-login"
                className={styles.anonymous}
                onClick={() => setShowNameModul(true)}

                //@ts-ignore
                style={{ direction }}
            >
                {("Login with a temporary name")}{" "}
                <img
                    src={direction === "row" ? moreRight : moreLeft}
                    alt="login anonymously"
                />
            </div>
            <button className={styles.googleLogin} onClick={googleLogin}>
                <img
                    src={direction === "row-reverse" ? moreRight : moreLeft}
                    alt="login anonymously"
                />
                <img src={googleLogo} alt="login with google" />
                {"Connect with Google"}
            </button>

            <a
                href="http://delib.org"
                target="_blank"
                style={{
                    marginTop: "30px",
                    textDecoration: "none",
                }}
            >
                <footer className={styles.ddi}>
                    {("From the Institute for Deliberative Democracy")}
                </footer>
            </a>

            {showNameModul && <EnterName setShowNameModul={setShowNameModul} />}
        </div>
    );
};

export default Start;
