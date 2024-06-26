import { expect, test } from "vitest";
import { Role, Screen, Statement, StatementSubscription, StatementType, User } from "delib-npm";


import { ZodError } from "zod";
import {
	updateArray,
	isAuthorized,
	isAdmin,
	getInitials,
	generateRandomLightColor,
	statementTitleToDisplay,
	linkToChildren,
	getPastelColor,
	calculateFontSize,
	getTitle,
	getDescription,
	getSetTimerId,
	getRoomTimerId,
	getStatementSubscriptionId,
	getFirstScreen,
	getFirstName,
	writeZodError,
	getNumberDigits,
} from "./helpers";

test("updateArray should add a new item to the array if it doesn't exist", () => {
	const currentArray = [{ id: 1, name: "John" }];
	const newItem = { id: 2, name: "Jane" };
	const updateByProperty = "id";

	const result = updateArray(currentArray, newItem, updateByProperty);

	expect(result).toEqual([...currentArray, newItem]);
});

test("updateArray should update an existing item in the array if it exists", () => {
	const currentArray = [{ id: 1, name: "John" }];
	const newItem = { id: 1, name: "Jane" };
	const updateByProperty = "id";

	const result = updateArray(currentArray, newItem, updateByProperty);

	expect(result).toEqual([newItem]);
});

test("isAuthorized should return true if the user is the creator of the statement", () => {
	const statement = { creatorId: "user1" } as Statement;
	const statementSubscription = undefined;
	const parentStatementCreatorId = undefined;
	const authorizedRoles = undefined;

	const result = isAuthorized(
		statement,
		statementSubscription,
		parentStatementCreatorId,
		authorizedRoles
	);

	expect(result).toBe(true);
});

test("isAuthorized should return true if the user is the creator of the parent statement", () => {
	const statement = { creatorId: "user1" } as Statement;
	const statementSubscription = undefined;
	const parentStatementCreatorId = "user1";
	const authorizedRoles = undefined;

	const result = isAuthorized(
		statement,
		statementSubscription,
		parentStatementCreatorId,
		authorizedRoles
	);

	expect(result).toBe(true);
});

test("isAuthorized should return true if the user has an admin role", () => {
	const statement = { creatorId: "user1" } as Statement;
	const statementSubscription = { role: Role.admin } as StatementSubscription;
	const parentStatementCreatorId = undefined;
	const authorizedRoles = undefined;

	const result = isAuthorized(
		statement,
		statementSubscription,
		parentStatementCreatorId,
		authorizedRoles
	);

	expect(result).toBe(true);
});



test("isAdmin should return true if the role is admin or creator", () => {
	const role1 = Role.admin;
	const role2 = Role.creator;
	const role3 = Role.member;

	const result1 = isAdmin(role1);
	const result2 = isAdmin(role2);
	const result3 = isAdmin(role3);

	expect(result1).toBe(true);
	expect(result2).toBe(true);
	expect(result3).toBe(false);
});





test("getInitials should return the initials of a full name", () => {
	const fullName = "John Doe";

	const result = getInitials(fullName);

	expect(result).toBe("JD");
});

