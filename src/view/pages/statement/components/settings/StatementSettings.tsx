import { FC, useEffect, useState } from "react";

// Statment imports
import {
    createStatement,
    setStatmentToDB,
    updateStatement,
} from "../../../../../functions/db/statements/setStatments";

// Third party imports
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import { StatementSubscription, Statement, StatementType } from "delib-npm";

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

import {
    navigateToStatementTab,
    parseScreensCheckBoxes,
} from "../../../../../functions/general/helpers";
import UploadImage from "../../../../components/uploadImage/UploadImage";
import DisplayResultsBy from "./DisplayResultsBy";
import ResultsRange from "./ResultsRange";
import GetVoters from "./GetVoters";
import GetEvaluators from "./GetEvaluators";
import CheckBoxeArea from "./CheckBoxeArea";

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
        statementSelector(statementId),
    );

    const membership: StatementSubscription[] = useAppSelector(
        statementMembershipSelector(statementId),
    );

    // Use State
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let unsubscribe: undefined | (() => void);
        if (statementId) {
            unsubscribe = listenToMembers(
                statementId,
                setMembershipCB,
                removeMembershipCB,
            );

            if (!statement)
                (async () => {
                    const statementDB = await getStatementFromDB(statementId);
                    if (statementDB) dispatch(setStatement(statementDB));
                })();
        }

        return () => {
            if (unsubscribe) unsubscribe();
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

            // const resultsBy = data.get("resultsBy") as ResultsBy;
            // const numberOfResults: number = Number(data.get("numberOfResults"));
            const description = data.get("description");

            //add to title * at the beggining
            if (title && !title.startsWith("*")) title = "*" + title;

            const _statement = `${title}\n${description}`;
            if (!_statement) return;

            const dataObj: any = Object.fromEntries(data.entries());
            const screens = parseScreensCheckBoxes(dataObj);
            const {
                resultsBy,
                numberOfResults,
                hasChildren,
                enableAddEvaluationOption,
                enableAddVotingOption,
            } = dataObj;

            if (!statementId) {
                const newStatement = createStatement({
                    text: _statement,
                    screens,
                    statementType: StatementType.question,
                    parentStatement: "top",
                    resultsBy,
                    numberOfResults,
                    hasChildren,
                    enableAddEvaluationOption,
                    enableAddVotingOption,
                });
                if (!newStatement)
                    throw new Error("newStatement had error in creating");

                await setStatmentToDB({
                    parentStatement: "top",
                    statement: newStatement,
                    addSubscription: true,
                });
                setIsLoading(false);
                navigateToStatementTab(newStatement, navigate);

                return;
            } else {
                //update statement
                if (!statement) throw new Error("statement is undefined");

                const newStatement = updateStatement({
                    statement,
                    text: _statement,
                    screens,
                    statementType: StatementType.question,
                    resultsBy,
                    numberOfResults,
                    hasChildren,
                    enableAddEvaluationOption,
                    enableAddVotingOption,
                });
                if (!newStatement)
                    throw new Error("newStatement had not been updated");

                await setStatmentToDB({
                    parentStatement: statement,
                    statement: newStatement,
                    addSubscription: true,
                });
                setIsLoading(false);
                navigateToStatementTab(newStatement, navigate);

                return;
            }
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
                            required={true}
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
