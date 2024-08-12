import { FC, useEffect, useState } from "react";
import styles from "./components/StatementSettings.module.scss";

// Third party imports
import { Statement, StatementSubscription } from "delib-npm";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks";
import {
    setStatement,
    statementMembershipSelector,
    statementSelector,
} from "../../../../../model/statements/statementsSlice";

// Firestore functions
import { getStatementFromDB } from "../../../../../functions/db/statements/getStatement";
import { listenToMembers } from "../../../../../functions/db/statements/listenToStatements";

// Custom components
import ScreenFadeIn from "../../../../components/animation/ScreenFadeIn";
import ShareIcon from "../../../../components/icons/ShareIcon";
import Loader from "../../../../components/loaders/Loader";
import UploadImage from "../../../../components/uploadImage/UploadImage";
import CheckBoxeArea from "./components/CheckBoxeArea";
import DisplayResultsBy from "./components/DisplayResultsBy";
import GetEvaluators from "./components/GetEvaluators";
import GetVoters from "./components/GetVoters";
import MembershipLine from "./components/membership/MembershipLine";
import ResultsRange from "./components/ResultsRange";
import { handleSetStatment, handleShare } from "./statementSettingsCont";

interface Props {
    simple?: boolean;
    new?: boolean;
}

const StatementSettings: FC<Props> = () => {
    // * Hooks * //
    const navigate = useNavigate();
    const { statementId } = useParams();

    // * Redux * //
    const dispatch = useAppDispatch();
    const statement: Statement | undefined = useAppSelector(
        statementSelector(statementId),
    );

    // * Use State * //
    const [isLoading, setIsLoading] = useState(false);

    // * Variables * //
    const membership: StatementSubscription[] = useAppSelector(
        statementMembershipSelector(statementId),
    );
    const arrayOfStatementParagrphs = statement?.statement.split("\n") || [];

    //get all elements of the array except the first one
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
                <form onSubmit={handleSubmit} className="settings">
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

                            <div
                                className={styles.linkAnonymous}
                                onClick={() => handleShare(statement)}
                            >
                                {t("Send a link to anonymous users")}
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

                    <GetVoters statementId={statementId} showNonVoters={true} membership={membership} />
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

export default StatementSettings;
