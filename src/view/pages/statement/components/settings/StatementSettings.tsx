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
import { listenToStatementMeta } from "../../../../../controllers/db/statements/listenToStatementMeta";

const StatementSettings: FC = () => {
  try {
    // * Hooks * //
    const { statementId } = useParams();
    const { t } = useLanguage();
    const [parentStatement, setParentStatement] = useState<
      Statement | undefined | "top"
    >(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [statementToEdit, setStatementToEdit] = useState<
      Statement | undefined
    >();

    const dispatch = useAppDispatch();

    const statement: Statement | undefined = useAppSelector(
      statementSelector(statementId)
    );

    useEffect(() => {
      try {
        if (statement) {
          setStatementToEdit(statement);

          if (statement.parentId === "top") {
            setParentStatement("top");

            return;
          }

          //get parent statement
          getStatementFromDB(statement.parentId)
            .then((parentStatement) => {
              try {
                if (!parentStatement) throw new Error("no parent statement");

                setParentStatement(parentStatement);
              } catch (error) {
                console.error(error);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      } catch (error) {
        console.error(error);
      }
    }, [statement]);

    // * Use Effect * //
    useEffect(() => {
      try {
        let unsubscribe: undefined | (() => void);
        let unsubMeta: undefined | (() => void);

        if (statementId) {
          unsubscribe = listenToMembers(dispatch)(statementId);
          unsubMeta = listenToStatementMeta(statementId, dispatch);

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
          if (unsubMeta) unsubMeta();
        };
      } catch (error) {
        console.error(error);
      }
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
            parentStatement={parentStatement}
            setStatementToEdit={setStatementToEdit}
          />
        )}
      </ScreenFadeIn>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default StatementSettings;
