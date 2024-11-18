// This file contains the SwitchScreens component which is used to switch between process, map and settings
// Third party imports
import { Screen} from 'delib-npm';

// Custom components

import StatementSettings from './settings/StatementSettings';
import Process from '../process/Process';
import { useParams } from 'react-router-dom';

import { useContext } from 'react';
import { MainContext } from '../StatementMain';

export default function SwitchScreens() {

const {statement} = useContext(MainContext);
	if (!statement) return null;
	const { screen } = useParams();

	switch (screen) {
		case Screen.CHAT:
		case Screen.PROCESS:
			return <Process />;
		case Screen.SETTINGS:
			return <StatementSettings />;
		default:
			<Process />;
	}
}
