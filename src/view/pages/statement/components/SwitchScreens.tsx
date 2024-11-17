// This file contains the SwitchScreens component which is used to switch between the different tabs within statement

// Third party imports
import { Screen} from 'delib-npm';

// Custom components

import StatementSettings from './settings/StatementSettings';
import StatementChat from './chat/StatementChat';
import Process from '../process/Process';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementStagesSelector } from '@/model/stages/stagesSlice';
import { useContext } from 'react';
import { MainContext } from '../StatementMain';

export default function SwitchScreens() {

const {statement} = useContext(MainContext);
	if (!statement) return null;
	const { screen } = useParams();

	//does it have process?
	const stages = useSelector(statementStagesSelector(statement.statementId));
	const hasStages = stages.length > 0;

	switch (screen) {
		case Screen.CHAT:
			return redirectTo();
		case Screen.PROCESS:
			return <Process />;
		case Screen.SETTINGS:
			return <StatementSettings />;

		default:
			return redirectTo();
	}

	function redirectTo() {
		if (hasStages) {
			return <Process />;
		} else {
			return (
				<StatementChat />
			);
		}
	}
}
