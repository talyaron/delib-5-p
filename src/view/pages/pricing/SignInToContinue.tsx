import GoogleLoginButton from "../../components/buttons/GoogleLoginButton";
import image from "../../../assets/images/loginFirstImage.png";
import { useLocation } from "react-router-dom";

export default function SignInToContinue() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const location = useLocation();

    // const cameFrom = location.state.from ? location.state.from : "/";


    return (
        <div className="loginFirst">
            <div className="loginFirst__wrapper">
                <img
                    src={image}
                    alt="login-first-image"
                    className="loginFirst__wrapper__img"
                    width={isMobile ? "100%" : "50%"}
                />
                <p>In order to continue you have to login</p>
                <GoogleLoginButton />
            </div>
        </div>
    );
}
