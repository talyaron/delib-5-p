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

// Custom components
import Loader from "../../../../components/loaders/Loader";
import ScreenFadeIn from "../../../../components/animation/ScreenFadeIn";

// Hooks & Helpers
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";
import StatementSettingsForm from "./components/statementSettingsForm/StatementSettingsForm";
import { listenToMembers } from "../../../../../controllers/db/statements/listenToStatements";
import { getStatementFromDB } from "../../../../../controllers/db/statements/getStatement";
import { defaultEmptyStatement } from "./emptyStatementModel";

interface StatementSettingsProps {
    simple?: boolean;
    new?: boolean;
}

const StatementSettings: FC<StatementSettingsProps> = () => {
    // * Hooks * //
    const { statementId } = useParams();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [statementToEdit, setStatementToEdit] = useState<
        Statement | undefined
    >();
  
    const dispatch = useAppDispatch();

    const statement: Statement | undefined = useAppSelector(
        statementSelector(statementId),
    );

    // * Use Effect * //
    useEffect(() => {
        let unsubscribe: undefined | (() => void);

        if (statementId) {
            unsubscribe = listenToMembers(dispatch)(statementId);

            if (statement) {
                setStatementToEdit(statement);
            } else {
                (async () => {
                    const statementDB = await getStatementFromDB(statementId);
                    if (statementDB) {
                        dispatch(setStatement(statementDB));
                        setStatementToEdit(statementDB);
                    }
                })();
            }
        } else {
            setStatementToEdit(defaultEmptyStatement);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [statementId]);

    return (
        <ScreenFadeIn className="page__main">
            {isLoading || !statementToEdit ? (
                <div className="center">
                    <h2>{t("Updating")}</h2>
                    <Loader />
                </div>
            ) : (
                <StatementSettingsForm
                    setIsLoading={setIsLoading}
                    statement={statementToEdit}
                    setStatementToEdit={setStatementToEdit}
                />
            )}
        </ScreenFadeIn>
    );
};

export default StatementSettings;
