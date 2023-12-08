import { Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../components/text/Text";

//css
import styles from "./MainCardRes.module.scss";
import StatementChatMore from "../statement/components/chat/StatementChatMore";
import ResultsComp from "../../components/results/ResultsComp";

interface Props {
    statement: Statement;
}

const MainCardRes: FC<Props> = ({ statement }) => {
    return (
        <div className={styles.card}>
            <Text text={statement.statement} />
            <StatementChatMore statement={statement} />
            <ResultsComp statement={statement} />
        </div>
    );
};

export default MainCardRes;
