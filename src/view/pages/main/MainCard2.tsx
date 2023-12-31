import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../components/text/Text";
// import chatIcon from "../../../assets/chatIcon.svg";


//css
import styles from "./MainCard.module.scss";
import StatementChatMore from "../statement/components/chat/StatementChatMore";
import { Link } from "react-router-dom";

interface Props {
    statement: Statement;
}


const MainCard: FC<Props> = ({ statement }) => {
    return (
        <div className={styles.mainCard}>
            <Link to={`/statement/${statement.statementId}/chat`}>
                <div className={styles.mainCard__info}>
                    <Text text={statement.statement} />
                    <StatementChatMore statement={statement} />
                    {/* <ResultsComp statement={statement} /> */}

                </div>
               
            </Link>
        </div>
    );
};

export default MainCard;
// export default MainCard;

