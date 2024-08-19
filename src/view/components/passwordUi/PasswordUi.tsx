"use client"
import { Dispatch, SetStateAction, useState } from "react"
import { useNavigate } from "react-router-dom"

//styles
import styles from "./passwordUi.module.scss"

//images
import passwordUiImgBlue from "../../../assets/images/passwordUiImgBlue.png"
import passwordUiImgRed from "../../../assets/images/passwordUiImgRed.png"
import passwordUiImgGreen from "../../../assets/images/passwordUiImgGreen.png"

//custom components
import Button from "../buttons/button/Button"
import PasswordInput from "./PasswordInput.tsx"
import { useLanguage } from "@/controllers/hooks/useLanguages";


interface PasswordProps {
	setPasswordCheck: Dispatch<SetStateAction<boolean>>,
}

function PasswordUi({ setPasswordCheck }: PasswordProps) {

	const navigate = useNavigate();
	const { t } = useLanguage()

	const PASSWORD_CODE = 7538
	const PASSWORD_LENGTH = 4
	const MAX_TRIES = 3;

	const [triesCounter, setTriesCounter] = useState(MAX_TRIES)
	const [values, setValues] = useState(Array(PASSWORD_LENGTH).fill(''));
	const [passwordState, setPasswordState] = useState({
		img: "",
		text: "",
		textStyle: ""
	});

	function handleSubmit() {

		const enteredCode = Number(values.join(""));

		try {
			if (enteredCode === PASSWORD_CODE) {
				setPasswordState({
					img: passwordUiImgGreen,
					text: t(`Bravo! Your password is correct. Welcome aboard!`),
					textStyle: styles.passwordUi__statusSection__passwordTextCorrect
				});

				setTimeout(() => {
					setPasswordCheck(true);
				}, 1000);

			} else {
				setPasswordState({
					img: passwordUiImgRed,
					text: t(`Something went wrong. Please try again!`),
					textStyle: styles.passwordUi__statusSection__passwordTextIncorrect
				});

				setTriesCounter(prev => {
					const newTriesCounter = prev - 1;
					if (newTriesCounter <= 0) {
						navigate("/401");
					}

					return newTriesCounter;
				});
			}
		}
		catch (err) {
			console.error(err)
		}
	}

	return (
		<div className={styles.passwordUi}>
			<div className={styles.passwordUi__imageSection}>
				<img src={triesCounter === 3 ? passwordUiImgBlue : passwordState.img} />
			</div>

			<div className={styles.passwordUi__statusSection}>
				<p className={triesCounter === 3 ? styles.passwordUi__statusSection__passwordTextDefault : passwordState.textStyle}>{triesCounter === 3 ? t("Enter your 4-digit passcode to unlock group access") : passwordState.text}
				</p>
			</div>

			<div className={styles.passwordUi__inputSection}>
				<PasswordInput handleSubmit={handleSubmit} passwordLength={PASSWORD_LENGTH} values={values} setValues={setValues} />
			</div>

			<div className={styles.passwordUi__triesLeft}>
				<p>Tries Left = {triesCounter}</p>
			</div>

			<div className={styles.passwordUi__buttonSection}>
				<Button
					text={t('Submit')}
					onClick={() => handleSubmit()}
					className="btn btn--affirmation"
				/>
			</div>

		</div>
	)
}

export default PasswordUi