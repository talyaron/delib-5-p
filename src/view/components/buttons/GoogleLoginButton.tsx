import styles from "./GoogleLogin.module.scss";
import googleLogo from "@/assets/icons/googleSimpleLogo.svg";
import moreLeft from "@/assets/icons/moreLeft.svg";
import moreRight from "@/assets/icons/moreRight.svg";
import { googleLogin } from "@/controllers/db/auth";
import useDirection from "@/controllers/hooks/useDirection";
import { useLanguage } from "@/controllers/hooks/useLanguages";

export default function GoogleLoginButton() {
	const direction = useDirection();
	const { t } = useLanguage();

	return (
		<button
			className={`${styles.googleLogin} ${direction === "row" ? styles.ltr : styles.rtl}`}
			onClick={googleLogin}
		>
			<img
				src={direction === "row-reverse" ? moreRight : moreLeft}
				alt="login-with-google"
			/>
			{t("Sign up with")}
			<img src={googleLogo} alt="login with google" />
		</button>
	);
}
