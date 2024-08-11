import { useEffect, useState } from "react";
import styles from "./Start.module.scss";

// firestore functions

// Third Party Libraries
import { useNavigate } from "react-router-dom";

// Redux
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { userSelector } from "@/model/users/userSlice";

// icons
import Logo from "@/assets/logo/106 x 89 SVG.svg?react";
import MoreRight from "@/assets/icons/moreRight.svg?react";
import MoreLeft from "@/assets/icons/moreLeft.svg?react";
import StartPageImage from '@/assets/images/StartPageImage.png'
import StartPageImageMobile from '@/assets/images/StartPageImageMobile.png'

// Constants
import { LANGUAGES } from "@/constants/Languages";
import EnterNameModal from "../../components/enterNameModal/EnterNameModal";
import useDirection from "@/controllers/hooks/useDirection";
import {
	LanguagesEnum,
	useLanguage,
} from "@/controllers/hooks/useLanguages";
import GoogleLoginButton from "../../components/buttons/GoogleLoginButton";
import { selectInitLocation } from "@/model/location/locationSlice";

const Start = () => {
	const navigate = useNavigate();
	const user = useAppSelector(userSelector);
	const initLocation = useAppSelector(selectInitLocation);
	const [shouldShowNameModal, setShouldShowNameModal] = useState(false);
	const savedLang = localStorage.getItem("lang");
	const direction = useDirection();

	const { t, changeLanguage } = useLanguage();
	const defaultLang = "he";

	useEffect(() => {
		if (!savedLang) {
			localStorage.setItem("lang", defaultLang);
		}
	}, []);

	useEffect(() => {
		if (user) {
			navigate(initLocation || "/home", {
				state: { from: window.location.pathname },
			});
		}
	}, [user]);

	return (
		<div className={styles.splashPage}>
			<Logo />
			<div className={styles.slogan}>
				{t("Fostering Collaborations")}
			</div>
			<select
				className={styles.language}
				defaultValue={savedLang || defaultLang}
				onChange={(e) => {
					const lang = e.target.value as LanguagesEnum;
					changeLanguage(lang);
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
			<button
				style={{ flexDirection: direction }}
				data-cy="anonymous-login"
				className={`${styles.anonymous} ${direction === 'row' ? styles.ltr : styles.rtl}`}
				onClick={() => setShouldShowNameModal((prev) => !prev)}
			>
				{direction === "row-reverse" ? <MoreLeft /> : null}
				{t("Login with a temporary name")}{" "}
				{direction === "row" ? <MoreRight /> : null}
				
			</button>

			<GoogleLoginButton/>
			
			<img src={StartPageImage} alt="" className={styles.StratPageImage}/>
			<img src={StartPageImageMobile} alt="" className={styles.StratPageImageMobile}/>
			<a href="http://delib.org" target="_blank">
				<footer className={styles.ddi}>
					{t("From the Institute for Deliberative Democracy")}
				</footer>
			</a>

			{shouldShowNameModal && (
				<EnterNameModal
					closeModal={() => setShouldShowNameModal(false)}
				/>
			)}
		</div>
	);
};

export default Start;
