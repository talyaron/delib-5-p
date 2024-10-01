import { FC } from "react";
import "./CustomSwitchSmall.scss";
import BackgroundImage from "./customSwitchSmallBackground.svg";

import StepsIcon from "@/assets/icons/stepsIcon.svg?react";
import StepsNoIcon from "@/assets/icons/stepsNoIcon.svg?react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import VisuallyHidden from "../../accessibility/toScreenReaders/VisuallyHidden";

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
		<div className="custom-switch-small">
			<div
				className={dir==="rtl"?"background":"background background--ltr"}
				style={{ backgroundImage: `url(${BackgroundImage})` }}
			>
				<div className="ball ball-background" style={{left:"4.15rem"}}>
					<StepsNoIcon /> 
				</div>
				<div className="ball ball-background ball-background-off">
					<StepsIcon />
				</div>
				<button
					className={`ball ball-switch ball-switch--${checked ? "checked" : "unchecked"}`}
					type="button"
					style={{ left: `${checked ? 0 : 4.15}rem` }}
					aria-label={checked ? "Turn off" : "Turn on"}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') { 
							e.preventDefault(); 
							handleChange(); 
						}
					}}
				>
					{checked ? <StepsIcon /> : <StepsNoIcon />}
				</button>
			</div>
			<div className="text">{checked ? textChecked : textUnchecked}</div>
			<label htmlFor={`toggleSwitchSimple-${label}`}>
				<VisuallyHidden labelName={label} />
			</label>
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
