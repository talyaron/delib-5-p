// CustomSwitch.js
import { FC } from "react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import "./CustomSwitch.scss";

interface Props {
    label: string;
    name: string;
    checked: boolean;
    children: JSX.Element;
    setChecked: (checked: boolean) => void;
}

const CustomSwitch: FC<Props> = ({
	label,
	checked,
	name,
	setChecked,
	children,
}) => {
	const { t } = useLanguage();

	const handleChange = () => {
		setChecked(!checked);
	};

	return (
		<div className={`custom-switch ${checked ? "checked" : ""}`}>
			<div className="tag" onClick={handleChange}>
				{children}
			</div>
			<div
				className="label"
				onClick={handleChange}
				data-cy={`toggleSwitch-${name}`}
			>
				{t(label)}
			</div>
			<input
				type="checkbox"
				name={name}
				id={`toggleSwitch-${name}`}
				className="switch-input"
				onChange={handleChange}
				value={checked ? "on" : "off"}
				checked={checked}
				data-cy={`toggleSwitch-input-${name}`}
			/>
		</div>
	);
};

export default CustomSwitch;
