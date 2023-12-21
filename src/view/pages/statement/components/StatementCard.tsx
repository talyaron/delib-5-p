import { FC } from "react"

// Third Party
import { Link } from "react-router-dom"
import { Statement } from "delib-npm"

// Custom Components
import Text from "../../../components/text/Text"
import Edit from "../../../components/edit/Edit"
import StatementChat from "./chat/StatementChatMore"


interface Props {
    statement: Statement
}

const StatementCard: FC<Props> = ({ statement }) => {
    const title = statement.statement.split("\n")[0]
    //get only 140 charcters from the statment
    const _description = statement.statement.split("\n").slice(1).join("\n")
    const description = _description.slice(0, 256) + "..."
    return (
        <div className="statementCard">
            <Link
                className="href--undecorated"
                to={`/statement/${statement.statementId}/chat`}
            >
                <div className="statementCard__main">
                    <Text text={title} />
                    {_description ? <Text text={description} /> : null}
                  
                </div>
            </Link>
            <div className="statementCard__more">
                <StatementChat statement={statement} />
                <Edit statement={statement} />
            </div>
        </div>
    )
}

export default StatementCard
