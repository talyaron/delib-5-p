import { FC, useEffect, useRef } from 'react'
import { Statement } from 'delib-npm';
import StatementChat from './chat/StatementChat';
import StatementInput from '../../../pages/statement/StatementInput';
interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: Function;
    page:any;
}

let firstTime = true;

const StatementMain: FC<Props> = ({ statement, subStatements, handleShowTalker, page }) => {

    const messagesEndRef = useRef(null)

    //scroll to bottom
    const scrollToBottom = () => {
        if (!messagesEndRef) return;
        if (!messagesEndRef.current) return;
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
    useEffect(() => { firstTime = true }, [])

    useEffect(() => {
        scrollToBottom()
    }, [subStatements]);

    const {hasChildren = false} = statement;
    console.log("hasChildren - chat",hasChildren)

    return (
        <>
            <div className="page__main">

                <div className="wrapper wrapper--chat">
                    {subStatements?.map((statementSub: Statement) => (
                        <div key={statementSub.statementId} >
                            <StatementChat statement={statementSub} showImage={handleShowTalker} page={page} hasChildren={hasChildren}/>
                        </div>
                    ))
                    }
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="page__footer">
                {statement ? <StatementInput statement={statement} /> : null}
            </div>
        </>
    )
}

export default StatementMain