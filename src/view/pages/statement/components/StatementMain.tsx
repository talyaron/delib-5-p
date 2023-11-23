import { FC, useEffect, useRef, useState } from "react"

// Third Party Imports
import { Statement } from "delib-npm"
import { useLocation } from "react-router-dom"

// Custom Components
import StatementChat from "./chat/StatementChat"
import StatementInput from "./StatementInput"
import ScreenFadeInOut from "../../../components/animation/ScreenFadeInOut"
import ScreenSlide from "../../../components/animation/ScreenSlide"

interface Props {
    statement: Statement
    subStatements: Statement[]
    handleShowTalker: Function
    topBar: React.RefObject<HTMLDivElement>
}

let firstTime = true

const StatementMain: FC<Props> = ({
    statement,
    subStatements,
    handleShowTalker,
    topBar,
}) => {
    const messagesEndRef = useRef(null)
    const location = useLocation()

    // Use State
    const [toSlide, setToSlide] = useState(false)
    const [toSubStatement, setToSubStatement] = useState(false)

    useEffect(() => {
        const testToSlide = location.state
            ? location.state.from.split("/").length === 5
            : false

        const previousStateId = location.state
            ? location.state.from.split("/")[3]
            : null

        if (previousStateId === statement.parentId) {
            setToSubStatement(true)
        } else {
            setToSubStatement(false)
        }

        setToSlide(testToSlide)
    }, [statement.statementId])

    //scroll to bottom
    const scrollToBottom = () => {
        if (!messagesEndRef) return
        if (!messagesEndRef.current) return
        if (firstTime) {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: "auto" })
            firstTime = false
        } else {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    //effects
    useEffect(() => {
        firstTime = true
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [subStatements])

    return !toSlide ? (
        <ScreenFadeInOut>
            <div className="wrapper wrapper--chat">
                {subStatements?.map((statementSub: Statement) => (
                    <div key={statementSub.statementId}>
                        <StatementChat
                            statement={statementSub}
                            showImage={handleShowTalker}
                        />
                    </div>
                ))}
                <div ref={messagesEndRef} />
                {statement && (
                    <StatementInput topBar={topBar} statement={statement} />
                )}
            </div>
        </ScreenFadeInOut>
    ) : (
        <ScreenSlide toSubStatement={toSubStatement}>
            <div className="wrapper wrapper--chat">
                {subStatements?.map((statementSub: Statement) => (
                    <div key={statementSub.statementId}>
                        <StatementChat
                            statement={statementSub}
                            showImage={handleShowTalker}
                        />
                    </div>
                ))}
                <div ref={messagesEndRef} />
                {statement && <StatementInput topBar={topBar} statement={statement} />}
            </div>
        </ScreenSlide>
    )
}

export default StatementMain
