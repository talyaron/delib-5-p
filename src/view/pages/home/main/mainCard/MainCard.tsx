/* eslint-disable indent */
import { Statement, StatementSubscription } from "delib-npm";
import { FC } from "react";
import Text from "@/view/components/text/Text";

import StatementChatMore from "@/view/pages/statement/components/chat/components/StatementChatMore";
import { Link } from "react-router-dom";
import "./MainCard.scss";

//img
import ImgThumb from "@/assets/images/ImgThumb.png";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { subscriptionParentStatementSelector } from "@/model/statements/statementsSlice";
import { getLastElements } from "@/controllers/general/helpers";
import UpdateMainCard from "./updateMainCard/UpdateMainCard";

interface Props {
  statement: Statement;
}

const MainCard: FC<Props> = ({ statement }) => {
  const _subscribedStatements = useAppSelector(
    subscriptionParentStatementSelector(statement.statementId)
  ).sort((a, b) => a.lastUpdate - b.lastUpdate);
  const subscribedStatements = getLastElements(_subscribedStatements, 5) as StatementSubscription[];
  const statementImgUrl = statement.imagesURL?.main

  return (
    <div className="main-card">
      <Link
        to={`/statement/${statement.statementId}/chat`}
        className="main-card__link"
      >
        <div className="main-card__content">
          <div style={{backgroundImage: `url(${statementImgUrl ? statementImgUrl : ImgThumb})`}} className="main-card__img"></div>
          <StatementChatMore statement={statement} />
        </div>

        <Text text={statement.statement} />
        <div className="main-card__updates">
          {subscribedStatements.map((subscribedStatement) => (
            <UpdateMainCard
              key={subscribedStatement.statementId}
              subscription={subscribedStatement}
            />
          ))}
        </div>
      </Link>
    </div>
  );
};

export default MainCard;
