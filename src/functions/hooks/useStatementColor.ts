import { Statement } from "delib-npm";
import React from "react";

export default function useStatementColor(statement: Statement) {
    const [color, setColor] = React.useState("var(--question");

    React.useEffect(() => {
        switch (statement.statementType) {
            case "question":
                setColor("var(--question)");
                break;
            case "option":
                setColor("var(--option)");
                break;
            case "result":
                setColor("var(--agree)");
                break;
            default:
                setColor("var(--white)");
                break;
        }
    }, [statement]);

    return color;
}
