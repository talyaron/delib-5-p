import { FC } from "react";

// icons
import AddIcon from "@/assets/icons/plusIcon.svg?react";

import "./Footer.scss";
import IconButton from "../iconButton/IconButton";

interface Props {
    onclick: () => void;
}
const Footer: FC<Props> = ({ onclick }) => {
	return (
		<div className="footer" data-cy="add-statement">
			<IconButton onClick={onclick} className="add-statement-button">
				<AddIcon />
			</IconButton>
		</div>
	);
};

export default Footer;
