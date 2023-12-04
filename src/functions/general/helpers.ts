import {
    Role,
    Screen,
    Statement,
    StatementSubscription,
    StatementType,
    User,
} from "delib-npm";
import { store } from "../../model/store";
import { NavigateFunction } from "react-router-dom";

export function updateArray(
    currentArray: Array<any>,
    newItem: any,
    updateByProperty: string
): Array<any> {
    try {
        const arrayTemp = [...currentArray];

        if (!newItem[updateByProperty]) {
            throw new Error(`Item dont have property ${updateByProperty}`);
        }
        //find in array;
        const index = arrayTemp.findIndex(
            (item) => item[updateByProperty] === newItem[updateByProperty]
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

interface getNewStatmentProps {
    value?: string | undefined | null;
    statement?: Statement;
    statementType?: StatementType;
    user: User;
}

export function getNewStatment({
    value,
    statement,
    statementType,
    user,
}: getNewStatmentProps): Statement | undefined {
    try {
        if (!statement) throw new Error("No statement");
        if (!user) throw new Error("No user");
        if (!value) throw new Error("No value");

        const userId = user.uid;

        const creator = user;
        if (!creator) throw new Error("User not logged in");

        const newStatement: Statement = {
            statement: value,
            statementId: crypto.randomUUID(),
            creatorId: userId,
            creator,
            createdAt: new Date().getTime(),
            lastUpdate: new Date().getTime(),
            parentId: statement.statementId,
            topParentId:
                statement.topParentId || statement.statementId || "top",
            consensus: 0,
            statementType: statementType || StatementType.statement,
        };

        return newStatement;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export function isAuthorized(
    statement: Statement,
    statementSubscription: StatementSubscription | undefined,
    authrizedRoles?: Array<Role>
) {
    try {
        if (!statement) return false;
        if(!statementSubscription) return false;


        const user = store.getState().user.user;
        if (!user || !user.uid) throw new Error("No user");
        if (statement.creatorId === user.uid) return true;

        if (!statementSubscription) return false;
   

        const role = statementSubscription?.role || Role.guest;

        console.log(user.displayName, statement.statement, "role", role);
        if (
            role === Role.admin ||
            role === Role.statementCreator ||
            role === Role.systemAdmin
        ){
            console.log("authorized.....")
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
    navigate: NavigateFunction
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
    const hexColor = `#${(randomValue & 0x00ffffff)
        .toString(16)
        .toUpperCase()}`;

    return hexColor;
}
