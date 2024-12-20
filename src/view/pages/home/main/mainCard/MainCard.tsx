/* eslint-disable indent */
import { Statement } from "delib-npm";
import { FC, useEffect } from "react";

import { Link } from "react-router-dom";
import "./MainCard.scss";

//img
import UpdateMainCard from "./updateMainCard/UpdateMainCard";
import ImgThumb from "@/assets/images/ImgThumb.png";
import { listenToAllSubStatements } from "@/controllers/db/statements/listenToStatements";
import { getLastElements } from "@/controllers/general/helpers";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import {  subStatementsByTopParentIdMemo} from "@/model/statements/statementsSlice";
import Text from "@/view/components/text/Text";
import StatementChatMore from "@/view/pages/statement/components/chat/components/StatementChatMore";

interface Props {
  statement: Statement;
}

const MainCard: FC<Props> = ({ statement }) => {
  const _subStatements: Statement[] = useAppSelector(
    subStatementsByTopParentIdMemo(statement.statementId)
  )
    .filter((s) => s.statementId !== statement.statementId)
    .sort((a, b) => a.lastUpdate - b.lastUpdate);
  const subStatements = getLastElements(_subStatements, 7) as Statement[];
  const statementImgUrl = statement.imagesURL?.main;

  const description =
    statement.description && statement.description.length > 30
      ? `${statement.description.slice(0, 144)} ...`
      : statement.description;

  useEffect(() => {
    const unsub = listenToAllSubStatements(statement.statementId);

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="main-card">
      <Link
        to={`/statement/${statement.statementId}/chat`}
        className="main-card__link"
      >
        <div className="main-card__content">
          <div
            style={{
              backgroundImage: `url(${statementImgUrl ? statementImgUrl : ImgThumb})`,
            }}
            className="main-card__img"
          ></div>
          <StatementChatMore statement={statement} />
        </div>  
        <Text statement={statement.statement} description={description} />
      </Link>
      <div className="main-card__updates">
        {subStatements.map((subStatement: Statement) => (
          <UpdateMainCard
            key={subStatement.statementId}
            statement={subStatement}
          />
        ))}
      </div>
    </div>
  );
};

export default MainCard;
