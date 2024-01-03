import { Statement } from "delib-npm";
import {useEffect, useState} from "react";

export interface StyleProps{
    backgroundColor: string;
    color: string;
}

const initStyle = {
    backgroundColor: "var(--white)",
    color: "lightgray",
};

export default function useStatementColor(statement: Statement): StyleProps {
    const [style, setstyle] = useState(initStyle);

    useEffect(() => {
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
