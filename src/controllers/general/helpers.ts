import {
	Role,
	Screen,
	Statement,
	StatementSubscription,
	StatementType,
	User,
	isOptionFn,
} from "delib-npm";
import { store } from "@/model/store";
import { NavigateFunction } from "react-router-dom";
import { logOut } from "../db/auth";
import { setUser } from "@/model/users/userSlice";
import { ZodError, ZodIssue } from "zod";

export function updateArray<T>(
	currentArray: Array<T>,
	newItem: T,
	updateByProperty: keyof T & string,
): Array<T> {
	try {
		const arrayTemp = [...currentArray];

		if (!newItem[updateByProperty]) {
			throw new Error(`Item doesn't have property ${updateByProperty}`);
		}

		//find in array;
		const index = arrayTemp.findIndex(
			(item) => item[updateByProperty] === newItem[updateByProperty],
		);
		if (index === -1) arrayTemp.push(newItem);
		else {
			const oldItem = JSON.stringify(arrayTemp[index]);
			const newItemString = JSON.stringify({
				...arrayTemp[index],
				...newItem,
			});
			if (oldItem !== newItemString)
				arrayTemp[index] = { ...arrayTemp[index], ...newItem };
		}

		return arrayTemp;
	} catch (error) {
		console.error(error);

		return currentArray;
	}
}

export function isAuthorized(
	statement: Statement,
	statementSubscription: StatementSubscription | undefined,
	parentStatementCreatorId?: string | undefined,
	authorizedRoles?: Array<Role>,
) {
	try {
		if (!statement) throw new Error("No statement");

		const user = store.getState().user.user;
		if (!user || !user.uid) throw new Error("No user");
		if (statement.creatorId === user.uid) return true;

		if (parentStatementCreatorId === user.uid) return true;

		if (!statementSubscription) return false;

		const role = statementSubscription?.role;

		if (role === Role.admin) {
			return true;
		}

		if (authorizedRoles && authorizedRoles.includes(role)) return true;

		return false;
	} catch (error) {
		console.error(error);

		return false;
	}
}

export function isAdmin(role: Role | undefined): boolean {
	if (role === Role.admin || role === Role.creator) return true;

	return false;
}

export function navigateToStatementTab(
	statement: Statement,
	navigate: NavigateFunction,
) {
	try {
		if (!statement) throw new Error("No statement");
		if (!navigate) throw new Error("No navigate function");

		// If chat is a sub screen, navigate to chat.
		// Otherwise, navigate to the first sub screen.

		const tab = statement.subScreens?.includes(Screen.CHAT)
			? Screen.CHAT
			: statement.subScreens
				? statement.subScreens[0]
				: Screen.SETTINGS;

		navigate(`/statement/${statement.statementId}/${tab}`, {
			state: { from: window.location.pathname },
		});
	} catch (error) {
		console.error(error);
	}
}

export function getInitials(fullName: string) {
	// Split the full name into words
	const words = fullName.split(" ");

	// Initialize an empty string to store the initials
	let initials = "";

	// Iterate through each word and append the first letter to the initials string
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		if (word.length > 0) {
			initials += word[0].toUpperCase();
		}
	}

	return initials;
}

export function generateRandomLightColor(uuid: string) {
	// Generate a random number based on the UUID
	const seed = parseInt(uuid.replace(/[^\d]/g, ""), 10);
	const randomValue = (seed * 9301 + 49297) % 233280;

	// Convert the random number to a hexadecimal color code
	const hexColor = `#${((randomValue & 0x00ffffff) | 0xc0c0c0)
		.toString(16)
		.toUpperCase()}`;

	return hexColor;
}

export const statementTitleToDisplay = (
	statement: string,
	titleLength: number,
) => {
	const _title =
		statement.split("\n")[0].replace("*", "") || statement.replace("*", "");

	const titleToSet =
		_title.length > titleLength - 3
			? _title.substring(0, titleLength) + "..."
			: _title;

	return { shortVersion: titleToSet, fullVersion: _title };
};

//function which check if the statement can be linked to children
export function linkToChildren(
	statement: Statement,
	parentStatement: Statement,
): boolean {
	try {
		const isQuestion = statement.statementType === StatementType.question;
		const isOption = isOptionFn(statement);
		const hasChildren = parentStatement.hasChildren;

		if (isQuestion) return true;
		if (isOption && hasChildren) return true;

		return false;
	} catch (error) {
		console.error(error);

		return false;
	}
}

export function getPastelColor() {
	return `hsl(${360 * Math.random()},100%,75%)` || "red";
}

