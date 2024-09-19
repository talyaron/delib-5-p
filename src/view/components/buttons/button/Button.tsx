import { FC } from "react";
import styles from "./Button.module.scss";
import { useLanguage } from "@/controllers/hooks/useLanguages";

export enum ButtonType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  DISABLED = "disabled",
}
interface Props {
  buttonType?: ButtonType;
  text: string;
  type?: "button" | "submit" | "reset";
  bckColor?: string;
  color?: string;
  className?: string;
  iconOnRight?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | undefined;
  icon?: React.ReactNode;
}

const Button: FC<Props> = ({
	text,
	type = "submit",
	icon: Icon,
	onClick = undefined,
	iconOnRight = true,
	className = "",
	buttonType = ButtonType.PRIMARY,
	disabled = false,
}) => {
	let { dir } = useLanguage();
	if (iconOnRight === false) {
		if (dir === "rtl") {
			dir = "ltr";
		} else {
			dir = "rtl";
		}
	}

	const btnTypes = {
		primary: styles["button--primary"],
		secondary: styles["button--secondary"],
		disabled: styles["button--disabled"],
	};

	if(disabled) buttonType = ButtonType.DISABLED;
	
	

	return (
		<button type={type} className={`${styles.button} ${className} ${btnTypes[buttonType]} ${dir === "rtl"?styles.rtl:styles.ltr}`} onClick={!disabled ? onClick : undefined}>
			{Icon && (
				<div className={styles["button__icon-wrapper"]}>
					<div
						className={
							dir === "rtl"
								? `${styles["button__icon"]} ${styles["button__icon--right"]}`
								: `${styles["button__icon"]}` 
						}
					>
						{Icon}
					</div>
				</div>
			)}
			<div className={styles["button__text"]}>{text}</div>
		</button>
	);
};

export default Button;
