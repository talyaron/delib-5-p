import { Statement, StatementType } from "delib-npm"
import { FC } from "react"
import Text from "../../../../components/text/Text"
import StatementChatMore from "../../../statement/components/chat/StatementChatMore"
import { Link } from "react-router-dom"
import styles from "./ResultsNode.module.scss"
import { styleSwitch } from "./ResultsNodeCont"

interface Props {
    statement: Statement
    resultsType: StatementType[]
}
export const ResultsNode: FC<Props> = ({ statement }) => {
    return (
        <div className={styleSwitch(styles, statement)}>
            <Link to={`/statement/${statement.statementId}/chat`}>
                <Text text={statement.statement} />

                <StatementChatMore statement={statement} />
            </Link>
        </div>
    )
}
