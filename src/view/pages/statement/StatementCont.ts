import { Statement, NavObject, Screen } from "delib-npm";
import { showNavElements } from "./components/nav/statementNavCont";
import { navArray } from "./components/nav/StatementNav";

export function availableScreen(
    statement: Statement | undefined,
    screenLink: Screen | undefined
) {
    try {
        if (!statement) return screenLink;
        if (!screenLink) throw new Error("urlSubPage is undefined");
        if (statement.subScreens === undefined) return screenLink;
        if (statement.subScreens.length === 0)
            throw new Error("statement.subScreens is empty");

        const subScreens: NavObject[] = showNavElements(statement, navArray);
        const subScreensLinks: Screen[] = subScreens.map(
            (navObj: NavObject) => navObj.link
        );
        if (!subScreensLinks) throw new Error("subScreensLinks is undefined");
        if (subScreensLinks.includes(screenLink)) {
            return screenLink;
        } else {
            return subScreensLinks[0];
        }
    } catch (error) {
        console.error(error);
        return screenLink;
    }
}
