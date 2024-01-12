// Firestore
import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Third Party Imports
import { z } from "zod";
import {
    ResultsBy,
    Screen,
    Statement,
    StatementSchema,
    StatementType,
    UserSchema,
} from "delib-npm";
import { Collections, Role } from "delib-npm";
import {
    getUserPermissionToNotifications,
    setStatmentSubscriptionNotificationToDB,
} from "../../notifications";
import { getUserFromFirebase } from "../users/usersGeneral";
import { DB } from "../config";
import { getPastelColor } from "../../general/helpers";
import { store } from "../../../model/store";

const TextSchema = z.string().min(2);
interface SetStatmentToDBProps {
    statement: Statement;
    parentStatement?: Statement | "top";
    addSubscription: boolean;
}

export const setStatmentToDB = async ({
    statement,
    parentStatement,
    addSubscription = true,
}: SetStatmentToDBProps): Promise<string | undefined> => {
    try {
        if (!statement) throw new Error("Statement is undefined");
        if (!parentStatement) throw new Error("Parent statement is undefined");

        const user = store.getState().user.user;
        if (!user) throw new Error("User is undefined");

        TextSchema.parse(statement.statement);

        statement.statementType =
            statement.statementId === undefined
                ? StatementType.question
                : statement.statementType;

        statement.creatorId = statement?.creator?.uid || user.uid;
        statement.creator = statement?.creator || user;
        statement.statementId = statement?.statementId || crypto.randomUUID();
        statement.parentId =
            parentStatement === "top"
                ? "top"
                : statement.parentId || parentStatement?.statementId || "top";
        statement.topParentId =
            parentStatement === "top"
                ? statement.statementId
                : statement?.topParentId ||
                  parentStatement?.topParentId ||
                  "top";
        statement.subScreens = statement.subScreens || [
            Screen.CHAT,
            Screen.OPTIONS,
        ];

        statement.consensus = 0;
        statement.color = statement.color || getPastelColor();

        statement.statementType =
            statement.statementType || StatementType.statement;
        const { results, resultsSettings } = statement;
        if (!results) statement.results = [];
        if (!resultsSettings)
            statement.resultsSettings = { resultsBy: ResultsBy.topOptions };

        statement.lastUpdate = new Date().getTime();
        statement.createdAt = statement?.createdAt || new Date().getTime();

        //statement settings
        if (!statement.statementSettings)
            statement.statementSettings = {
                enableAddEvaluationOption: true,
                enableAddVotingOption: true,
            };

        // statement.parents = getStatementsParents(statement);

        StatementSchema.parse(statement);
        UserSchema.parse(statement.creator);

        //set statement
        const statementRef = doc(
            DB,
            Collections.statements,
            statement.statementId
        );
        const statementPromises = [];

        //update timestamp
        const statementPromise = await setDoc(statementRef, statement, {
            merge: true,
        });

        statementPromises.push(statementPromise);

        //add subscription

        if (addSubscription) {
            statementPromises.push(
                setStatmentSubscriptionToDB(
                    statement,
                    Role.statementCreator,
                    true
                )
            );
            statementPromises.push(getUserPermissionToNotifications());

            const [_, __, canGetNotifications] = await Promise.all(
                statementPromises
            );

            if (canGetNotifications)
                await setStatmentSubscriptionNotificationToDB(statement);
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
    parentStatement: Statement | "top";
    screens?: Screen[];
    statementType?: StatementType;
    enableAddEvaluationOption?: "on" | "off" | boolean;
    enableAddVotingOption?: "on" | "off" | boolean;
    resultsBy?: ResultsBy;
    numberOfResults?: number;
    hasChildren?: "on" | "off" | boolean;
}
export function createStatement({
    text,
    parentStatement,
    screens = [Screen.CHAT, Screen.OPTIONS, Screen.VOTE],
    statementType = StatementType.statement,
    enableAddEvaluationOption = true,
    enableAddVotingOption = true,
    resultsBy = ResultsBy.topOptions,
    numberOfResults = 1,
    hasChildren = true,
}: CreateStatementProps): Statement | undefined {
    try {
        const user = store.getState().user.user;
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

        const newStatement: any = {
            statement: text,
            statementId,
            parentId,
            parents,
            topParentId,
            creator: user,
            creatorId: user.uid,
        };

        newStatement.defaultLanguage = user.defaultLanguage || "en";
        newStatement.createdAt = Timestamp.now().toMillis();
        newStatement.lastUpdate = Timestamp.now().toMillis();
        newStatement.color = getPastelColor();
        newStatement.resultsSettings = {
            resultsBy: resultsBy || ResultsBy.topOptions,
            numberOfResults: Number(numberOfResults),
        };

        Object.assign(newStatement, {
            statementSettings: {
                enableAddEvaluationOption:
                    enableAddEvaluationOption === "on" ||
                    enableAddEvaluationOption === true
                        ? true
                        : false,
                enableAddVotingOption:
                    enableAddVotingOption === "on" ||
                    enableAddVotingOption === true
                        ? true
                        : false,
            },
        });
        newStatement.hasChildren = hasChildren === "on" ? true : false;

        newStatement.statementType = statementType;
        newStatement.consensus = 0;
        newStatement.results = [];

        newStatement.subScreens = screens;
        newStatement.statementSettings.subScreens = screens;

        StatementSchema.parse(newStatement);
        
return newStatement;
    } catch (error) {
        console.error(error);
        
return undefined;
    }
}

interface UpdateStatementProps {
    text: string;
    statement: Statement;
    screens?: Screen[];
    statementType?: StatementType;
    enableAddEvaluationOption?: "on" | "off" | boolean;
    enableAddVotingOption?: "on" | "off" | boolean;
    resultsBy?: ResultsBy;
    numberOfResults?: number;
    hasChildren?: "on" | "off" | boolean;
}
export function updateStatement({
    text,
    statement,
    screens = [Screen.CHAT, Screen.OPTIONS, Screen.VOTE],
    statementType = StatementType.statement,
    enableAddEvaluationOption,
    enableAddVotingOption,
    resultsBy,
    numberOfResults,
    hasChildren = true,
}: UpdateStatementProps): Statement | undefined {
    try {
        const newStatement: Statement = JSON.parse(JSON.stringify(statement));

        if (text) newStatement.statement = text;

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

        newStatement.statementSettings = updateStatementSettings(
            statement,
            enableAddEvaluationOption,
            enableAddVotingOption,
            screens
        );

        if (hasChildren !== undefined)
            newStatement.hasChildren = hasChildren === "on" ? true : false;

        if (statementType !== undefined)
            newStatement.statementType =
                statement.statementType || StatementType.statement;

        newStatement.subScreens =
            screens !== undefined
                ? screens
                : statement.subScreens || [
                      Screen.CHAT,
                      Screen.OPTIONS,
                      Screen.VOTE,
                  ];

        StatementSchema.parse(newStatement);
        
return newStatement;
    } catch (error) {
        console.error(error);
        
return undefined;
    }
}

function updateStatementSettings(
    statement: Statement,
    enableAddEvaluationOption: string | boolean | undefined,
    enableAddVotingOption: string | boolean | undefined,
    screens: Screen[] | undefined
): {
    enableAddEvaluationOption?: boolean;
    enableAddVotingOption?: boolean;
    screens?: Screen[];
} {
    try {
        if (!statement) throw new Error("Statement is undefined");
        if (!statement.statementSettings)
            throw new Error("Statement settings is undefined");

        const statementSettings = { ...statement.statementSettings };

        if (
            enableAddEvaluationOption === "on" ||
            enableAddEvaluationOption === true
        ) {
            statementSettings.enableAddEvaluationOption = true;
        } else if (
            enableAddEvaluationOption === "off" ||
            enableAddEvaluationOption === false
        ) {
            statementSettings.enableAddEvaluationOption = false;
        }

        if (enableAddVotingOption === "on" || enableAddVotingOption === true) {
            statementSettings.enableAddVotingOption = true;
        } else if (
            enableAddVotingOption === "off" ||
            enableAddVotingOption === false
        ) {
            statementSettings.enableAddVotingOption = false;
        }

        if (screens) statementSettings.subScreens = screens;

        return statementSettings;
    } catch (error) {
        console.error(error);
        
return {
            enableAddEvaluationOption: true,
            enableAddVotingOption: true,
            screens: [Screen.CHAT, Screen.OPTIONS, Screen.VOTE],
        };
    }
}

// function getStatementsParents(statement: Statement): string[] {
//     try {
//         if (!statement) throw new Error("Statement is undefined");

//         StatementSchema.parse(statement);

//         if (statement.parentId === "top") statement.parents = [];
//         else {
//             statement.parents = statement.parents || [];
//             statement.parents.push(statement.statementId);
//         }

//         return statement.parents;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// }

export async function setStatmentSubscriptionToDB(
    statement: Statement,
    role: Role,
    setNotifications = false
) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");
        const { statementId } = statement;
        StatementSchema.parse(statement);

        const statementsSubscribeId = `${user.uid}--${statementId}`;

        if (role === Role.admin) setNotifications = true;

        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementsSubscribeId
        );

        await setDoc(
            statementsSubscribeRef,
            {
                user,
                notification: setNotifications,
                statement,
                statementsSubscribeId,
                role,
                userId: user.uid,
                statementId,
                lastUpdate: Timestamp.now().toMillis(),
                createdAt: Timestamp.now().toMillis(),
            },
            { merge: true }
        );
    } catch (error) {
        console.error(error);
    }
}

