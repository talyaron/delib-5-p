import { CSSProperties, FC, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";

// Statment imports
import { setStatmentToDB } from "../../../../../functions/db/statements/setStatments";
import { navArray } from "../nav/StatementNav";

// Third party imports
import { useNavigate, useParams } from "react-router-dom";
import {
    UserSchema,
    User,
    StatementSubscription,
    ResultsBy,
    Screen,
    StatementType,
    Statement,
} from "delib-npm";

// Custom components
import Loader from "../../../../components/loaders/Loader";
import MembershipLine from "./MembershipLine";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks";
import {
    removeMembership,
    setMembership,
    setStatement,
    statementMembershipSelector,
    statementSelector,
} from "../../../../../model/statements/statementsSlice";
import { userSelector } from "../../../../../model/users/userSlice";

// Firestore functions
import {
    getStatementFromDB,
    listenToMembers,
} from "../../../../../functions/db/statements/getStatement";

// Mui imports
import { Switch, FormControlLabel, FormGroup } from "@mui/material";
import { store } from "../../../../../model/store";
import {
    parseScreensCheckBoxes,
    isSubPageChecked,
} from "./statementSettingsCont";
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut";
import { t } from "i18next";
import { navigateToStatementTab } from "../../../../../functions/general/helpers";
import useWindowDimensions from "../../../../../functions/hooks/useWindowDimentions";

interface Props {
    simple?: boolean;
    new?: boolean;
}

export const StatementSettings: FC<Props> = ({ simple }) => {
    const navigate = useNavigate();
    const { statementId } = useParams();
    const { width } = useWindowDimensions();

    // Redux
    const dispatch = useAppDispatch();
    const statement:Statement|undefined = useAppSelector(statementSelector(statementId));
    const membership: StatementSubscription[] = useAppSelector(
        statementMembershipSelector(statementId)
    );
    const user: User | null = useAppSelector(userSelector);

    // Use State
    const [isLoading, setIsLoading] = useState(false);
    const [numOfResults] = useState(
        statement?.resultsSettings?.numberOfResults || 1
    );

    const tabsStyle: CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: width > 600 ? "space-between" : "space-around",
        padding: width > 600 ? "0" : "0 1rem",
    };

    useEffect(() => {
        let unsubscribe: Function = () => {};
        if (statementId) {
            unsubscribe = listenToMembers(
                statementId,
                setMembershipCB,
                removeMembershipCB
            );

            if (!statement)
                (async () => {
                    const statementDB = await getStatementFromDB(statementId);
                    if (statementDB) dispatch(setStatement(statementDB));
                })();
        }
        return () => {
            unsubscribe();
        };
    }, [statementId]);

    //CBs
    function setMembershipCB(membership: StatementSubscription) {
        dispatch(setMembership(membership));
    }

    function removeMembershipCB(membership: StatementSubscription) {
        dispatch(removeMembership(membership.statementsSubscribeId));
    }

    async function handleSetStatment(ev: React.FormEvent<HTMLFormElement>) {
        try {
            ev.preventDefault();

            const data = new FormData(ev.currentTarget);

            let title: any = data.get("statement");
            if (!title || title.length < 2) return;
            setIsLoading(true);
            const resultsBy = data.get("resultsBy") as ResultsBy;
            const numberOfResults: number = Number(data.get("numberOfResults"));

            const description = data.get("description");

            //add to title * at the beggining
            if (title && !title.startsWith("*")) title = "*" + title;

            const _statement = `${title}\n${description}`;

            UserSchema.parse(user);

            const newStatement: any = Object.fromEntries(data.entries());

            newStatement.subScreens = parseScreensCheckBoxes(
                newStatement,
                navArray
            );

            newStatement.statement = _statement;
            newStatement.resultsSettings = {
                numberOfResults: numberOfResults,
                resultsBy: resultsBy || ResultsBy.topOptions,
                deep: 1,
                minConsensus: 1,
            };
            newStatement.statementId =
                statement?.statementId || crypto.randomUUID();
            newStatement.creatorId =
                statement?.creator.uid || store.getState().user.user?.uid;
            newStatement.parentId = statement?.parentId || statementId || "top";
            newStatement.topParentId =
                statement?.topParentId || statementId || "top";
            newStatement.statementType =
                statementId === undefined
                    ? StatementType.question
                    : newStatement.statementType || statement?.statementType;
            newStatement.creator = statement?.creator || user;
            newStatement.hasChildren =
                newStatement.hasChildren === "on" ? true : false;

            Object.assign(newStatement, {
                statementSettings: {
                    enableAddEvaluationOption:
                        newStatement.enableAddEvaluationOption === "on"
                            ? true
                            : false,
                    enableAddVotingOption:
                        newStatement.enableAddVotingOption === "on"
                            ? true
                            : false,
                },
            });

            if (statement) {
                newStatement.lastUpdate = new Date().getTime();
            }
            newStatement.createdAt =
                statement?.createdAt || new Date().getTime();

            newStatement.consensus = statement?.consensus || 0;

            const setSubsciption: boolean =
                statementId === undefined ? true : false;

            //remove all "on" values
            for (const key in newStatement) {
                if (newStatement[key] === "on") delete newStatement[key];
            }

            const _statementId = await setStatmentToDB(
                newStatement,
                setSubsciption
            );

            if (_statementId) navigateToStatementTab(newStatement, navigate);
        } catch (error) {
            console.error(error);
        }
    }

    const arrayOfStatementParagrphs = statement?.statement.split("\n") || [];
    //get all elements of the array except the first one
    const description = arrayOfStatementParagrphs?.slice(1).join("\n");
    const resultsBy: ResultsBy =
        statement?.resultsSettings?.resultsBy || ResultsBy.topOptions;
    const hasChildren: boolean = (() => {
        if (!statement) return true;
        if (statement.hasChildren === undefined) return true;
        return statement.hasChildren;
    })();

    const enableAddEvaluationOption: boolean = statement?.statementSettings?.enableAddEvaluationOption === false ? false : true;

    const enableAddVotingOption: boolean =  statement?.statementSettings?.enableAddVotingOption === false ? false :true;


    return (
        <ScreenFadeInOut className="setStatement">
            {!isLoading ? (
                <form
                    onSubmit={handleSetStatment}
                    className="setStatement__form"
                >
                    <label htmlFor="statement">
                        <input
                            autoFocus={true}
                            type="text"
                            name="statement"
                            placeholder={t("Group Title")}
                            defaultValue={arrayOfStatementParagrphs[0]}
                        />
                    </label>
                    <div>
                        <textarea
                            name="description"
                            placeholder={t("Group Description")}
                            rows={3}
                            defaultValue={description}
                        ></textarea>
                    </div>
                    {!simple && (
                        <section>
                            <label
                                htmlFor="subPages"
                                style={{ fontSize: "1.3rem" }}
                            >
                                {t("Tabs")}
                            </label>
                            <div style={tabsStyle}>
                                {navArray
                                    .filter(
                                        (navObj) =>
                                            navObj.link !== Screen.SETTINGS
                                    )
                                    .map((navObj) => (
                                        <FormControlLabel
                                            key={navObj.id}
                                            control={
                                                <Switch
                                                    name={navObj.link}
                                                    defaultChecked={isSubPageChecked(
                                                        statement,
                                                        navObj
                                                    )}
                                                />
                                            }
                                            label={t(navObj.name)}
                                        />
                                    ))}
                            </div>
                            <label
                                htmlFor="subPages"
                                style={{
                                    fontSize: "1.3rem",
                                }}
                            >
                                {t("Advanced")}
                            </label>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="hasChildren"
                                            defaultChecked={hasChildren}
                                        />
                                    }
                                    label={t("Enable Sub-Conversations")}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="enableAddEvaluationOption"
                                            defaultChecked={
                                                enableAddEvaluationOption
                                            }
                                        />
                                    }
                                    label={t("Allow participants to contribute options to the evaluation page")}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="enableAddVotingOption"
                                            defaultChecked={
                                                enableAddVotingOption
                                            }
                                        />
                                    }
                                    label={t("Allow participants to contribute options to the voting page")}
                                />
                            </FormGroup>
                        </section>
                    )}

                    <select name="resultsBy" defaultValue={resultsBy}>
                        <option value={ResultsBy.topVote}>
                            {t("Voting Results")}
                        </option>
                        <option value={ResultsBy.topOptions}>
                            {t("Favorite Option")}
                        </option>
                    </select>
                    <label style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
                        {t("Number of Results to Display")}
                    </label>
                    <Slider
                        defaultValue={numOfResults}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        name={"numberOfResults"}
                        style={{
                            margin: "auto",
                            width: "90%",
                        }}
                    />

                    <div className="btnBox">
                        <button type="submit">
                            {!statementId ? t("Add") : t("Update")}
                        </button>
                    </div>
                    <h2>{t("Members in Group")}</h2>
                    {membership && (
                        <div className="setStatement__form__membersBox">
                            {membership.map((member) => (
                                <MembershipLine
                                    key={member.userId}
                                    member={member}
                                />
                            ))}
                        </div>
                    )}
                </form>
            ) : (
                <div className="center">
                    <h2>{t("Updating")}</h2>
                    <Loader />
                </div>
            )}
        </ScreenFadeInOut>
    );
};
