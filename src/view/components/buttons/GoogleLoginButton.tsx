import googleLogo from "../../../assets/icons/googleSimpleLogo.svg";
import styles from "./button.module.scss";
import moreRight from "../../../assets/icons/moreRight.svg";
import moreLeft from "../../../assets/icons/moreLeft.svg";
import { googleLogin } from "../../../controllers/db/auth";
import { useLanguage } from "../../../controllers/hooks/useLanguages";
import useDirection from "../../../controllers/hooks/useDirection";

export default function GoogleLoginButton() {
	const direction = useDirection();
	const { t } = useLanguage();

	return (
		<button 
		className={`${styles.googleLogin} ${direction === 'row' ? styles.row : styles.rowReverse}`}
		onClick={googleLogin}>
			
			<img
				src={direction === "row-reverse" ? moreRight : moreLeft}
				alt="login-with-google"
			/>
			{t("Connect with Google")}
			<img src={googleLogo} alt="login with google" />
		</button>
	);
}