export async function updateStatementText(
    statement: Statement | undefined,
    newText: string
) {
    try {
        if (!newText) throw new Error("New text is undefined");
        if (!statement) throw new Error("Statement is undefined");
        if (statement.statement === newText) return;

        StatementSchema.parse(statement);
        const statementRef = doc(
            DB,
            Collections.statements,
            statement.statementId
        );
        const newStatement = {
            statement: newText,
            lastUpdate: Timestamp.now().toMillis(),
        };
        await updateDoc(statementRef, newStatement);
    } catch (error) {}
}

export async function setStatementisOption(statement: Statement) {
    try {
        const statementRef = doc(
            DB,
            Collections.statements,
            statement.statementId
        );
        const parentStatementRef = doc(
            DB,
            Collections.statements,
            statement.parentId
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
        parentStatement: Statement
    ) {
        try {
            const statementRef = doc(
                DB,
                Collections.statements,
                statement.statementId
            );

            if (statement.statementType === StatementType.option) {
                await updateDoc(statementRef, {
                    statementType: StatementType.statement,
                });
            } else if (statement.statementType === StatementType.statement) {
                if (!(parentStatement.statementType === StatementType.question))
                    throw new Error(
                        "You can't create option under option or statement"
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

export async function setStatmentGroupToDB(statement: Statement) {
    try {
        const statementId = statement.statementId;
        const statementRef = doc(DB, Collections.statements, statementId);
        await setDoc(
            statementRef,
            { statementType: StatementType.statement },
            { merge: true }
        );
    } catch (error) {
        console.error(error);
    }
}

export async function updateSubscriberForStatementSubStatements(
    statement: Statement
) {
    try {
        const user = getUserFromFirebase();
        if (!user) throw new Error("User not logged in");
        if (!user.uid) throw new Error("User not logged in");

        const statementsSubscribeId = `${user.uid}--${statement.statementId}`;

        const statementsSubscribeRef = doc(
            DB,
            Collections.statementsSubscribe,
            statementsSubscribeId
        );
        const newSubStatmentsRead = {
            totalSubStatementsRead: statement.totalSubStatements || 0,
        };

        await updateDoc(statementsSubscribeRef, newSubStatmentsRead);
    } catch (error) {
        console.error(error);
    }
}

export function setRoomSizeInStatement(statement: Statement, roomSize: number) {
    try {
        z.number().parse(roomSize);
        StatementSchema.parse(statement);
        const statementRef = doc(
            DB,
            Collections.statements,
            statement.statementId
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
            statement.statementId
        );

        const parentStatementRef = doc(
            DB,
            Collections.statements,
            statement.parentId
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

export async function updateStatmentMainImage(
    statement: Statement,
    imageURL: string | undefined
) {
    try {
        if (!imageURL) throw new Error("Image URL is undefined");
        const statementRef = doc(
            DB,
            Collections.statements,
            statement.statementId
        );

        await updateDoc(statementRef, {
            imagesURL: { main: imageURL },
        });
    } catch (error) {
        console.error(error);
    }
}
