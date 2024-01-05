import { Statement } from "delib-npm";
import { useEffect, useState } from "react";

export interface StyleProps {
    backgroundColor: string;
    color: string;
}

const initStyle = {
    backgroundColor: "var(--white)",
    color: "lightgray",
};

export default function useStatementColor(statementType: string): StyleProps {
    const [style, setstyle] = useState(initStyle);

    useEffect(() => {
        switch (statementType) {
            case "question":
                setstyle({
                    backgroundColor: "var(--question)",
                    color: "var(--white)",
                });
                break;
            case "option":
                setstyle({
                    backgroundColor: "var(--option)",
                    color: "var(--header)",
                });
                break;
            case "result":
                setstyle({
                    backgroundColor: "var(--agree)",
                    color: "var(--header)",
                });
                break;
            default:
                setstyle(initStyle);
                break;
        }
    }, []);

    return style;
}
