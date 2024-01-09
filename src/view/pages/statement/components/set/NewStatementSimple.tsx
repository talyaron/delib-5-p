import { FC, useState } from "react";

// Third party imports
import {
    Statement,
    StatementType,
} from "delib-npm";
import { t } from "i18next";

// Statements helpers

import { createStatement, setStatmentToDB } from "../../../../../functions/db/statements/setStatments";

// Custom Components
import Loader from "../../../../components/loaders/Loader";

// Redux

import ModalImage from "../../../../components/icons/ModalImage";


interface Props {
    parentStatement: Statement | "top";
    isOption: boolean;
    setShowModal: Function;
    getSubStatements?: Function;
}

const NewSetStatementSimple: FC<Props> = ({
    parentStatement,
    isOption,
    setShowModal,
    getSubStatements,
}) => {
    try {
        const parentIsStatement = parentStatement !== "top";

        const [isOptionChosen, setIsOptionChosen] = useState(isOption);

        const parentStatementId = parentIsStatement
            ? parentStatement.statementId
            : "top";

        if (!parentStatementId)
            throw new Error("parentStatementId is undefined");

        const [isLoading, setIsLoading] = useState(false);

        async function handleAddStatment(ev: React.FormEvent<HTMLFormElement>) {
            try {
                ev.preventDefault();

                const data = new FormData(ev.currentTarget);
                let title: any = data.get("statement");

                if (!title) throw new Error("title is undefined");

                setIsLoading(true);

                const description = data.get("description");
                //add to title * at the beggining
                if (title && !title.startsWith("*")) title = `*${title}`;
                const _statement = `${title}\n${description}`;

                const newStatement = createStatement({
                    text: _statement,
                    parentStatement,
                    statementType: isOption ? StatementType.option : StatementType.question,
                   
                });

                // // Why do this?
                // const _user = store.getState().user.user;
                // if (!_user) throw new Error("user not found");
                // const { displayName, email, photoURL, uid } = _user;
                // const user = { displayName, email, photoURL, uid };
                // UserSchema.parse(user);

                // const newStatement: any = Object.fromEntries(data.entries());

                // newStatement.statement = _statement;

                // newStatement.statementId = crypto.randomUUID();
                // newStatement.parentId = parentStatementId;
                // newStatement.topParentId = parentIsStatement
                //     ? parentStatement.topParentId
                //     : parentStatementId;

                // if (parentIsStatement && parentStatement.parents)
                //     newStatement.parents = [
                //         ...parentStatement.parents,
                //         parentStatementId,
                //     ];
                // newStatement.creator = parseUserFromFirebase(_user);

                // Can only be Option or Question
                // const statementType = isOption ? StatementType.option :  StatementType.question;
                

                const setSubsciption: boolean = true;

                // const newStatement = getNewStatment({
                //     value: _statement,
                //     parentStatement:parentStatement === "top" ? undefined : parentStatement,
                //     statementType,
                // });

                if(!newStatement) throw new Error("newStatement was not created");
                
                await setStatmentToDB({
                    statement: newStatement,
                    parentStatement: parentStatement === "top" ? undefined : parentStatement,
                    addSubscription: setSubsciption,
                });

                if (getSubStatements) await getSubStatements();

                setIsLoading(false);

                setShowModal(false);
            } catch (error) {
                console.error(error);
            }
        }

        return (
            <>
                {!isLoading ? (
                    <div className="overlay" style={{ zIndex: `2000` }}>
                        <div className="overlay__imgBox">
                            <ModalImage />
                            <div className="overlay__imgBox__polygon" />
                        </div>
                        <div className="overlay__tabs">
                            <div
                                onClick={() => setIsOptionChosen(true)}
                                className={
                                    isOptionChosen
                                        ? "overlay__tabs__tab overlay__tabs__tab--active"
                                        : "overlay__tabs__tab"
                                }
                            >
                                Option
                                {isOptionChosen && <div className="block" />}
                            </div>
                            <div
                                onClick={() => setIsOptionChosen(false)}
                                className={
                                    isOptionChosen
                                        ? "overlay__tabs__tab"
                                        : "overlay__tabs__tab overlay__tabs__tab--active"
                                }
                            >
                                Question
                                {!isOptionChosen && <div className="block" />}
                            </div>
                        </div>
                        <form
                            onSubmit={handleAddStatment}
                            className="overlay__form"
                            style={{ height: "auto" }}
                        >
                            <input
                                autoFocus={true}
                                type="text"
                                name="statement"
                                placeholder={t("Title")}
                                required
                                minLength={3}
                            />
                            <textarea
                                name="description"
                                placeholder={t("Description")}
                                rows={4}
                            ></textarea>

                            <div className="overlay__form__buttons">
                                <button
                                    className="overlay__form__buttons__add btn"
                                    type="submit"
                                >
                                    {t("Add")}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    type="button"
                                    className="overlay__form__buttons__cancel btn"
                                >
                                    {t("Cancel")}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="center">
                        <h2>{t("Updating")}</h2>
                        <Loader />
                    </div>
                )}
            </>
        );
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default NewSetStatementSimple;

// function isSubPageChecked(statement: Statement | undefined, screen: Screen) {
//     try {
//         if (!statement) return true;
//         const subScreens = statement.subScreens as Screen[];
//         if (subScreens === undefined) return true;
//         if (subScreens?.includes(screen)) return true;
//     } catch (error) {
//         console.error(error);
//         return true;
//     }
// }

// function parseScreensCheckBoxes(dataObj: Object, navArray: NavObject[]) {
//     try {
//         if (!dataObj) throw new Error("dataObj is undefined");
//         if (!navArray) throw new Error("navArray is undefined");
//         const _navArray = [...navArray];

//         const screens = _navArray
//             //@ts-ignore
//             .filter(navObj => dataObj[navObj.link] === "on")
//             .map(navObj => navObj.link);
//         return screens;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// }
