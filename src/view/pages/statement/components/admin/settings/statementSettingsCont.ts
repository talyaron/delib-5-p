import { Statement, NavObject, Screen } from "delib-npm";

export function isSubPageChecked(
    statement: Statement | undefined,
    navObj: NavObject
) {
    try {
        //in case of a new statement
        if (!statement) {
            if (navObj.default === false) return false;
            else return true;
        }

        //in case of an existing statement
        const subScreens = statement.subScreens as Screen[];
        if (subScreens === undefined) return true;
        if (subScreens?.includes(navObj.link)) return true;
    } catch (error) {
        console.error(error);
        
return true;
    }
}

