// Firestore
import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Third Party Imports
import { z } from "zod";
import {
	Access,
	Membership,
	ResultsBy,
	Screen,
	Statement,
	StatementSchema,
	StatementType,
	UserSchema,
	isAllowedStatementType,
	writeZodError,
} from "delib-npm";
import { Collections, Role } from "delib-npm";
import { DB } from "../config";
import { store } from "@/model/store";
import { setStatementSubscriptionNotificationToDB } from "../notifications/notifications";
import { setStatementSubscriptionToDB } from "../subscriptions/setSubscriptions";
import { getRandomColor } from "@/view/pages/statement/components/vote/votingColors";
import {
	getExistingOptionColors,
	getSiblingOptionsByParentId,
} from "@/view/pages/statement/components/vote/statementVoteCont";
import { allowedScreens } from "@/controllers/general/screens";
import { setNewRoomSettingsToDB } from "../rooms/setRooms";




export const updateStatementParents = async (
	statement: Statement,
	parentStatement: Statement,
) => {
	try {
		if (!statement) throw new Error("Statement is undefined");
		if (!parentStatement) throw new Error("Parent statement is undefined");
		if (isAllowedStatementType({ parentStatement, statement }) === false)
			throw new Error(
				`Statement type ${statement.statementType} is not allowed under ${parentStatement.statementType}`,
			);

		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);

		const newStatement = {
			parentId: parentStatement.statementId,
			parents: [
				parentStatement.parents,
				parentStatement.statementId,
			].flat(1),
			topParentId: parentStatement.topParentId,
		};

		await updateDoc(statementRef, newStatement);
	} catch (error) {
		console.error(error);
	}
};

const TextSchema = z.string().min(2);

export function setSubStatementToDB(statement: Statement, title: string, description?: string) {
	try {
		const newSubStatement = createStatement({
			text: title,
			description: description,
			parentStatement: statement,
			statementType: StatementType.option,
			enableAddEvaluationOption: true,
			enableAddVotingOption: true,
			enhancedEvaluation: true,
			showEvaluation: true,
			resultsBy: ResultsBy.topOptions,
			numberOfResults: 1,
			hasChildren: true,
			membership: statement.membership,
		});

		if(!newSubStatement) throw new Error("New newSubStatement is undefined");

		const newSubStatementRef = doc(DB, Collections.statements, newSubStatement.statementId);
		setDoc(newSubStatementRef, newSubStatement);
	} catch (error) {
		console.error(error);
		
	}
}

interface SetStatementToDBParams {
	statement: Statement;
	parentStatement?: Statement | "top";
	addSubscription: boolean;
}

export const setStatementToDB = async ({
	statement,
	parentStatement,
	addSubscription = true,
}: SetStatementToDBParams): Promise<string | undefined> => {
	try {
		if (!statement) throw new Error("Statement is undefined");
		if (!parentStatement) throw new Error("Parent statement is undefined");
		if (
			parentStatement !== "top" &&
			isAllowedStatementType({ parentStatement, statement }) === false
		)
			throw new Error(
				`Statement type ${statement.statementType} is not allowed under ${parentStatement.statementType}`,
			);

		const storeState = store.getState();
		const user = storeState.user.user;
		if (!user) throw new Error("User is undefined");

		TextSchema.parse(statement.statement);

		const parentId =
			parentStatement === "top"
				? "top"
				: statement.parentId || parentStatement?.statementId || "top";

		statement.statementType =
			statement.statementId === undefined
				? StatementType.question
				: statement.statementType;

		statement.creatorId = statement?.creator?.uid || user.uid;
		statement.creator = statement?.creator || user;
		statement.statementId = statement?.statementId || crypto.randomUUID();
		statement.parentId = parentId;
		statement.topParentId =
			parentStatement === "top"
				? statement.statementId
				: statement?.topParentId ||
				parentStatement?.topParentId ||
				"top";
		statement.subScreens = allowedScreens(statement, statement.subScreens);

		const siblingOptions = getSiblingOptionsByParentId(
			parentId,
			storeState.statements.statements,
		);
		const existingColors = getExistingOptionColors(siblingOptions);

		statement.consensus = 0;
		statement.color = statement.color || getRandomColor(existingColors);

		statement.statementType =
			statement.statementType || StatementType.statement;
		const { results, resultsSettings } = statement;
		if (!results) statement.results = [];
		if (!resultsSettings)
			statement.resultsSettings = { resultsBy: ResultsBy.topOptions };

		statement.lastUpdate = new Date().getTime();
		statement.createdAt = statement?.createdAt || new Date().getTime();

		statement.membership = statement.membership || { access: Access.open };

		//statement settings
		if (!statement.statementSettings)
			statement.statementSettings = {
				enableAddEvaluationOption: true,
				enableAddVotingOption: true,
			};

		StatementSchema.parse(statement);
		UserSchema.parse(statement.creator);

		//set statement
		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);
		const statementPromises = [];

		//update timestamp
		const statementPromise = await setDoc(statementRef, statement, {
			merge: true,
		});

		statementPromises.push(statementPromise);

		//add roomSettings
		setNewRoomSettingsToDB(statement.statementId);

		//add subscription

		if (addSubscription) {
			await Notification.requestPermission();
			statementPromises.push(
				setStatementSubscriptionToDB(statement, Role.admin),
			);

			if (Notification.permission === "granted")
				statementPromises.push(
					setStatementSubscriptionNotificationToDB(statement),
				);

			await Promise.all(statementPromises);
		} else {
			await Promise.all(statementPromises);
		}

		return statement.statementId;
	} catch (error) {
		console.error(error);

		return undefined;
	}
};

