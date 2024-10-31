import { FC, useState } from 'react';

import { calculateFontSize } from '@/controllers/general/helpers';
import EditTitle from '@/view/components/edit/EditTitle';
import { Role, Statement, StatementSubscription } from 'delib-npm';

interface Props {
	statement: Statement | undefined;
	statementSubscription: StatementSubscription | undefined;
}

const Title: FC<Props> = ({ statement, statementSubscription }) => {
	//state
	const [editHeader, setEditHeader] = useState<boolean>(false);

	//const
	const titleFontSize = calculateFontSize(statement?.statement, 16, 25);

	function handleEditTitle(): void {
		if (statementSubscription?.role === Role.admin) {
			setEditHeader(true);
		}
	}
	if (!editHeader) {
		return (
			<button onClick={handleEditTitle}>
				<h1
					className={
						statementSubscription?.role === Role.admin ? 'clickable' : ''
					}
					style={{ fontSize: titleFontSize, padding: '0 2rem', color: 'white' }}
					data-cy='statement-header-title'
				>
					{statement?.statement}
				</h1>
			</button>
		);
	} else {
		return (
			<EditTitle
				isEdit={editHeader}
				statement={statement}
				setEdit={setEditHeader}
				onlyTitle={true}
			/>
		);
	}
};

export default Title;
