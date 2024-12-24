import { Statement } from "delib-npm";
import DocumentIcon from '@/assets/icons/document.svg?react';
import GroupIcon from '@/assets/icons/group.svg?react';
import { ReactNode, useEffect, useState } from "react";

export default function useSubGroupCard(statement: Statement): { Icon: ReactNode } {
	try {
		const [icon, setIcon] = useState<ReactNode>(<DocumentIcon />);

		useEffect(() => {
			if (statement.statementType === 'group') {
				setIcon(<GroupIcon />);
			} else if (statement.statementType === 'question') {
				setIcon(<DocumentIcon />);
			} else {
				setIcon(<DocumentIcon />);
			}
		}, [statement.statementType]);

		return { Icon: icon };
	} catch (error) {
		console.error(error);
		return { Icon: <DocumentIcon /> };
	}
}