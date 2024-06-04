import { FC } from "react";
import "./Button.scss";
import { useLanguage } from "../../../../controllers/hooks/useLanguages";

interface Props {
  text: string;
  color?: string;
  iconOnRight?: boolean;
  onClick: () => void;
  Icon?: React.ReactNode;
}

const Button: FC<Props> = ({
  text,
  Icon,
  onClick,
  iconOnRight = true,
  color = "var(--green)",
}) => {
  let { dir } = useLanguage();
  if (iconOnRight === false) {
    if (dir === "rtl") {
      dir = "ltr";
    } else {
      dir = "rtl";
    }
  }

  return (
    <button
      className={iconOnRight ? "button" : "button button--right"}
      onClick={onClick}
    >
      <div className="button__text">{text}</div>
      {Icon && (
        <div
          className={
            dir === "rtl" ? "button__icon button__icon--right" : "button__icon"
          }
          style={{ backgroundColor: color }}
        >
          {Icon}
        </div>
      )}
    </button>
  );
};

export default Button;
