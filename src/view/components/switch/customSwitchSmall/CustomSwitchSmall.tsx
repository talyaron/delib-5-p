import { FC, useState } from "react";
import "./CustomSwitchSmall.scss";
import background from "./customSwitchSmallBackground.svg";
interface Props {
  label: string;
  textChecked: string;
  textUnchecked: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

const CustomSwitchSmall: FC<Props> = ({
  checked,
  textChecked,
  textUnchecked,
}) => {
  const [_checked, _setChecked] = useState(checked);
  const handleChange = () => {
    _setChecked(!_checked);
  };

  return (
    <div className="custom-switch-small" onClick={handleChange}>
      <div
        className="background"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div
          className={`ball ball--${_checked ? "checked" : "unchecked"}`}
          style={{ left: `${_checked ? 0 : 4.15}rem` }}
        ></div>
      </div>
      <div className="text">{_checked ? textChecked : textUnchecked}</div>
    </div>
  );
};

export default CustomSwitchSmall;
