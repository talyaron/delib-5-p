import { FC, useState } from "react";

// Third party imports
import { Statement, StatementType } from "delib-npm";
import { t } from "i18next";

// Statements Helpers
import {
    createStatement,
    setStatmentToDB,
} from "../../../../../functions/db/statements/setStatments";

// Custom Components
import Loader from "../../../../components/loaders/Loader";

// Images
import questionModalImage from "../../../../../assets/images/questionModalImage.png";
import optionModalImage from "../../../../../assets/images/optionModalImage.png";
import ElipsIcon from "../../../../components/icons/ElipsIcon";

interface Props {
    parentStatement: Statement | "top";
    isOption: boolean;
    setShowModal: (bool: boolean) => void;
    getSubStatements?: () => Promise<void>;
    toggleAskNotifications?: () => void;
}

const NewSetStatementSimple: FC<Props> = ({
    parentStatement,
    isOption,
    setShowModal,
    getSubStatements,
    toggleAskNotifications,
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
                    statementType: isOption
                        ? StatementType.option
                        : StatementType.question,
                    toggleAskNotifications,
                });

                if (!newStatement)
                    throw new Error("newStatement was not created");

                await setStatmentToDB({
                    statement: newStatement,
                    parentStatement:
                        parentStatement === "top" ? undefined : parentStatement,
                    addSubscription: true,
                });
                setIsLoading(false);
                setShowModal(false);

                if (getSubStatements) await getSubStatements();
            } catch (error) {
                console.error(error);
            }
        }

        return (
            <>
                {!isLoading ? (
                    <div className="overlay" style={{ zIndex: `2000` }}>
                        {!isOptionChosen ? (
                            <div className="overlay__imgBox">
                                <img
                                    src={questionModalImage}
                                    alt="Qustion-Modal-Image"
                                    width="70%"
                                />
                                <div className="overlay__imgBox__polygon" />
                            </div>
                        ) : (
                            <div className="overlay__imgBox">
                                <img
                                    src={optionModalImage}
                                    alt="Option-Modal-Image"
                                    width="70%"
                                />
                                <div className="overlay__imgBox__elips">
                                    <ElipsIcon />
                                </div>
                            </div>
                        )}
                        <div className="overlay__tabs">
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
                        </div>
                        <form
                            onSubmit={handleAddStatment}
                            className="overlay__form"
                            style={{ height: "auto" }}
                        >
                            <input
                                autoFocus={false}
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
