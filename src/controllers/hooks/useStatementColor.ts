import { StatementType } from "delib-npm";
import { useEffect, useState } from "react";

export interface StyleProps {
	backgroundColor: string;
	color: string;
}


export default function useStatementColor(statementType?: StatementType): StyleProps {
	const initStyle = {
		backgroundColor: "transparent",
		color: "transparent",
	};
	const [style, setStyle] = useState(initStyle);

	try {

		useEffect(() => {
			switch (statementType) {
				case StatementType.question:
					setStyle({
						backgroundColor: "var(--question-header)",
						color: "var(--white)",
					});
					break;
				case StatementType.option:
					setStyle({
						backgroundColor: "var(--option)",
						color: "var(--header)",
					});
					break;
				case StatementType.result:
					setStyle({
						backgroundColor: "var(--agree)",
						color: "var(--white)",
					});
					break;
				case StatementType.statement:
					setStyle({
						backgroundColor: "gray",
						color: "white",
					});
					break;
				default:
					setStyle(initStyle);
					break;
			}
		}, [statementType]);

		return style;
	} catch (error) {
		console.error(error);
		return style;
	}
}
