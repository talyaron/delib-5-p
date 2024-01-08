import { FC, useEffect, useState } from "react";
// Statment imports
import { setStatmentToDB } from "../../../../../functions/db/statements/setStatments";

// Third party imports
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
    StatementSubscription,
    ResultsBy,
    Statement,
} from "delib-npm";

// Custom components
import Loader from "../../../../components/loaders/Loader";
import MembershipLine from "./membership/MembershipLine";
import ScreenFadeIn from "../../../../components/animation/ScreenFadeIn";

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


// Firestore functions
import {
    getStatementFromDB,
    listenToMembers,
} from "../../../../../functions/db/statements/getStatement";

// * Statement Settings functions * //
import { parseScreensCheckBoxes } from "./statementSettingsCont";
import { navigateToStatementTab } from "../../../../../functions/general/helpers";
import UploadImage from "../../../../components/uploadImage/UploadImage";
import DisplayResultsBy from "./DisplayResultsBy";
import ResultsRange from "./ResultsRange";
import GetVoters from "./GetVoters";
import GetEvaluators from "./GetEvaluators";
import CheckBoxeArea from "./CheckBoxeArea";
import { navArray } from "../nav/top/StatementTopNavModel";

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


    // Use State
    const [isLoading, setIsLoading] = useState(false);

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

    async function handleSetStatment(ev: any) {
        try {
            ev.preventDefault();
            setIsLoading(true);

            const data = new FormData(ev.currentTarget);

            let title: any = data.get("statement");
            if (!title || title.length < 2) return;

            const resultsBy = data.get("resultsBy") as ResultsBy;
            const numberOfResults: number = Number(data.get("numberOfResults"));
            const description = data.get("description");

            //add to title * at the beggining
            if (title && !title.startsWith("*")) title = "*" + title;

            const _statement = `${title}\n${description}`;

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

            newStatement.hasChildren =
                newStatement.hasChildren === "on" ? true : false;

            //enableAddOption in statement screens with bottom nav
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

            //can transfer to a setStatmentToDB function
            newStatement.consensus = statement?.consensus || 0;

            //can transfer to a setStatmentToDB function
            const setSubsciption: boolean =
                statementId === undefined ? true : false;

            //remove all "on" values
            for (const key in newStatement) {
                if (newStatement[key] === "on") delete newStatement[key];
            }

            const _statementId = await setStatmentToDB({
                parentStatement: statementId ? statement : "top",
                statement: newStatement,
                addSubscription: setSubsciption,
            });

            if (_statementId) navigateToStatementTab(newStatement, navigate);
        } catch (error) {
            console.error(error);
        }
    }

    const arrayOfStatementParagrphs = statement?.statement.split("\n") || [];
    //get all elements of the array except the first one
    const description = arrayOfStatementParagrphs?.slice(1).join("\n");

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

                    <CheckBoxeArea statement={statement} />

                    <DisplayResultsBy statement={statement} />

                    <ResultsRange statement={statement} />

                    <button type="submit" className="settings__submitBtn">
                        {!statementId ? t("Add") : t("Update")}
                    </button>

                    {statementId && <UploadImage statement={statement} />}

                    {membership && statementId && (
                        <>
                            <h2>{t("Members in Group")}</h2>
                            <div className="settings__membersBox">
                                {membership.map((member) => (
                                    <MembershipLine
                                        key={member.userId}
                                        member={member}
                                    />
                                ))}
                            </div>

                            <b>{membership.length} Members</b>
                        </>
                    )}

                    <GetVoters statementId={statementId} />

                    <GetEvaluators statementId={statementId} />
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
