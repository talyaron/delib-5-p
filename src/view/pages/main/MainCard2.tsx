import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../components/text/Text";
// import chatIcon from "../../../assets/chatIcon.svg";


//css
import "../../style/mainCard.scss"
// import styles from "./MainCard.module.scss";
import StatementChatMore from "../statement/components/chat/StatementChatMore";
import { Link } from "react-router-dom";

interface Props {
    statement: Statement;
}


const MainCard: FC<Props> = ({ statement }) => {
    return (
        <div className="mainCard">
            <Link to={`/statement/${statement.statementId}/chat`}>
                    <Text text={statement.statement} />
                    <StatementChatMore statement={statement} />
                    {/* <ResultsComp statement={statement} /> */}             
            </Link>
        </div>
    );
};

export default MainCard;


