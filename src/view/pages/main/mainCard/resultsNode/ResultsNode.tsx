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
    const tab = statement.subScreens ? statement.subScreens[0] : "settings"

    return (
        <div className={styleSwitch(styles, statement)}>
            <Link to={`/home/statement/${statement.statementId}/${tab}`}>
                <Text text={statement.statement} />

                <StatementChatMore statement={statement} />
            </Link>
        </div>
    )
}
