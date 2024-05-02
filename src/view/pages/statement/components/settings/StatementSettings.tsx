import { FC, useEffect, useState } from "react";

// Third party imports
import { useParams } from "react-router-dom";
import { Statement } from "delib-npm";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../controllers/hooks/reduxHooks";
import {
    setStatement,
    statementSelector,
} from "../../../../../model/statements/statementsSlice";

// Firestore functions
import { getStatementFromDB } from "../../../../../controllers/db/statements/getStatement";
import { listenToMembers } from "../../../../../controllers/db/statements/listenToStatements";

// Custom components
import Loader from "../../../../components/loaders/Loader";
import ScreenFadeIn from "../../../../components/animation/ScreenFadeIn";

// Hooks & Helpers
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";
import StatementSettingsForm from "./components/statementSettingsForm/StatementSettingsForm";

interface Props {
    simple?: boolean;
    new?: boolean;
}

const StatementSettings: FC<Props> = () => {
    // * Hooks * //
    const { statementId } = useParams();
    const { t } = useLanguage();

    // * Redux * //
    const dispatch = useAppDispatch();
    const statement: Statement | undefined = useAppSelector(
        statementSelector(statementId),
    );

    // * Use State * //
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <ScreenFadeIn className="page__main">
            {isLoading ? (
                <div className="center">
                    <h2>{t("Updating")}</h2>
                    <Loader />
                </div>
            ) : (
                <StatementSettingsForm
                    setIsLoading={setIsLoading}
                    statement={statement}
                />
            )}
        </ScreenFadeIn>
    );
};

export default StatementSettings;
