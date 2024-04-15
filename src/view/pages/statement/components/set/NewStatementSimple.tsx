import { FC, useState } from "react";

// Third party imports
import { Statement, StatementType } from "delib-npm";

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
import HalfPieChartGraphic from "../../../../../assets/svg-graphics/halfPieChart.svg?react";
import { useLanguage } from "../../../../../functions/hooks/useLanguages";

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
        const { t } = useLanguage();

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

                setIsLoading(false);
                setShowModal(false);

                await setStatmentToDB({
                    statement: newStatement,
                    parentStatement:
                        parentStatement === "top" ? undefined : parentStatement,
                    addSubscription: true,
                });

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
                                <div className="overlay__imgBox__halfPieChartGraphic">
                                    <HalfPieChartGraphic />
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
                                {t("Question")}
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
                                {t("Option")}

                                {isOptionChosen && <div className="block" />}
                            </div>
                        </div>
                        <form
                            onSubmit={handleAddStatment}
                            className="overlay__form"
                            style={{ height: "auto" }}
                        >
                            <input
                                data-cy="statement-title-simple"
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
                                    data-cy="add-statement-simple"
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