test("generateRandomLightColor should generate a random light color based on the UUID", () => {
	const uuid = "12345678";

	const result = generateRandomLightColor(uuid);

	expect(result).toMatch(/^#[0-9A-F]{6}$/i);
});

test("statementTitleToDisplay should return the short version of the title if it exceeds the specified length", () => {
	const statement = "This is a long statement that exceeds the specified length";
	const titleLength = 20;

	const result = statementTitleToDisplay(statement, titleLength);

	expect(result.shortVersion).toBe("This is a long statem...");
	expect(result.fullVersion).toBe(statement);
});

test("statementTitleToDisplay should return the full version of the title if it doesn't exceed the specified length", () => {
	const statement = "Short statement";
	const titleLength = 20;

	const result = statementTitleToDisplay(statement, titleLength);

	expect(result.shortVersion).toBe(statement);
	expect(result.fullVersion).toBe(statement);
});

test("linkToChildren should return true if the statement is a question", () => {
	const statement = { statementType: StatementType.question } as Statement;
	const parentStatement = {} as Statement;

	const result = linkToChildren(statement, parentStatement);

	expect(result).toBe(true);
});

test("linkToChildren should return true if the statement is an option and the parent statement has children", () => {
	const statement = { statementType: StatementType.option } as Statement;
	const parentStatement = { hasChildren: true } as Statement;

	const result = linkToChildren(statement, parentStatement);

	expect(result).toBe(true);
});

test("linkToChildren should return false if the statement is an option but the parent statement doesn't have children", () => {
	const statement = { statementType: StatementType.option } as Statement;
	const parentStatement = { hasChildren: false } as Statement;

	const result = linkToChildren(statement, parentStatement);

	expect(result).toBe(false);
});

test("getPastelColor should return a random pastel color", () => {
	const result = getPastelColor();

	expect(result).toMatch(/^hsl\(\d+,100%,75%\)$/);
});

test("calculateFontSize should calculate the font size based on the length of the text", () => {
	const text1 = "Short text";
	const text2 = "This is a long text that exceeds the specified length";
	const maxSize = 6;
	const minSize = 14;

	const result1 = calculateFontSize(text1, maxSize, minSize);
	const result2 = calculateFontSize(text2, maxSize, minSize);

	expect(result1).toBe("14px");
	expect(result2).toBe("6px");
});



test("getTitle should return the title of a statement", () => {
	const statement = { statement: "Title\nDescription" } as Statement;

	const result = getTitle(statement);

	expect(result).toBe("Title");
});

test("getDescription should return the description of a statement", () => {
	const statement = { statement: "Title\nDescription" } as Statement;

	const result = getDescription(statement);

	expect(result).toBe("Description");
});

test("getSetTimerId should return the timer ID for a statement and order", () => {
	const statementId = "1";
	const order = 2;

	const result = getSetTimerId(statementId, order);

	expect(result).toBe("1--2");
});

test("getRoomTimerId should return the timer ID for a statement, room number, and order", () => {
	const statementId = "1";
	const roomNumber = 2;
	const order = 3;

	const result = getRoomTimerId(statementId, roomNumber, order);

	expect(result).toBe("1--2--3");
});

test("getStatementSubscriptionId should return the subscription ID for a statement and user", () => {
	const statementId = "1";
	const user = { uid: "user1" } as User;

	const result = getStatementSubscriptionId(statementId, user);

	expect(result).toBe("user1--1");
});

test("getFirstScreen should return the first screen from the array", () => {
	const array1 = [Screen.HOME, Screen.QUESTIONS, Screen.OPTIONS];
	const array2 = [Screen.QUESTIONS, Screen.OPTIONS, Screen.CHAT];
	const array3 = [Screen.OPTIONS, Screen.CHAT, Screen.VOTE];

	const result1 = getFirstScreen(array1);
	const result2 = getFirstScreen(array2);
	const result3 = getFirstScreen(array3);

	expect(result1).toBe(Screen.HOME);
	expect(result2).toBe(Screen.QUESTIONS);
	expect(result3).toBe(Screen.OPTIONS);
});

test("getFirstName should return the first name from a full name", () => {
	const fullName1 = "John Doe";
	const fullName2 = "Jane";
	const fullName3 = "";

	const result1 = getFirstName(fullName1);
	const result2 = getFirstName(fullName2);
	const result3 = getFirstName(fullName3);

	expect(result1).toBe("John D.");
	expect(result2).toBe("Jane");
	expect(result3).toBe("");
});

test("writeZodError should log the Zod error and the object sent", () => {
	const error = new ZodError([]);
	const object = { id: 1, name: "John" };

	writeZodError(error, object);

	expect(console.error).toHaveBeenCalled();
	expect(console.info).toHaveBeenCalledWith("Object sent:", object);
});

test("getNumberDigits should return the number of digits in a number", () => {
	const number1 = 12345;
	const number2 = 0;
	const number3 = -987654321;

	const result1 = getNumberDigits(number1);
	const result2 = getNumberDigits(number2);
	const result3 = getNumberDigits(number3);

	expect(result1).toBe(5);
	expect(result2).toBe(1);
	expect(result3).toBe(9);
});