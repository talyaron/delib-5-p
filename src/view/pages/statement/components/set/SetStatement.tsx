// Third party imports
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";

// Custom components
import { StatementSettings } from "../admin/StatementSettings";
import ArrowBackIosIcon from "../../../../icons/ArrowBackIosIcon";
import ScreenSlide from "../../../../components/animation/ScreenSlide";
import useDirection from "../../../../../functions/hooks/useDirection";

export const SetStatement = () => {
    const { statementId } = useParams();

    const direction = useDirection();

    return (
        <ScreenSlide toSubStatement={true} className="setStatement">
            <div
                className="setStatement__header"
                style={{ flexDirection: direction }}
            >
                <Link to={"/home"} className="setStatement__back">
                    {" "}
                    <ArrowBackIosIcon />
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