export function calculateFontSize(text: string, maxSize = 6, minSize = 14) {
	// Set the base font size and a multiplier for adjusting based on text length
	const baseFontSize = minSize;
	const fontSizeMultiplier = 0.2;

	// Calculate the font size based on the length of the text
	const fontSize = Math.max(
		baseFontSize - fontSizeMultiplier * text.length,
		maxSize,
	);

	return `${fontSize}px`;
}

export function handleLogout() {
	logOut();
	store.dispatch(setUser(null));
}

export function getTitle(statement: Statement | undefined) {
	try {
		if (!statement) return "";

		const title = statement.statement.split("\n")[0].replace("*", "");

		return title;
	} catch (error) {
		console.error(error);

		return "";
	}
}

export function getDescription(statement: Statement) {
	try {
		if (!statement) throw new Error("No statement");

		const description = statement.statement.split("\n").slice(1).join("\n");

		return description;
	} catch (error) {
		console.error(error);

		return "";
	}
}

export function getSetTimerId(statementId: string, order: number) {
	return `${statementId}--${order}`;
}

export function getRoomTimerId(
	statementId: string,
	roomNumber: number,
	order: number,
) {
	return `${statementId}--${roomNumber}--${order}`;
}

export function getStatementSubscriptionId(
	statementId: string,
	user: User,
): string | undefined {
	try {
		if (!user || !user.uid) throw new Error("No user");
		if (!statementId) throw new Error("No statementId");

		return `${user.uid}--${statementId}`;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}

export function getFirstScreen(array: Array<Screen>): Screen {
	try {
		//get the first screen from the array by this order: home, questions, options, chat, vote
		if (!array) throw new Error("No array");

		if (array.includes(Screen.HOME)) return Screen.HOME;
		if (array.includes(Screen.QUESTIONS)) return Screen.QUESTIONS;
		if (array.includes(Screen.OPTIONS)) return Screen.OPTIONS;
		if (array.includes(Screen.CHAT)) return Screen.CHAT;
		if (array.includes(Screen.VOTE)) return Screen.VOTE;

		return Screen.CHAT;
	} catch (error) {
		console.error(error);

		return Screen.CHAT;
	}
}

//get first name from full name or first name with firs family name letter

export function getFirstName(fullName: string) {
	try {
		if (!fullName) return "";
		const names = fullName.split(" ");
		if (names.length > 1) return names[0] + " " + names[1][0] + ".";

		return names[0];
	} catch (error) {
		console.error(error);

		return "";
	}
}

export function writeZodError(error: ZodError, object: unknown): void {
	try {
		error.issues.forEach((issue: ZodIssue) => {
			console.error(`Error at ${issue.path.join('.')}: ${issue.message} (${issue.code})`);


			console.info("Object sent:", object)
		});

	} catch (error) {
		console.error(error);
	}
}

export function getNumberDigits(number: number): number {
	const _number = Math.floor(number);

	return _number.toString().length;
}

export function isProduction(): boolean {
	return location.hostname !== "localhost"
}

export const handleCloseInviteModal = (setShowModal: (show: boolean) => void) => {
	const inviteModal = document.querySelector(".inviteModal") as HTMLDivElement;
	inviteModal.classList.add("closing");

	setTimeout(() => {
		setShowModal(false);
	}, 400);
};

export function getLastElements(array: Array<unknown>, number: number): Array<unknown> {
	return array.slice(Math.max(array.length - number, 1));
}

export function getTime(time: number): string {
	const timeEvent = new Date(time);
	const hours = timeEvent.getHours();
	const minutes = timeEvent.getMinutes();

	const timeDay = timeEvent.getDate();
	const timeMonth = timeEvent.getMonth() + 1;
	const timeYear = timeEvent.getFullYear();

	const currentTime = new Date();
	const currentDay = currentTime.getDate();
	const currentMonth = currentTime.getMonth() + 1;
	const currentYear = currentTime.getFullYear();

	if (currentYear !== timeYear) {
		return `${timeDay}/${timeMonth}/${timeYear} ${hours}:${minutes?.toString().length === 1 ? "0" + minutes : minutes}`;
	} else if (currentDay !== timeDay && currentMonth === timeMonth && currentYear === timeYear) {
		return `${timeDay}/${timeMonth} ${hours}:${minutes?.toString().length === 1 ? "0" + minutes : minutes}`;
		
	} else if (currentDay === timeDay && currentMonth === timeMonth && currentYear === timeYear) {
		return `${hours}:${minutes?.toString().length === 1 ? "0" + minutes : minutes}`;
	}


	return `${hours}:${minutes?.toString().length === 1 ? "0" + minutes : minutes}`;
}

export function truncateString(text: string, maxLength = 20): string {
	return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

