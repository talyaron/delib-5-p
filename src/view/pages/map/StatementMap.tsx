import React from "react";
import { useLocation, useParams } from "react-router-dom";

export default function StatementMap() {
    const { statementId } = useParams();
    const location = useLocation();

    const statement = location.state.top

    console.log(location.state);


    return (
        <div className="center">
            Statement ID - {statementId}
            <h1>{statement?.statement}</h1>
        </div>
    );
}
