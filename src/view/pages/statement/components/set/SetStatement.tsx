// Third party imports
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";

// Custom components
import { StatementSettings } from "../admin/settings/StatementSettings";
import useDirection from "../../../../../functions/hooks/useDirection";
import ScreenSlide from "../../../../components/animation/ScreenSlide";
import BackArrowIcon from "../../../../components/icons/BackArrowIcon";

export const SetStatement = () => {
    const { statementId } = useParams();

    const direction = useDirection();

    return (
        <ScreenSlide className="setStatement slide-out">
            <div
                className="setStatement__header"
                style={{ flexDirection: direction }}
            >
                <Link
                    to={"/home"}
                    state={{ from: window.location.pathname }}
                    className="setStatement__back"
                >
                    {" "}
                    <BackArrowIcon color="black" />
                </Link>
                <h1>{statementId ? t("Update") : t("Add New Group")}</h1>
                <span></span>
            </div>
            <div className="page__main">
                <StatementSettings />
            </div>
        </ScreenSlide>
    );
};

export default SetStatement;
