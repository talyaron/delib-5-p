import React from "react"

// Third party imports
import { Link, useParams } from "react-router-dom"

// Custom components
import { StatementSettings } from "../admin/StatementSettings"
import ArrowBackIosIcon from "../../../../icons/ArrowBackIosIcon"

export const SetStatement = () => {
    const { statementId } = useParams()
    return (
        <div className="page setStatement">
            <div className="page__header setStatement__header">
                <span></span>
                <h1>{statementId ? "עדכון" : "הוספת קבוצה חדשה"}</h1>
                <Link to={"/home"} className="setStatement__back">
                    {" "}
                    <ArrowBackIosIcon />
                </Link>
            </div>
            <div className="page__main">
                <StatementSettings />
            </div>
        </div>
    )
}

export default SetStatement
