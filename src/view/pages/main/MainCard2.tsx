import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../components/text/Text";

//css
import styles from "./MainCardRes.module.scss";
import StatementChatMore from "../statement/components/chat/StatementChatMore";
import { Link } from "react-router-dom";

interface Props {
    statement: Statement;
}

const MainCardRes: FC<Props> = ({ statement }) => {
    return (
       
        <div className={styles.card}>
             <Link to={`/statement/${statement.statementId}/chat`}>
            <Text text={statement.statement} />
            <StatementChatMore statement={statement} />
            {/* <ResultsComp statement={statement} /> */}
            </Link>
        </div>
       
    );
};

export default MainCardRes;
