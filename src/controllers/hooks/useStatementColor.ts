import { StatementType, Statement } from "delib-npm";

import { useEffect, useState } from "react";

export interface StyleProps {
	backgroundColor: string;
	color: string;
}

export default function useStatementColor({ statement }: { statement: Statement | undefined }): StyleProps {
	const initStyle = {
		backgroundColor: "var(--header-home)",
		color: "white",
	};

	if (!statement) return initStyle;

	const { statementType, isResult } = statement;
	const [style, setStyle] = useState(initStyle);

	try {

		useEffect(() => {
			if (statementType === StatementType.group) {
				setStyle({
					backgroundColor: "var(--question-header)",
					color: "var(--white)",
				});
			} else if (statementType === StatementType.option && isResult) {
				setStyle({
					backgroundColor: "var(--agree)",
					color: "var(--header)",
				});
			} else if (statementType === StatementType.option) {
				setStyle({
					backgroundColor: "var(--option)",
					color: "var(--white)",
				});
			} else if (statementType === StatementType.question) {
				setStyle({
					backgroundColor: "var(--header-home)",
					color: "white",
				});
			} else {
				setStyle(initStyle);
			}
		}, [statementType, isResult]);

		return style;
	} catch (error) {
		console.error(error);

		return style;
	}
}
