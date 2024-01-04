import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../components/text/Text";
// import chatIcon from "../../../assets/chatIcon.svg";

//css

// import styles from "./MainCard.module.scss";
import StatementChatMore from "../statement/components/chat/StatementChatMore";
import { Link } from "react-router-dom";

interface Props {
    statement: Statement;
}

const MainCard: FC<Props> = ({ statement }) => {
    return (
        <div
            className="mainCard"
            style={{ borderLeft: `.625rem solid ${statement.color}` }}
        >
            <Link to={`/statement/${statement.statementId}/chat`}>
                <Text text={statement.statement} />
                <StatementChatMore statement={statement} color={'gray'} />
            </Link>
        </div>
    );
};

export default MainCard;