interface CreateStatementProps {
	text: string;
	description?: string;
	parentStatement: Statement | "top";
	subScreens?: Screen[];
	statementType?: StatementType;
	enableAddEvaluationOption: boolean;
	enableAddVotingOption: boolean;
	enhancedEvaluation: boolean;
	showEvaluation: boolean;
	resultsBy?: ResultsBy;
	numberOfResults?: number;
	hasChildren: boolean;
	membership?: Membership;
	
}
export function createStatement({
	text,
	description,
	parentStatement,
	subScreens = [Screen.CHAT, Screen.OPTIONS, Screen.VOTE],
	statementType = StatementType.statement,
	enableAddEvaluationOption = true,
	enableAddVotingOption = true,
	enhancedEvaluation = true,
	showEvaluation = true,
	resultsBy = ResultsBy.topOptions,
	numberOfResults = 1,
	hasChildren = true,
	membership
}: CreateStatementProps): Statement | undefined {
	try {
		if (parentStatement !== "top")
			if (
				isAllowedStatementType({ parentStatement, statementType }) ===
				false
			)
				throw new Error(
					`Statement type ${statementType} is not allowed under ${parentStatement.statementType}`,
				);

		
		const storeState = store.getState();
		const user = storeState.user.user;
		if (!user) throw new Error("User is undefined");

		const statementId = crypto.randomUUID();

		const parentId =
			parentStatement !== "top" ? parentStatement?.statementId : "top";
		const parentsSet: Set<string> =
			parentStatement !== "top"
				? new Set(parentStatement?.parents)
				: new Set();
		parentsSet.add(parentId);
		const parents: string[] = [...parentsSet];

		const topParentId =
			parentStatement !== "top"
				? parentStatement?.topParentId
				: statementId;

		const siblingOptions = getSiblingOptionsByParentId(
			parentId,
			storeState.statements.statements,
		);
		const existingColors = getExistingOptionColors(siblingOptions);


		const newStatement: Statement = {
			statement: text,
			description: description || "",
			statementId,
			parentId,
			parents,
			topParentId,
			creator: user,
			creatorId: user.uid,
			membership: membership || { access: Access.open },
			statementSettings: {
				enhancedEvaluation,
				showEvaluation,
				enableAddEvaluationOption,
				enableAddVotingOption,
				subScreens,
			},
			defaultLanguage: user.defaultLanguage || "en",
			createdAt: Timestamp.now().toMillis(),
			lastUpdate: Timestamp.now().toMillis(),
			color: getRandomColor(existingColors),
			resultsSettings: {
				resultsBy: resultsBy || ResultsBy.topOptions,
				numberOfResults: Number(numberOfResults),
			},
			hasChildren,
			statementType,
			consensus: 0,
			evaluation: {
				numberOfEvaluators: 0,
				sumEvaluations: 0,
				agreement: 0,
			},
			results: [],
			subScreens,
		};

		newStatement.subScreens = allowedScreens(newStatement, newStatement.subScreens);

		const results = StatementSchema.safeParse(newStatement);
		if(results.success === false) {
			writeZodError(results.error, newStatement);
		}

		return newStatement;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}

interface UpdateStatementProps {
	text: string;
	description?: string;
	statement: Statement;
	subScreens?: Screen[];
	statementType?: StatementType;
	enableAddEvaluationOption: boolean;
	enableAddVotingOption: boolean;
	enhancedEvaluation: boolean;
	showEvaluation: boolean;
	resultsBy?: ResultsBy;
	numberOfResults?: number;
	hasChildren: boolean;
	membership?: Membership;
}
export function updateStatement({
	text,
	description,
	statement,
	subScreens = [Screen.CHAT],
	statementType = StatementType.statement,
	enableAddEvaluationOption,
	enableAddVotingOption,
	enhancedEvaluation,
	showEvaluation,
	resultsBy,
	numberOfResults,
	hasChildren,
	membership,
}: UpdateStatementProps): Statement | undefined {
	try {
		const newStatement: Statement = JSON.parse(JSON.stringify(statement));

		if (text) newStatement.statement = text;
		if (description) newStatement.description = description;

		newStatement.lastUpdate = Timestamp.now().toMillis();

		if (resultsBy && newStatement.resultsSettings)
			newStatement.resultsSettings.resultsBy = resultsBy;
		else if (resultsBy && !newStatement.resultsSettings) {
			newStatement.resultsSettings = {
				resultsBy: resultsBy,
				numberOfResults: 1,
			};
		}
		if (numberOfResults && newStatement.resultsSettings)
			newStatement.resultsSettings.numberOfResults =
				Number(numberOfResults);
		else if (numberOfResults && !newStatement.resultsSettings) {
			newStatement.resultsSettings = {
				resultsBy: ResultsBy.topOptions,
				numberOfResults: numberOfResults,
			};
		}

		subScreens = allowedScreens(statement, subScreens);

		newStatement.statementSettings = updateStatementSettings({
			statement,
			enableAddEvaluationOption,
			enableAddVotingOption,
			enhancedEvaluation,
			showEvaluation,
			subScreens,
		});

		newStatement.hasChildren = hasChildren;
		newStatement.membership = membership || statement.membership || { access: Access.open };

		if (statementType !== undefined)
			newStatement.statementType =
				statement.statementType ?? StatementType.statement;

		newStatement.subScreens =
			subScreens !== undefined
				? subScreens
				: statement.subScreens || [
					Screen.CHAT,
					Screen.OPTIONS,
					Screen.VOTE,
				];

		const results = StatementSchema.safeParse(newStatement);
		if(results.success === false) {
			writeZodError(results.error, newStatement);
		}

		return newStatement;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}

interface UpdateStatementSettingsReturnType {
	enableAddEvaluationOption?: boolean;
	enableAddVotingOption?: boolean;
	enhancedEvaluation?: boolean;
	showEvaluation?: boolean;
	subScreens?: Screen[];
}

interface UpdateStatementSettingsParams {
	statement: Statement;
	enableAddEvaluationOption: boolean;
	enableAddVotingOption: boolean;
	enhancedEvaluation: boolean;
	showEvaluation: boolean;
	subScreens: Screen[] | undefined;

}

function updateStatementSettings({
	statement,
	enableAddEvaluationOption,
	enableAddVotingOption,
	enhancedEvaluation,
	showEvaluation,
	subScreens,

}: UpdateStatementSettingsParams): UpdateStatementSettingsReturnType {
	try {
		if (!statement) throw new Error("Statement is undefined");
		if (!statement.statementSettings)
			throw new Error("Statement settings is undefined");

		subScreens = allowedScreens(statement, subScreens);

		return {
			...statement.statementSettings,
			enhancedEvaluation,
			showEvaluation,
			enableAddEvaluationOption,
			enableAddVotingOption,
			subScreens,
		};
	} catch (error) {
		console.error(error);

		return {
			showEvaluation: true,
			enableAddEvaluationOption: true,
			enableAddVotingOption: true,
			subScreens: [Screen.CHAT],
		};
	}
}

export async function updateStatementText(
	statement: Statement | undefined,
	title: string,
	description: string,
) {
	try {
		if (!title) throw new Error("New title is undefined");
		if (!statement) throw new Error("Statement is undefined");
		

		if (statement.statement === title && statement.description === description) return;

		StatementSchema.parse(statement);
		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);

		const newStatement = {
			statement:title,
			description,
			lastUpdate: Timestamp.now().toMillis(),
		};
		await updateDoc(statementRef, newStatement);
	} catch (error) { }
}

export async function setStatementIsOption(statement: Statement) {
	try {
		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);
		const parentStatementRef = doc(
			DB,
			Collections.statements,
			statement.parentId,
		);

		//get current statement
		const [statementDB, parentStatementDB] = await Promise.all([
			getDoc(statementRef),
			getDoc(parentStatementRef),
		]);

		if (!statementDB.exists()) throw new Error("Statement not found");

		const statementDBData = statementDB.data() as Statement;
		const parentStatementDBData = parentStatementDB.data() as Statement;

		StatementSchema.parse(statementDBData);
		StatementSchema.parse(parentStatementDBData);

		await toggleStatementOption(statementDBData, parentStatementDBData);
	} catch (error) {
		console.error(error);
	}

	async function toggleStatementOption(
		statement: Statement,
		parentStatement: Statement,
	) {
		try {
			const statementRef = doc(
				DB,
				Collections.statements,
				statement.statementId,
			);

			if (statement.statementType === StatementType.option) {
				await updateDoc(statementRef, {
					statementType: StatementType.statement,
				});
			} else if (statement.statementType === StatementType.statement) {
				if (!(parentStatement.statementType === StatementType.question))
					throw new Error(
						"You can't create option under option or statement",
					);

				await updateDoc(statementRef, {
					statementType: StatementType.option,
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
}

export async function setStatementGroupToDB(statement: Statement) {
	try {
		const statementId = statement.statementId;
		const statementRef = doc(DB, Collections.statements, statementId);
		await setDoc(
			statementRef,
			{ statementType: StatementType.statement },
			{ merge: true },
		);
	} catch (error) {
		console.error(error);
	}
}

export function setRoomSizeInStatementDB(
	statement: Statement,
	roomSize: number,
) {
	try {
		z.number().parse(roomSize);
		StatementSchema.parse(statement);
		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);
		const newRoomSize = { roomSize };
		updateDoc(statementRef, newRoomSize);
	} catch (error) {
		console.error(error);
	}
}

export async function updateIsQuestion(statement: Statement) {
	try {
		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);

		const parentStatementRef = doc(
			DB,
			Collections.statements,
			statement.parentId,
		);
		const parentStatementDB = await getDoc(parentStatementRef);
		const parentStatement = parentStatementDB.data() as Statement;
		StatementSchema.parse(parentStatement);

		let { statementType } = statement;
		if (statementType === StatementType.question)
			statementType = StatementType.statement;
		else {
			statementType = StatementType.question;
		}

		const newStatementType = { statementType };
		await updateDoc(statementRef, newStatementType);
	} catch (error) {
		console.error(error);
	}
}

export async function updateStatementMainImage(
	statement: Statement,
	imageURL: string | undefined,
) {
	try {
		if (!imageURL) throw new Error("Image URL is undefined");
		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);

		await updateDoc(statementRef, {
			imagesURL: { main: imageURL },
		});
	} catch (error) {
		console.error(error);
	}
}

export async function setFollowMeDB(
	statement: Statement,
	path: string | undefined,
): Promise<void> {
	try {
		z.string().parse(path);
		StatementSchema.parse(statement);

		const statementRef = doc(
			DB,
			Collections.statements,
			statement.statementId,
		);

		if (path) {
			await updateDoc(statementRef, { followMe: path });
		} else {
			await updateDoc(statementRef, { followMe: "" });
		}
	} catch (error) {
		console.error(error);
	}
}


