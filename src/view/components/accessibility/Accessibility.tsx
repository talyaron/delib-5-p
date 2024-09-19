import { useEffect, useState } from "react";

// Redux Store
import {
	useAppDispatch,
	useAppSelector,
} from "@/controllers/hooks/reduxHooks";
import {
	colorContrastSelector,
	fontSizeSelector,
	increaseFontSize,
	toggleColorContrast,
	userSelector,
} from "@/model/users/userSlice";
import { updateUserFontSize } from "@/controllers/db/users/setUsersDB";

// Icons
import AccessibilityIcon from "@/assets/icons/accessibilityIcon.svg?react";
import { defaultFontSize } from "@/model/fonts/fontsModel";
import IconButton from "../iconButton/IconButton";
import "./Accessibility.scss";
import { colorMappings } from "./colorContrast";

const Accessibility = () => {
	const dispatch = useAppDispatch();
	const fontSize = useAppSelector(fontSizeSelector);
	const user = useAppSelector(userSelector);
	const colorContrast = useAppSelector(colorContrastSelector)
	
	
	useEffect(() => {
		Object.entries(colorMappings).forEach(([key, contrastKey]) => {
			document.documentElement.style.setProperty(
			  key,
			  colorContrast ? `var(${contrastKey})` : '' 
			);
		  });
		
	  }, [colorContrast]);

	const handleToggleContrast = () => {
		dispatch(toggleColorContrast());
	};

	const [isOpen, setIsOpen] = useState(false);
	const [_fontSize, setFontSize] = useState(fontSize || defaultFontSize);

	useEffect(() => {
		// document.documentElement.style.fontSize = fontSize + "px";
		document.documentElement.style.fontSize = fontSize + "px";
	}, [fontSize]);

	function handleChangeFontSize(number: number) {
		if (!user) {
			//get current font size from body

			//update body font size
			// document.documentElement.style.fontSize = `${_fontSize + number}px`;
			document.body.style.fontSize = `${_fontSize + number}px`;
			setFontSize(_fontSize + number);
		} else {
			updateUserFontSize(fontSize + number);
			dispatch(increaseFontSize(number));
		}
	}

	function handleOpen() {
		if (isOpen) {
			// If it's not open, open it and start the timer to close it after 2 seconds
			setIsOpen(false);
		} else {
			// If it's already open, close it immediately
			setIsOpen(true);
			setTimeout(() => {
				setIsOpen(false);
			}, 14000);
		}
	}

	return (
		<div
			className="accessibility"
			style={!isOpen ? { left: "-18.6rem" } : { left: "0rem" }}
		>
			<button className="accessibility-button" onClick={handleOpen}>			
				<AccessibilityIcon />
			</button>
			<button onClick={handleToggleContrast}>
                Toggle Contrast
			</button>
			<div className="accessibility-fonts">
				<IconButton
					className="change-font-size-button"
					onClick={() => handleChangeFontSize(1)}
				>
                    +
				</IconButton>
				<div className="accessibility__fonts__size" role="status">
					{user ? fontSize : _fontSize}px
				</div>
				<IconButton
					className="change-font-size-button"
					onClick={() => handleChangeFontSize(-1)}
				>
                    -
				</IconButton>
				<span dir="ltr">Fonts:</span>
			</div>
		</div>
	);
};

export default Accessibility;
