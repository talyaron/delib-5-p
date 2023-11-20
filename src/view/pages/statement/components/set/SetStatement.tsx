
// Third party imports
import { Link, useParams } from "react-router-dom"

// Custom components
import { StatementSettings } from "../admin/StatementSettings"
import ArrowBackIosIcon from "../../../../icons/ArrowBackIosIcon"
import ScreenSlide from "../../../../components/animation/ScreenSlide"

export const SetStatement = () => {
    const { statementId } = useParams()
    const isNew = statementId ? false : true
    return (
        <ScreenSlide toSubStatement={true}>
            <div className="setStatement">
                <div className="setStatement__header">
                    <span></span>
                    <h1>{statementId ? "עדכון" : "הוספת קבוצה חדשה"}</h1>
                    <Link to={"/home"} className="setStatement__back">
                        {" "}
                        <ArrowBackIosIcon />
                    </Link>
                </div>
                <div className="page__main">
                    <StatementSettings isNew={isNew} />
                </div>
            </div>
        </ScreenSlide>
    )
}

export default SetStatement
