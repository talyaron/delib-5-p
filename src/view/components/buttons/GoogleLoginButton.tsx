import googleLogo from "../../../assets/icons/googleSimpleLogo.svg";
import styles from "./button.module.scss";
import moreRight from "../../../assets/icons/moreRight.svg";
import moreLeft from "../../../assets/icons/moreLeft.svg";
import { googleLogin } from "../../../functions/db/auth";
import { useLanguage } from "../../../functions/hooks/useLanguages";
import useDirection from "../../../functions/hooks/useDirection";

export default function GoogleLoginButton() {
    const direction = useDirection();
    const { t } = useLanguage();

    return (
        <button className={styles.googleLogin} onClick={googleLogin}>
            <img
                src={direction === "row-reverse" ? moreRight : moreLeft}
                alt="login-with-google"
            />
            <img src={googleLogo} alt="login with google" />
            {t("Connect with Google")}
        </button>
    );
}
