import React from "react"

// Custom components
import StatementMain from "./components/StatementMain"
import { StatementSettings } from "./components/admin/StatementSettings"
import StatmentRooms from "./components/rooms/Rooms"
import StatementVote from "./components/vote/StatementVote"
import StatementOptions from "./components/options/StatementOptions"
import Document from "./components/doc/Document"

// Third party imports
import { Screen, Statement } from "delib-npm"

interface SwitchScreensProps {
    screen: string | undefined
    statement: Statement | undefined
    subStatements: Statement[]
    handleShowTalker: Function
}

export default function SwitchScreens({
    screen,
    statement,
    subStatements,
    handleShowTalker,
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
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            )
        case Screen.CHAT:
            return (
                <StatementMain
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
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            )
    }
}
