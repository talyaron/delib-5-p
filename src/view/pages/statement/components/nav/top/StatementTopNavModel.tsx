import { NavObject, Screen } from "delib-npm";
import NavChat from '@/assets/icons/navChatIcon.svg?react'
import NavMainPageIcon from '@/assets/icons/navMainPageIcon.svg?react'
import NavSettings from '@/assets/icons/navSettingsIcon.svg?react'
import NavSolutionIcon from '@/assets/icons/navSolutionIcon.svg?react'
import NavVoteIcon from '@/assets/icons/navVoteIcon.svg?react'
import NavRoomsIcon from '@/assets/icons/navRoomsIcon.svg?react'
import NavInfoIcon from '@/assets/icons/NavInfoIcon.svg?react'

export const allScreensWithoutSettings: NavObject[] = [
	{ link: Screen.DOC, name: "Main", id: "doc", default: false, icon: NavMainPageIcon, }, 
	{ link: Screen.CHAT, name: "Chat", id: "chat", default: true, icon: NavChat },
	{ link: Screen.OPTIONS, name: "Suggestions", id: "options", default: true, icon: NavSolutionIcon, },
	{ link: Screen.VOTE, name: "Voting", id: "vote", default: true, icon: NavVoteIcon, },
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
