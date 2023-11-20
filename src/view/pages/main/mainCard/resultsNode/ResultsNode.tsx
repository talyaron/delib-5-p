import { Statement, StatementType } from "delib-npm"
import { FC } from "react"
import Text from "../../../../components/text/Text"
import Solutions from "../../../../components/solutions/Solutions"
import StatementChatMore from "../../../statement/components/chat/StatementChatMore"
import { Link } from "react-router-dom"
import styles from "./ResultsNode.module.scss";

interface Props {
    statement: Statement;
    resultsType: StatementType[];
}
export const ResultsNode: FC<Props> = ({ statement }) => {
    return (
        <div className={styleSwitch(styles, statement)}>
            <Link to={`/home/statement/${statement.statementId}`}>
                <Text text={statement.statement} />
                <Solutions statement={statement} />
                <StatementChatMore statement={statement} />
            </Link>
        </div>
    )
}

function styleSwitch(styles:any, statement:Statement) {
    const {isQuestion, isOption} = statement;
    if(isQuestion) return styles.question;
    if(isOption) return styles.option;
    return styles.general;
}
