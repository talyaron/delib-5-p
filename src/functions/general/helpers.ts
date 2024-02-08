import {
    Role,
    Screen,
    Statement,
    StatementSchema,
    StatementSubscription,
    StatementType,
} from "delib-npm";
import { store } from "../../model/store";
import { NavigateFunction } from "react-router-dom";
import { logOut } from "../db/auth";
import { setUser } from "../../model/users/userSlice";
import { navArray } from "../../view/pages/statement/components/nav/top/StatementTopNavModel";

export function updateArray(
    currentArray: Array<any>,
    newItem: any,
    updateByProperty: string,
): Array<any> {
    try {
        const arrayTemp = [...currentArray];

        if (!newItem[updateByProperty]) {
            throw new Error(`Item dont have property ${updateByProperty}`);
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

export function setIntialLocationSessionStorage(pathname: string | null) {
    try {
        if (pathname === "/") pathname = "/home";
        sessionStorage.setItem("initialLocation", pathname || "/home");
    } catch (error) {
        console.error(error);
    }
}
export function getIntialLocationSessionStorage(): string | undefined {
    try {
        return sessionStorage.getItem("initialLocation") || undefined;
    } catch (error) {
        console.error(error);

        return undefined;
    }
}

export function isAuthorized(
    statement: Statement,
    statementSubscription: StatementSubscription | undefined,
    parentStatementCreatorId?: string | undefined,
    authrizedRoles?: Array<Role>,
) {
    try {
        if (!statement) throw new Error("No statement");

        const user = store.getState().user.user;
        if (!user || !user.uid) throw new Error("No user");
        if (statement.creatorId === user.uid) return true;

        if (parentStatementCreatorId === user.uid) return true;

        if (!statementSubscription) return false;

        const role = statementSubscription?.role || Role.guest;

        if (
            role === Role.admin ||
            role === Role.statementCreator ||
            role === Role.systemAdmin
        ) {
            return true;
        }

        if (authrizedRoles && authrizedRoles.includes(role)) return true;

        return false;
    } catch (error) {
        console.error(error);

        return false;
    }
}

export function isOptionFn(statement: Statement): boolean {
    try {
        return (
            statement.statementType === StatementType.option ||
            statement.statementType === StatementType.result
        );
    } catch (error) {
        console.error(error);

        return false;
    }
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

export function isStatementTypeAllowed(
    parentStatement: Statement,
    statement: Statement,
): boolean {
    // check if statement type is allowed
    // if parent is option, dont allow options
    // if parent is question, dont allow questions

    try {
        if (!parentStatement)
            throw new Error(
                `No parent statement at statement ${statement.statement}`,
            );
        if (!statement) throw new Error("No statement");

        StatementSchema.parse(parentStatement);
        StatementSchema.parse(statement);

        if (isOptionFn(parentStatement) && isOptionFn(statement)) return false;
        if (
            parentStatement.statementType === StatementType.question &&
            statement.statementType === StatementType.question
        )
            return false;

        return true;
    } catch (error) {
        console.error(error);

        return false;
    }
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

interface dataObj {
    [key: string]: string;
}

export function parseScreensCheckBoxes(dataObj: dataObj): Screen[] {
    try {
        if (!dataObj) throw new Error("dataObj is undefined");
        if (!navArray) throw new Error("navArray is undefined");

        const _navArray = [...navArray];

        const screens = _navArray

            //@ts-ignore
            .filter((navObj) => dataObj[navObj.link] === "on")
            .map((navObj) => navObj.link) as Screen[];

        if (screens.length === 0) return [Screen.CHAT, Screen.OPTIONS];

        return screens;
    } catch (error) {
        console.error(error);

        return [Screen.CHAT, Screen.OPTIONS, Screen.VOTE];
    }
}


export function getTitle(statement: Statement) {
    try {
        if (!statement) throw new Error("No statement");

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
