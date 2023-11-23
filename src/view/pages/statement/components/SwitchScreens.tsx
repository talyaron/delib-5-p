// Custom components
import StatementMain from "./StatementMain"
import { StatementSettings } from "./admin/StatementSettings"
import StatmentRooms from "./rooms/Rooms"
import StatementVote from "./vote/StatementVote"
import StatementOptions from "./options/StatementOptions"
import Document from "./doc/Document"

// Third party imports
import { Screen, Statement } from "delib-npm"

interface SwitchScreensProps {
    screen: string | undefined
    statement: Statement | undefined
    subStatements: Statement[]
    handleShowTalker: Function
    topBar: React.RefObject<HTMLDivElement>
}

export default function SwitchScreens({
    screen,
    statement,
    subStatements,
    handleShowTalker,
    topBar,
}: SwitchScreensProps) {
    if (!statement) return null

    switch (screen) {
        case Screen.DOC:
            return (
                <Document statement={statement} subStatements={subStatements} />
            )
        case Screen.HOME:
            return (
                <StatementMain
                    topBar={topBar}
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            )
        case Screen.CHAT:
            return (
                <StatementMain
                    topBar={topBar}
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            )
        case Screen.OPTIONS:
            return (
                <StatementOptions
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            )
        case Screen.VOTE:
            return (
                <StatementVote
                    statement={statement}
                    subStatements={subStatements}
                />
            )
        case Screen.GROUPS:
            return (
                <StatmentRooms
                    statement={statement}
                    subStatements={subStatements}
                />
            )
        case Screen.SETTINGS:
            return <StatementSettings />
        default:
            return (
                <StatementMain
                    topBar={topBar}
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            )
    }
}
