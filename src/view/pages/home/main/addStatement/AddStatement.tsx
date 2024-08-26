// Third party imports
import { Link } from "react-router-dom";

// Custom components
import StatementSettings from "@/view/pages/statement/components/settings/StatementSettings";
import ScreenSlide from "@/view/components/animation/ScreenSlide";
import BackArrowIcon from "@/assets/icons/chevronLeftIcon.svg?react";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import "./AddStatement.scss";

export const AddStatement = () => {
	const { t, dir } = useLanguage();

	return (
		<ScreenSlide className={`page slide-out add-statement`}>
			<div className={`page__header ${dir}`}>
				<Link
					to={"/home"}
					state={{ from: window.location.pathname }}
					className="back-arrow-icon"
					aria-label="Back to Home page"
				>
					<BackArrowIcon />
				</Link>
				<h1>{t("Add New Group")}</h1>
			</div>
			<StatementSettings />
		</ScreenSlide>
	);
};

export default AddStatement;
