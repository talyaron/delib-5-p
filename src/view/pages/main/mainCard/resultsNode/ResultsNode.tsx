import {  Statement, StatementType } from "delib-npm"
import { FC } from "react"
import Text from "../../../../components/text/Text"
import Solutions from "../../../../components/solutions/Solutions"
import StatementChatMore from "../../../statement/components/chat/StatementChatMore"
import { Link } from "react-router-dom"
import styles from "./ResultsNode.module.scss"
import { isShow, styleSwitch } from "./ResultsNodeCont"

interface Props {
    statement: Statement
    resultsType: StatementType[]
}
export const ResultsNode: FC<Props> = ({ statement, resultsType }) => {
   
    const show = isShow(statement, resultsType)
    if (!show) return null

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
