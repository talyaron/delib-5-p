import { FC } from "react";
import "./CustomSwitchSmall.scss";
import background from "./customSwitchSmallBackground.svg";

import StepsNoIcon from "../../../../assets/icons/stepsNoIcon.svg?react";
import StepsIcon from "../../../../assets/icons/stepsIcon.svg?react";
import { useLanguage } from "../../../../controllers/hooks/useLanguages";

interface Props {
  label: string;
  textChecked: string;
  textUnchecked: string;
  checked: boolean;
  setChecked: () => void;
}

const CustomSwitchSmall: FC<Props> = ({
	label,
	checked,
	textChecked,
	textUnchecked,
	setChecked,
}) => {

	const {dir} = useLanguage();
	const handleChange = () => {
		setChecked();
	};




	//checked means multi-stage question

	return (
		<div className="custom-switch-small" onClick={handleChange}>
			<div
				className={dir==="rtl"?"background":"background background--ltr"}
				style={{ backgroundImage: `url(${background})` }}
			>
				<div className="ball ball-background" style={{left:dir === 'rtl'?"0rem":"4.15rem"}}>
					<StepsNoIcon /> 
				</div>
				<div className="ball ball-background ball-background-off">
					<StepsIcon />
				</div>
				<div
					className={`ball ball-switch ball-switch--${checked ? "checked" : "unchecked"}`}
					style={{ left: `${checked ? 0 : 4.15}rem` }}
				>
					{checked ? <StepsIcon /> : <StepsNoIcon />}
				</div>
			</div>
			<div className="text">{checked ? textChecked : textUnchecked}</div>
			<input
				type="checkbox"
				name={label}
				id={`toggleSwitchSimple-${label}`}
				className="switch-input"
				onChange={handleChange}
				value={checked ? "on" : "off"}
				checked={checked}
				data-cy={`toggleSwitch-input-${label}`}
			/>
		</div>
	);
};

export default CustomSwitchSmall;
