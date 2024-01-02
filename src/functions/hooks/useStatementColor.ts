import { Statement } from "delib-npm";
import React from "react";

const initStyle = {
    backgroundColor: "var(--white)",
    color: "var(--black)",
};

export default function useStatementColor(statement: Statement) {
    const [style, setstyle] = React.useState(initStyle);

    React.useEffect(() => {
        switch (statement.statementType) {
            case "question":
                setstyle({
                    backgroundColor: "var(--question)",
                    color: "var(--white)",
                });
                break;
            case "option":
                setstyle({
                    backgroundColor: "var(--option)",
                    color: "black",
                });
                break;
            case "result":
                setstyle({
                    backgroundColor: "var(--agree)",
                    color: "black",
                });
                break;
            default:
                setstyle(initStyle);
                break;
        }
    }, [statement]);

    return style;
}
