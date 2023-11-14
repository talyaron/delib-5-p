import { FC, useEffect, useRef } from "react"
import { Statement } from "delib-npm"
import StatementChat from "./chat/StatementChat"
import StatementInput from "../../../pages/statement/StatementInput"
import { motion as m } from "framer-motion"
import "../../../style/page.scss"

interface Props {
    statement: Statement
    subStatements: Statement[]
    handleShowTalker: Function
    page: any
}

let firstTime = true

const StatementMain: FC<Props> = ({
    statement,
    subStatements,
    handleShowTalker,
    page,
}) => {
    const messagesEndRef = useRef(null)

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

    const {hasChildren = false} = statement;

    return (
        <m.main
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            exit={{ x: "-100%" }}
            style={{ height: "100%" }}
        >
            <div
                className="chatWindow"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <div className="wrapper wrapper--chat">
                    {subStatements?.map((statementSub: Statement) => (
                        <div key={statementSub.statementId}>
                            <StatementChat
                                statement={statementSub}
                                showImage={handleShowTalker}
                                page={page}
                                hasChildren={hasChildren}
                            />
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div
                    className="page__footer"
                    style={{ marginTop: "auto", padding: 20 }}
                >
                    {statement ? (
                        <StatementInput statement={statement} />
                    ) : null}
                </div>
            </div>
        </m.main>
    )
}

export default StatementMain
