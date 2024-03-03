import { FC, useEffect, useState } from "react";
import styles from "./components/StatementSettings.module.scss";

// Third party imports
import { useNavigate, useParams } from "react-router-dom";
import { StatementSubscription, Statement } from "delib-npm";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks";
import {
    setStatement,
    statementSelector,
} from "../../../../../model/statements/statementsSlice";

// Firestore functions
import { getStatementFromDB } from "../../../../../functions/db/statements/getStatement";
import { listenToMembers } from "../../../../../functions/db/statements/listenToStatements";

// Custom components
import Loader from "../../../../components/loaders/Loader";
import MembershipLine from "./components/membership/MembershipLine";
import ScreenFadeIn from "../../../../components/animation/ScreenFadeIn";
import UploadImage from "../../../../components/uploadImage/UploadImage";
import DisplayResultsBy from "./components/DisplayResultsBy";
import ResultsRange from "./components/ResultsRange";
import GetVoters from "./components/GetVoters";
import GetEvaluators from "./components/GetEvaluators";
import CheckBoxeArea from "./components/CheckBoxeArea";
import ShareIcon from "../../../../components/icons/ShareIcon";

// Hooks & Helpers
import { handleSetStatment, handleShare } from "./statementSettingsCont";
import { useLanguage } from "../../../../../functions/hooks/useLanguages";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../../model/store";

interface Props {
    simple?: boolean;
    new?: boolean;
}

const StatementSettings: FC<Props> = () => {
    // * Hooks * //
    const navigate = useNavigate();
    const { statementId } = useParams();
    const { languageData } = useLanguage();

    // * Redux * //
    const dispatch = useAppDispatch();
    const statement: Statement | undefined = useAppSelector(
        statementSelector(statementId),
    );
    
    const statementMembershipSelector = (statementId: string | undefined) =>
        createSelector(
            (state: RootState) => state.statements.statementMembership, // Replace with your actual state selector
            (memberships) =>
                memberships.filter(
                    (membership: StatementSubscription) =>
                        membership.statementId === statementId,
                ),
        );

    const membership: StatementSubscription[] = useAppSelector(
        statementMembershipSelector(statementId),
    );

    // * Use State * //
    const [isLoading, setIsLoading] = useState(false);

    // * Variables * //
    const arrayOfStatementParagrphs = statement?.statement.split("\n") || [];

    // Get all elements of the array except the first one
    const description = arrayOfStatementParagrphs?.slice(1).join("\n");

    // * Use Effect * //
    useEffect(() => {
        let unsubscribe: undefined | (() => void);

        if (statementId) {
            unsubscribe = listenToMembers(dispatch)(statementId);

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

    // * Funtions * //
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        await handleSetStatment(e, navigate, statementId, statement);

        setIsLoading(false);
    };

    return (
        <ScreenFadeIn className="page__main">
            {!isLoading ? (
                <form
                    onSubmit={handleSubmit}
                    className="settings"
                    data-cy="statement-settings-form"
                >
                    <label htmlFor="statement">
                        <input
                            data-cy="statement-title"
                            autoFocus={true}
                            type="text"
                            name="statement"
                            placeholder={languageData["Group Title"]}
                            defaultValue={arrayOfStatementParagrphs[0]}
                            required={true}
                        />
                    </label>
                    <label htmlFor="description">
                        <textarea
                            name="description"
                            placeholder={languageData["Group Description"]}
                            rows={3}
                            defaultValue={description}
                        />
                    </label>

                    <CheckBoxeArea statement={statement} />

                    <DisplayResultsBy statement={statement} />

                    <ResultsRange statement={statement} />

                    <button
                        type="submit"
                        className="settings__submitBtn"
                        data-cy="settings-statement-submit-btn"
                    >
                        {!statementId
                            ? languageData["Add"]
                            : languageData["Update"]}
                    </button>

                    {statementId && <UploadImage statement={statement} />}

                    {membership && statementId && (
                        <>
                            <h2>{languageData["Members in Group"]}</h2>

                            <div
                                className={styles.linkAnonymous}
                                onClick={() => handleShare(statement)}
                            >
                                {languageData["Send a link to anonymous users"]}
                                <ShareIcon />
                            </div>

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
                    <h2>{languageData["Updating"]}</h2>
                    <Loader />
                </div>
            )}
        </ScreenFadeIn>
    );
};

export default StatementSettings;
