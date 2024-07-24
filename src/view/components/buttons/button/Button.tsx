import { FC } from "react";
import "./Button.scss";
import { useLanguage } from "@/controllers/hooks/useLanguages";

interface Props {
	text: string;
	bckColor?: string;
	color?: string;
	className?: string;
	iconOnRight?: boolean;
	onClick: () => void;
	icon?: React.ReactNode;
}

const Button: FC<Props> = ({
	text,
	icon: Icon,
	onClick,
	iconOnRight = true,
	className = "",
}) => {
	let { dir } = useLanguage();
	if (iconOnRight === false) {
		if (dir === "rtl") {
			dir = "ltr";
		} else {
			dir = "rtl";
		}
	}

	const buttonClassName = `button ${iconOnRight ? "" : "button--right"} ${Icon ? "button--with-icon" : ""} ${className}`.trim();

	return (
		<button className={buttonClassName} onClick={onClick}>
			<div className="button__text">{text}</div>
			{Icon && (
				<div className="button__icon-wrapper">
					<div
						className={
							dir === "rtl" ? "button__icon button__icon--right" : "button__icon"
						}
					>
						{Icon}
					</div>
				</div>
			)}
		</button>
	);
};

export default Button;
