import { NavObject, Screen } from "delib-npm";
import NavChat from '../../../../../../assets/icons/navChatIcon.svg'
import NavSettings from '../../../../../../assets/icons/navSettingsIcon.svg'
import NavSolutionIcon from '../../../../../../assets/icons/navSolutionIcon.svg'
import NavQuestionsIcon from '../../../../../../assets/icons/navQuestionsIcon.svg'
import NavVoteIcon from '../../../../../../assets/icons/navVoteIcon.svg'
import NavRoomsIcon from '../../../../../../assets/icons/navRoomsIcon.svg'
import navMainPageIcon from '../../../../../../assets/icons/navMainPageIcon.svg'

export const allScreensWithoutSettings: NavObject[] = [
	{ link: Screen.DOC, name: "Main", id: "doc", default: false, icon: navMainPageIcon, },
	{ link: Screen.CHAT, name: "Chat", id: "chat", default: true, icon: NavChat, },
	{ link: Screen.OPTIONS, name: "Evaluations", id: "options", default: true, icon: NavSolutionIcon, },
	{ link: Screen.QUESTIONS, name: "Questions", id: "questions", default: false, icon: NavQuestionsIcon, },
	{ link: Screen.VOTE, name: "Voting", id: "vote", default: true, icon: NavVoteIcon, },
	{ link: Screen.MASS_QUESTIONS, name: "Mass Questions", id: "questions-mass", default: false, icon: NavQuestionsIcon, },
	{ link: Screen.GROUPS, name: "Rooms", id: "rooms", default: false, icon: NavRoomsIcon, },
];

export const allScreens = [
	...allScreensWithoutSettings,
	{
		link: Screen.SETTINGS,
		name: "Settings",
		id: "settings",
		icon: NavSettings,
	},
];
