import { FC, useState } from "react";
import "./Toast.scss";
import X from "../../../assets/icons/x.svg?react";

interface Props {
  text: string;
}

const Toast: FC<Props> = ({ text }) => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="toast">
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
