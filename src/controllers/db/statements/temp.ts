import { Screen, Statement, StatementType, isOptionFn } from "delib-npm";

export function isScreenAllowedUnderStatementType(statement: Statement | undefined, screen: Screen) {
    try {
       console.log(statement?.statementType, screen);
        if (!statement) return true;

        //if option or statement, prevent options subScreens
        if (isOptionFn(statement) || statement.statementType === StatementType.statement) {
            if (screen === Screen.OPTIONS || screen === Screen.VOTE) {
                console.log('false', screen);
                return false;
            }
        }
        console.log('true', screen);
        return true;
    } catch (error) {
        console.error(error);

        return true;
    }
}

export function allowedScreens(statement: Statement | undefined, screens: Screen[] |undefined): Screen[] {
    try {
    console.log("initial screens", statement?.statement, screens);
        if (!statement) throw new Error("No statement");
        if (!screens) throw new Error("No screens");
        const _allowedScreens = new Set([... screens.filter(screen => isScreenAllowedUnderStatementType(statement, screen))]);
        const allowedScreens = Array.from(_allowedScreens);

        console.log("allowedScreens", allowedScreens, `on statement ${statement.statement}`);
        return allowedScreens.length > 0 ? allowedScreens : [Screen.OPTIONS, Screen.VOTE, Screen.CHAT];
        
    } catch (error) {
        console.error(error);
        return [Screen.CHAT];
    }
}