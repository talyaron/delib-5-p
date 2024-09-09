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
  bckColor?: string;
  color?: string;
  className?: string;
  iconOnRight?: boolean;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
}

const Button: FC<Props> = ({
	text,
	icon: Icon,
	onClick,
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
  console.log("disabled", disabled);
  console.log("buttonType", buttonType);

	return (
		<button className={`${styles.button} ${className} ${btnTypes[buttonType]}`} onClick={!disabled? onClick:()=>{}}>
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
