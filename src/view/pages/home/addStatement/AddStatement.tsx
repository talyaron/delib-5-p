// Third party imports
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";

// Custom components
import { StatementSettings } from "../../statement/components/admin/settings/StatementSettings";
import useDirection from "../../../../functions/hooks/useDirection";
import ScreenSlide from "../../../components/animation/ScreenSlide";
import BackArrowIcon from "../../../components/icons/BackArrowIcon";

export const AddStatement = () => {
    const direction = useDirection();

    return (
        <ScreenSlide className="page slide-out">
            <div
                className="page__header"
                style={{
                    flexDirection: direction,
                    justifyContent: "space-between",
                    paddingTop: ".5rem",
                }}
            >
                <Link
                    to={"/home"}
                    state={{ from: window.location.pathname }}
                    className="setStatement__back"
                >
                    {" "}
                    <BackArrowIcon color="black" />
                </Link>
                <h1>{t("Add New Group")}</h1>
                <span></span>
            </div>
            <div className="page__main">
                <StatementSettings />
            </div>
        </ScreenSlide>
    );
};

export default AddStatement;
