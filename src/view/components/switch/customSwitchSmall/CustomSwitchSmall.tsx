import React, { FC, useState } from "react";
import "./CustomSwitchSmall.scss";
import VisuallyHidden from "../../accessibility/toScreenReaders/VisuallyHidden";
import BackgroundImage from "./customSwitchSmallBackground.svg";


import { useLanguage } from "@/controllers/hooks/useLanguages";

interface Props {
	label: string;
	textChecked: string;
	textUnchecked: string;
	imageChecked: React.ReactNode;
	imageUnchecked: React.ReactNode;
	checked: boolean;
	setChecked: (check: boolean) => void;
}

const CustomSwitchSmall: FC<Props> = ({
	label,
	checked,
	textChecked,
	textUnchecked,
	imageChecked,
	imageUnchecked,
	setChecked,
}) => {

	const { dir } = useLanguage();
	const [_checked, _setChecked] = useState<boolean>(checked);
	const handleChange = () => {
		_setChecked(!_checked);
	};

	//checked means multi-stage question

	return (
		<div className="custom-switch-small" onClick={handleChange}>
			<div
				className={dir === "rtl" ? "background" : "background background--ltr"}
				style={{ backgroundImage: `url(${BackgroundImage})` }}
			>
				<div className="ball ball-background" style={{ left: "4.15rem" }}>
					{imageUnchecked}
				</div>
				<div className="ball ball-background ball-background-off">
					{imageChecked}
				</div>
				<button
					className={`ball ball-switch ball-switch--${_checked ? "checked" : "unchecked"}`}
					type="button"
					style={{ left: `${_checked ? 0 : 4.15}rem` }}
					aria-label={_checked ? "Turn off" : "Turn on"}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleChange();
						}
					}}
				>
					{_checked ? imageChecked : imageUnchecked}
				</button>
			</div>
			<div className="text">{_checked ? textChecked : textUnchecked}</div>
			<label htmlFor={`toggleSwitchSimple-${label}`}>
				<VisuallyHidden labelName={label} />
			</label>
			<input
				type="checkbox"
				name={label}
				id={`toggleSwitchSimple-${label}`}
				className="switch-input"
				onChange={handleChange}
				value={_checked ? "on" : "off"}
				checked={_checked}
				data-cy={`toggleSwitch-input-${label}`}
			/>
		</div>
	);
};

export default CustomSwitchSmall;
