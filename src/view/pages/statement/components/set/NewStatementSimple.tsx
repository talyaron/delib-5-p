import { FC, useState } from "react";

// Third party imports
import { UserSchema } from "delib-npm";
import { Statement, parseUserFromFirebase } from "delib-npm";
import { t } from "i18next";

// Statements helpers
import { StatementType } from "delib-npm";
import { setStatmentToDB } from "../../../../../functions/db/statements/setStatments";

// Custom Components
import Loader from "../../../../components/loaders/Loader";

// Redux
import { store } from "../../../../../model/store";

interface Props {
    parentStatement: Statement;
    isOption?: boolean;
    isQuestion?: boolean;
    setShowModal: Function;
}

const NewSetStatementSimple: FC<Props> = ({
    parentStatement,
    isOption,
    isQuestion,
    setShowModal,
}) => {
    try {
        if (!parentStatement) throw new Error("parentStatement is undefined");

        const [isLoading, setIsLoading] = useState(false);

        async function handleAddStatment(ev: React.FormEvent<HTMLFormElement>) {
            try {
                ev.preventDefault();
                setIsLoading(true);
                const data = new FormData(ev.currentTarget);

                let title: any = data.get("statement");
                const description = data.get("description");
                //add to title * at the beggining
                if (title && !title.startsWith("*")) title = `*${title}`;
                const _statement = `${title}\n${description}`;
                const _user = store.getState().user.user;
                if (!_user) throw new Error("user not found");
                const { displayName, email, photoURL, uid } = _user;
                const user = { displayName, email, photoURL, uid };
                UserSchema.parse(user);

                const newStatement: any = Object.fromEntries(data.entries());

                newStatement.statement = _statement;
                newStatement.statementId = crypto.randomUUID();
                newStatement.creatorId = _user.uid;
                newStatement.parentId = parentStatement.statementId;

                newStatement.creator = parseUserFromFirebase(_user);
                if (isOption) newStatement.statementType = StatementType.option;
                if (isQuestion)
                    newStatement.statementType = StatementType.question;

                newStatement.lastUpdate = new Date().getTime();

                newStatement.createdAt = new Date().getTime();

                newStatement.consensus = 0;

                const setSubsciption: boolean = true;

                await setStatmentToDB(newStatement, setSubsciption);

                setIsLoading(false);

                setShowModal(false);
            } catch (error) {
                console.error(error);
            }
        }

        return (
            <>
                {!isLoading ? (
                    <form
                        onSubmit={handleAddStatment}
                        className="setStatement__form"
                        style={{height: "auto"}}
                    >
                        <h2>{t("Add Option")}</h2>
                        <input
                            type="text"
                            name="statement"
                            placeholder={t("Title")}
                        />
                        <textarea
                            name="description"
                            placeholder={t("Description")}
                            rows={4}
                        ></textarea>

                        <div className="btnBox">
                            <button type="submit">{t("Add")}</button>
                            <button className="btn btn--cancel">
                                {t("Cancel")}
                            </button>
                        </div>
                    </form>
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
