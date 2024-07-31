"use client"
import { MouseEvent, useState } from "react"
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

function PasswordUi() {
	const navigate = useNavigate();

	const PASSWORD_CODE = 7538
	const PASSWORD_LENGTH = 4
	const MAX_TRIES = 3;

	const [triesCounter, setTriesCounter] = useState(0)
	const [passwordState, setPasswordState] = useState({
		img: "",
		text: "",
		textStyle: ""
	});
	const [values, setValues] = useState(Array(PASSWORD_LENGTH).fill(''));

	function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		try {
			if (triesCounter >= MAX_TRIES - 1) {
				navigate("/401");
				
				return;
			}

			const enteredCode = Number(values.join(""));
			if (enteredCode === PASSWORD_CODE) {
				setPasswordState({
					img: passwordUiImgGreen,
					text: `Bravo! Your passcode is correct. Welcome aboard!`,
					textStyle: styles.passwordUi__statusSection__passwordTextCorrect
				});
			} else {
				setPasswordState({
					img: passwordUiImgRed,
					text: `Something went wrong. Please try again!`,
					textStyle: styles.passwordUi__statusSection__passwordTextIncorrect
				});
			}

			setTriesCounter(prev => prev + 1);
		}
		catch (err) {
			console.error(err)
		}
	}

	return (
		<div className={styles.passwordUi}>
			<div className={styles.passwordUi__imageSection}>
				<img src={triesCounter === 0 ? passwordUiImgBlue : passwordState.img} />
			</div>
			<div className={styles.passwordUi__statusSection}>
				<p className={triesCounter === 0 ? styles.passwordUi__statusSection__passwordTextDefault : passwordState.textStyle}>{triesCounter === 0 ? "Enter your 4-digit passcode to unlock group access" : passwordState.text}
				</p>
			</div>
			<div className={styles.passwordUi__inputSection}>
				<PasswordInput passwordLength={PASSWORD_LENGTH} values={values} setValues={setValues} />
			</div>
			<div className={styles.passwordUi__buttonSection}>
				<Button
					text={'Submit'}
					onClick={(event) => handleSubmit(event)}
					className="btn btn--affirmation"
				/>
			</div>
		</div>
	)
}

export default PasswordUi