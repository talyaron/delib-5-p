import { SimpleStatement, Statement } from "delib-npm";
import { FC } from "react";
import Text from "../../components/text/Text";

//css
import styles from "./MainCardRes.module.scss";
import StatementChatMore from "../statement/components/chat/StatementChatMore";


interface Props {
    statement: Statement;
}

const MainCardRes: FC<Props> = ({ statement }) => {
    
console.log(statement.results);
    return (
        <div className={styles.card}>
            <Text text={statement.statement} />
            <StatementChatMore statement={statement} />
            {statement.results ? (
                <div>
                    {statement.results?.votes?.map(
                        (statement: SimpleStatement) => (
                            <p>{statement.statement}</p>
                        )
                    )}
                </div>
            ) : (
                <div>no results</div>
            )}
        </div>
    );
};

export default MainCardRes;
