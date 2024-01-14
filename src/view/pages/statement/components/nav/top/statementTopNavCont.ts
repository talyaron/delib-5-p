import { Statement, NavObject, Screen } from "delib-npm";
import { store } from "../../../../../../model/store";

export function showNavElements(
    statement: Statement | undefined,
    navArray: NavObject[],
): NavObject[] {
    try {
        if (!statement) return navArray;
        let _navArray = [...navArray];

        const { subScreens } = statement;

        //show setting page if admin of statement
        if (!isAdmin(statement.creatorId)) {
            _navArray = navArray.filter(
                (navObj: NavObject) => navObj.link !== Screen.SETTINGS,
            );
        }

        if (subScreens === undefined) {
            return _navArray;
        }
        if (subScreens.length > 0) {
            _navArray = _navArray

                //@ts-ignore
                .filter((navObj: NavObject) =>
                    subScreens.includes(navObj.link),
                );

            if (isAdmin(statement.creatorId)) {
                const adminTab = navArray.find(
                    (navObj) => navObj.link === Screen.SETTINGS,
                );
                if (adminTab) _navArray.push(adminTab);
            }

            return _navArray;
        } else {
            return _navArray;
        }

        function isAdmin(creatorId: string | undefined) {
            try {
                if (!creatorId) return false;
                const userUid = store.getState().user.user?.uid;
                if (userUid === creatorId) return true;
            } catch (error) {
                console.error(error);

                return false;
            }
        }
    } catch (error) {
        console.error(error);

        return navArray;
    }
}
