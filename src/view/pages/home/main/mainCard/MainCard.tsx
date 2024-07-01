import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../../../components/text/Text";

import StatementChatMore from "../../../statement/components/chat/components/StatementChatMore";
import { Link } from "react-router-dom";
import "./MainCard.scss";

//img
import ImgThumb from "../../../../../assets/images/ImgThumb.png";

interface Props {
  statement: Statement;
}

const MainCard: FC<Props> = ({ statement }) => {
  return (
    <div className="main-card">
      <Link
        to={`/statement/${statement.statementId}/chat`}
        className="main-card__link"
      >
        <div className="main-card__content">
          <img src={ImgThumb} className="main-card__img"></img>
          <StatementChatMore statement={statement} />
        </div>

        <Text text={statement.statement} />
      </Link>
    </div>
  );
};

export default MainCard;
