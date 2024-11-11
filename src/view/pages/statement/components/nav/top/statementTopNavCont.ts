import {
	Statement,
	NavObject,
	Screen,
	StatementSubscription,
	Role,
} from 'delib-npm';

interface showNavElementsProps {
	statement: Statement | undefined;
	statementSubscription: StatementSubscription | undefined;
	navArray: NavObject[];
}
export function showNavElements({
	statement,
	statementSubscription,
	navArray,
}: showNavElementsProps): NavObject[] {
	try {
		if (!statement) return navArray;
		if (!navArray) return navArray;

		if (!statement) return navArray;
		let _navArray = [...navArray];
		const role = statementSubscription?.role || Role.member;

		const { subScreens } = statement;

		//show setting page if admin of statement
		if (role !== Role.admin) {
			_navArray = navArray.filter(
				(navObj: NavObject) => navObj.link !== Screen.SETTINGS
			);
		}

		if (subScreens === undefined) {
			return _navArray;
		}
		if (subScreens.length > 0) {
			_navArray = _navArray.filter((navObj: NavObject) =>
				subScreens.includes(navObj.link)
			);

			if (statementSubscription?.role === Role.admin) {
				const adminTab = navArray.find(
					(navObj) => navObj.link === Screen.SETTINGS
				);
				if (adminTab) _navArray.push(adminTab);
			}

			return _navArray;
		} else {
			return _navArray;
		}
	} catch (error) {
		console.error(error);

		return navArray;
	}
}
