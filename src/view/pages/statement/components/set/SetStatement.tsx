// Third party imports
import { Link, useParams } from "react-router-dom"
import { t } from "i18next"

// Custom components
import { StatementSettings } from "../admin/StatementSettings"
import ArrowBackIosIcon from "../../../../icons/ArrowBackIosIcon"
import ScreenSlide from "../../../../components/animation/ScreenSlide"

export const SetStatement = () => {
    const { statementId } = useParams()

    const direction =
        document.body.style.direction === "rtl" ? "row" : "row-reverse"

    return (
        <ScreenSlide toSubStatement={true}>
            <div className="setStatement">
                <div
                    className="setStatement__header"
                    style={{ flexDirection: direction }}
                >
                    <span></span>
                    <h1>{statementId ? t("Update") : t("Add New Group")}</h1>
                    <Link to={"/home"} className="setStatement__back">
                        {" "}
                        <ArrowBackIosIcon />
                    </Link>
                </div>
                <div className="page__main">
                    <StatementSettings />
                </div>
            </div>
        </ScreenSlide>
    )
}

export default SetStatement
