import { ComponentProps, FC } from 'react';
import './MenuOption.scss';

interface MenuOptionProps extends ComponentProps<'button'> {
	onOptionClick: () => void;
	label: string;
	isOptionSelected?: boolean;
	icon: JSX.Element;
}

const MenuOption: FC<MenuOptionProps> = ({
	onOptionClick,
	label,
	isOptionSelected = false,
	icon,
}) => {
	return (
		<button
			className={`menu-option ${isOptionSelected ? 'selected' : ''}`}
			onClick={onOptionClick}
		>
			{icon}
			<div className="label">{label}</div>
		</button>
	);
};

export default MenuOption;
