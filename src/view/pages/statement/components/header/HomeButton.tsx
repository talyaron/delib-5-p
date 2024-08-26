import { FC } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@/assets/icons/homeIcon.svg?react";
import { StyleProps } from "@/controllers/hooks/useStatementColor";

interface Props {
    headerColor: StyleProps;
}
const HomeButton: FC<Props> = ({ headerColor }) => {
	return (
		<Link
			className="page__header__wrapper__actions__iconButton"
			state={{ from: window.location.pathname }}
			to={"/home"}
			aria-label="Back to Home page"
			data-cy="home-link-icon"
		>
			<HomeIcon style={{ color: headerColor.color }} />
		</Link>
	);
};

export default HomeButton;
