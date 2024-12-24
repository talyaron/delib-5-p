import { Statement } from "delib-npm";
import DocumentIcon from '@/assets/icons/document.svg?react';
import GroupIcon from '@/assets/icons/group.svg?react';
import { ReactElement } from "react";
import useStatementColor from "@/controllers/hooks/useStatementColor";

type StatementType = 'group' | 'question' | 'document';

interface SubGroupCardReturn {
	Icon: ReactElement;
	backgroundColor: string;
	text: string;
}

const getIconByType = (type: StatementType): ReactElement => {
	switch (type) {
		case 'group':
			return <GroupIcon />;
		case 'question':
		case 'document':
		default:
			return <DocumentIcon />;
	}
};

export default function useSubGroupCard(statement: Statement): SubGroupCardReturn {
	const { backgroundColor } = useStatementColor({ statement });

	try {
		return {
			Icon: getIconByType(statement.statementType as StatementType),
			backgroundColor,
			text: statement.statement
		};
	} catch (error) {
		console.error('Error in useSubGroupCard:', error);
		return {
			Icon: <DocumentIcon />,
			backgroundColor: 'var(--header-home)',
			text: ''
		};
	}
}