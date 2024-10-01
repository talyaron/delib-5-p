// CustomSwitch.js
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { FC } from "react";
import "./CustomSwitch.scss";
import VisuallyHidden from "../../accessibility/toScreenReaders/VisuallyHidden";

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
		<div className={`custom-switch ${checked ? "checked" : ""}`} >
			<button className="tag" onClick={handleChange} aria-label="custom switch" type="button">
				{children}
			</button>
			<button
				className="label"
				onClick={handleChange}
				data-cy={`toggleSwitch-${name}`}
				type='button'
				
			>
				{t(label)}
			</button>
			<label htmlFor={`toggleSwitch-${name}`}>
				<VisuallyHidden labelName={label} />
			</label>
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
