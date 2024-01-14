import { FC, useEffect, useRef } from "react";

// Third Party Imports
import { Statement, User } from "delib-npm";

// Custom Components
import StatementChat from "./chat/StatementChatCard";
import StatementInput from "./StatementInput";
import ScreenSlide from "../../../components/animation/ScreenSlide";
import useSlideAndSubStatement from "../../../../functions/hooks/useSlideAndSubStatement";

interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: (statement: User | null) => void;
}

let firstTime = true;

const StatementMain: FC<Props> = ({
    statement,
    subStatements,
    handleShowTalker,
}) => {
    const messagesEndRef = useRef(null);

    const { toSlide, slideInOrOut } = useSlideAndSubStatement(
        statement.parentId,
    );

    //scroll to bottom
    const scrollToBottom = () => {
        if (!messagesEndRef) return;
        if (!messagesEndRef.current) return;
        if (firstTime) {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
            firstTime = false;
        } else {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    //effects
    useEffect(() => {
        firstTime = true;
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [subStatements]);

    return (
        <>
            <ScreenSlide className={`page__main ${toSlide && slideInOrOut}`}>
                {subStatements?.map((statementSub: Statement, index) => (
                    <div key={statementSub.statementId}>
                        <StatementChat
                            parentStatement={statement}
                            statement={statementSub}
                            showImage={handleShowTalker}
                            index={index}
                            previousStatement={subStatements[index - 1]}
                        />
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ScreenSlide>
            <div className="page__footer">
                {statement && <StatementInput statement={statement} />}
            </div>
        </>
    );
};

export default StatementMain;
