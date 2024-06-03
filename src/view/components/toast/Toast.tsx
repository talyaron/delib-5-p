import { FC } from "react";
import "./Toast.scss";
import X from "../../../assets/icons/x.svg?react";

interface Props {
  text: string;
  type: "error" | "success" | "message";
  show: boolean;
    setShow: (show: boolean) => void;
}

const Toast: FC<Props> = ({ text, type, show, setShow }) => {
  

  if (!show) return null;

  return (
    <div className="toast" style={{backgroundColor:getToastColor(type)}}>
      <p className="text"> Toast: {text}</p>
      <div className="close">
        <div className="close__x" onClick={() => setShow(false)}>
          <X />
        </div>
      </div>
    </div>
  );
};

export default Toast;

function getToastColor(type: "error" | "success" | "message") {
  switch (type) {
    case "error":
      return "#E8749E";
    case "success":
      return "#6FC5BE";
    case "message":
      return "#6DB0F9";
    default:
      return "#6FC5BE";
  }
}
