import { FC, useEffect, useState } from "react";
// Statment imports
import { setStatmentToDB } from "../../../../../../functions/db/statements/setStatments";
import { navArray } from "../../nav/StatementNav";

// Third party imports
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
    UserSchema,
    User,
    StatementSubscription,
    ResultsBy,
    Screen,
    StatementType,
    Statement,
    Vote,
    Evaluation,
} from "delib-npm";

// Custom components
import CustomCheckboxLabel from "./CustomCheckboxLabel";
import Loader from "../../../../../components/loaders/Loader";
import MembershipLine from "../membership/MembershipLine";
import ScreenFadeIn from "../../../../../components/animation/ScreenFadeIn";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../../functions/hooks/reduxHooks";
import {
    removeMembership,
    setMembership,
    setStatement,
    statementMembershipSelector,
    statementSelector,
} from "../../../../../../model/statements/statementsSlice";
import { userSelector } from "../../../../../../model/users/userSlice";
import { store } from "../../../../../../model/store";

// Firestore functions
import {
    getStatementFromDB,
    listenToMembers,
} from "../../../../../../functions/db/statements/getStatement";

// * Statement Settings functions * //
import {
    parseScreensCheckBoxes,
    isSubPageChecked,
} from "./statementSettingsCont";
import { navigateToStatementTab } from "../../../../../../functions/general/helpers";
import UploadImage from "../../../../../components/uploadImage/UploadImage";
import CustomSwitch from "../../../../../components/switch/CustomSwitch";
import RadioCheckedIcon from "../../../../../components/icons/RadioCheckedIcon";
import RedioUncheckedIcon from "../../../../../components/icons/RedioUncheckedIcon";
import { handleGetEvaluators, handleGetVoters } from "../AdminPageCont";
import Chip from "../../../../../components/chip/Chip";
import DisplayResultsBy from "./DisplayResultsBy";

interface Props {
    simple?: boolean;
    new?: boolean;
}

export const StatementSettings: FC<Props> = () => {
    const navigate = useNavigate();
    const { statementId } = useParams();

    // Redux
    const dispatch = useAppDispatch();
    const statement: Statement | undefined = useAppSelector(
        statementSelector(statementId)
    );
    const membership: StatementSubscription[] = useAppSelector(
        statementMembershipSelector(statementId)
    );
    const user: User | null = useAppSelector(userSelector);

    // Use State
    const [isLoading, setIsLoading] = useState(false);
    const [numOfResults, setNumOfResults] = useState(
        statement?.resultsSettings?.numberOfResults || 1
    );

    const [voters, setVoters] = useState<Vote[]>([]);
    const [evaluators, setEvaluators] = useState<Evaluation[]>([]);

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
            const x = { ...newStatement };

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

    const hasChildren: boolean = (() => {
        if (!statement) return true;
        if (statement.hasChildren === undefined) return true;
        return statement.hasChildren;
    })();

    const enableAddEvaluationOption: boolean =
        statement?.statementSettings?.enableAddEvaluationOption === false
            ? false
            : true;

    const enableAddVotingOption: boolean =
        statement?.statementSettings?.enableAddVotingOption === false
            ? false
            : true;

    return (
        <ScreenFadeIn className="page__main">
            {!isLoading ? (
                <form onSubmit={handleSetStatment} className="settings">
                    <label htmlFor="statement">
                        <input
                            autoFocus={true}
                            type="text"
                            name="statement"
                            placeholder={t("Group Title")}
                            defaultValue={arrayOfStatementParagrphs[0]}
                        />
                    </label>
                    <label htmlFor="description">
                        <textarea
                            name="description"
                            placeholder={t("Group Description")}
                            rows={3}
                            defaultValue={description}
                        />
                    </label>
                    <section className="settings__checkboxSection">
                        <div className="settings__checkboxSection__column">
                            <h3 className="settings__checkboxSection__column__title">
                                {t("Tabs")}
                            </h3>
                            {navArray
                                .filter(
                                    (navObj) => navObj.link !== Screen.SETTINGS
                                )
                                .map((navObj, index) => (
                                    <CustomSwitch
                                        key={`tabs-${index}`}
                                        link={navObj.link}
                                        label={navObj.name}
                                        defaultChecked={isSubPageChecked(
                                            statement,
                                            navObj
                                        )}
                                    />
                                ))}
                        </div>
                        <div className="settings__checkboxSection__column">
                            <h3 className="settings__checkboxSection__column__title">
                                {t("Advanced")}
                            </h3>
                            <CustomCheckboxLabel
                                name={"hasChildren"}
                                title={"Enable Sub-Conversations"}
                                defaultChecked={hasChildren}
                            />
                            <CustomCheckboxLabel
                                name={"enableAddVotingOption"}
                                title={
                                    "Allow participants to contribute options to the voting page"
                                }
                                defaultChecked={enableAddVotingOption}
                            />
                            <CustomCheckboxLabel
                                name={"enableAddEvaluationOption"}
                                title={
                                    "Allow participants to contribute options to the evaluation page"
                                }
                                defaultChecked={enableAddEvaluationOption}
                            />
                        </div>
                    </section>

                    <DisplayResultsBy statement={statement} />

                    <section className="settings__rangeSection">
                        <label
                            className="settings__rangeSection__label"
                            style={{ fontSize: "1.3rem", marginBottom: "1rem" }}
                        >
                            {t("Number of Results to Display")}
                            {": "}
                        </label>
                        <div className="settings__rangeSection__rangeBox">
                            <input
                                className="settings__rangeSection__rangeBox__range"
                                type="range"
                                name="numberOfResults"
                                value={numOfResults}
                                min="1"
                                max="10"
                                onChange={(e) =>
                                    setNumOfResults(Number(e.target.value))
                                }
                            />
                            <span style={{ fontSize: 20 }}>{numOfResults}</span>
                        </div>
                    </section>

                    <button type="submit" className="settings__submitBtn">
                        {!statementId ? t("Add") : t("Update")}
                    </button>

                    {statementId && <UploadImage statement={statement} />}

                    {membership && statementId && (
                        <>
                            <h2>{t("Members in Group")}</h2>
                            <div className="setStatement__form__membersBox">
                                {membership.map((member) => (
                                    <MembershipLine
                                        key={member.userId}
                                        member={member}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {statementId && (
                        <section className="settings__getVoters">
                            <button
                                type="button"
                                className="settings__getVoters__btn formBtn"
                                onClick={() =>
                                    handleGetVoters(statementId, setVoters)
                                }
                            >
                                Get Voters
                            </button>
                            <div>
                                {voters.map((voter) => {
                                    return (
                                        <Chip
                                            key={voter.voteId}
                                            user={voter.voter}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {statementId && (
                        <section className="settings__getEvaluators">
                            <button
                                type="button"
                                className="settings__getEvaluators__btn formBtn"
                                onClick={() =>
                                    handleGetEvaluators(
                                        statementId,
                                        setEvaluators
                                    )
                                }
                            >
                                Get Evaluators
                            </button>
                            <div>
                                {evaluators.map((evaluator) => {
                                    return (
                                        <Chip
                                            key={evaluator.evaluationId}
                                            user={evaluator.evaluator}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </form>
            ) : (
                <div className="center">
                    <h2>{t("Updating")}</h2>
                    <Loader />
                </div>
            )}
        </ScreenFadeIn>
    );
};
