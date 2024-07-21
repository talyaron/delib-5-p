import { Screen } from "delib-npm";

// icons
import NetworkIcon from "../../../../../../../assets/icons/networkIcon.svg?react";
import ChatIcon from "../../../../../../../assets/icons/roundedChatDotIcon.svg?react";
import EvaluationsIcon from "../../../../../../../assets/icons/evaluationsIcon.svg?react";
import VotingIcon from "../../../../../../../assets/icons/votingIcon.svg?react";
import QuestionIcon from "../../../../../../../assets/icons/questionIcon.svg?react";
import MassQuestionsIcon from "../../../../../../../assets/icons/massQuestionsIcon.svg?react";
import RoomsIcon from "../../../../../../../assets/icons/roomsIcon.svg?react";
import SettingsIcon from "../../../../../../../assets/icons/settingsIcon.svg?react";
import InfoIcon from "../../../../../../../assets/icons/infoCircleIcon.svg?react";
import { FC } from "react";

interface TabIconProps {
    screenLink: Screen;
}

const TabIcon: FC<TabIconProps> = ({ screenLink }) => {
	switch (screenLink) {
	case Screen.DOC:
		return <NetworkIcon />;
	case Screen.CHAT:
		return <ChatIcon />;
	case Screen.OPTIONS:
		return <EvaluationsIcon />;
	case Screen.VOTE:
		return <VotingIcon />;
	case Screen.QUESTIONS:
		return <QuestionIcon />;
	case Screen.MASS_QUESTIONS:
		return <MassQuestionsIcon />;
	case Screen.GROUPS:
		return <RoomsIcon />;
	case Screen.SETTINGS:
		return <SettingsIcon />;
	case Screen.INFO:
		return <InfoIcon />;
	default:
		return <QuestionIcon />;
	}
};

export default TabIcon;
