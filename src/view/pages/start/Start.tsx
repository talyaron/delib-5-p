import { useEffect, useState } from "react";

// firestore functions
import { googleLogin } from "../../../functions/db/auth";
import { getIntialLocationSessionStorage } from "../../../functions/general/helpers";

// Third Party Libraries
import { useNavigate } from "react-router-dom";

// Redux
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../model/users/userSlice";

//img
import Logo from "../../../assets/logo/logo-128px.png";
import googleLogo from "../../../assets/google-seeklogo.com.svg";

// Constants
import { LANGUAGES } from "../../../constants/Languages";
import EnterName from "./EnterName";

// import EnterName from './EnterName';

const Start = () => {
    const navigate = useNavigate();
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
            <h1 className="splashPage__title">{"Delib 5"}</h1>
            <img
                src={Logo}
                alt="Delib logo"
                width="10%"
                style={{ maxWidth: "150px" }}
            />
            <h2 className="splashPage__subTitle">{"Creating Agreements"}</h2>
            <select
                style={{ backgroundColor: "lightblue" }}
                defaultValue={savedLang || "he"}
            >
                {LANGUAGES.map(({ code, label }) => (
                    <option key={code} value={code}>
                        {label}
                    </option>
                ))}
            </select>
            <button
                className="btn btn--large"
                onClick={() => setShowNameModul(true)}
            >
                {"Login with a temporary name"}
            </button>
            <button
                className="btn splashPage__loginButton btn--img"
                onClick={googleLogin}
            >
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
                <h2>{"From the Institute for Deliberative Democracy"}</h2>
            </a>

            {showNameModul ? (
                <EnterName setShowNameModul={setShowNameModul} />
            ) : null}
        </div>
    );
};

export default Start;
