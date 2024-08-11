import { NavObject, Screen } from "delib-npm";
import NavChat from '@/assets/icons/navChatIcon.svg?react'
import NavMainPageIcon from '@/assets/icons/navMainPageIcon.svg?react'
import NavSettings from '@/assets/icons/navSettingsIcon.svg?react'
import NavSolutionIcon from '@/assets/icons/navSolutionIcon.svg?react'
import NavQuestionsIcon from '@/assets/icons/navQuestionsIcon.svg?react'
import NavVoteIcon from '@/assets/icons/navVoteIcon.svg?react'
import NavRoomsIcon from '@/assets/icons/navRoomsIcon.svg?react'
import NavMassQuestionsIcon from '@/assets/icons/NavMassQuestionsIcon.svg?react'
import NavInfoIcon from '@/assets/icons/NavInfoIcon.svg?react'

export const allScreensWithoutSettings: NavObject[] = [
	{ link: Screen.DOC, name: "Main", id: "doc", default: false, icon: NavMainPageIcon, }, 
	{ link: Screen.CHAT, name: "Chat", id: "chat", default: true, icon: NavChat },
	{ link: Screen.OPTIONS, name: "Evaluations", id: "options", default: true, icon: NavSolutionIcon, },
	{ link: Screen.QUESTIONS, name: "Questions", id: "questions", default: false, icon: NavQuestionsIcon, },
	{ link: Screen.VOTE, name: "Voting", id: "vote", default: true, icon: NavVoteIcon, },
	{ link: Screen.MASS_QUESTIONS, name: "Mass Questions", id: "questions-mass", default: false, icon: NavMassQuestionsIcon, },
	{ link: Screen.GROUPS, name: "Rooms", id: "rooms", default: false, icon: NavRoomsIcon, },
	{ link: Screen.INFO,	 name: "Info", id: "info", default: false, icon: NavInfoIcon, },
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
