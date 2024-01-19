import { FC, useEffect, useRef } from "react";

// Third Party Imports
import { Statement, User } from "delib-npm";

// Custom Components
import StatementChatCard from "./StatementChatCard";
import StatementInput from "./components/input/StatementInput";
import useSlideAndSubStatement from "../../../../../functions/hooks/useSlideAndSubStatement";

interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: (statement: User | null) => void;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
    toggleAskNotifications: () => void;
}

let firstTime = true;

const StatementChat: FC<Props> = ({
    statement,
    subStatements,
    handleShowTalker,
    toggleAskNotifications,
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
            <div
                className={`page__main ${toSlide && slideInOrOut}`}
                style={{ paddingBottom: "5rem" }}
            >
                {subStatements?.map((statementSub: Statement, index) => (
                    <div key={statementSub.statementId}>
                        <StatementChatCard
                            parentStatement={statement}
                            statement={statementSub}
                            showImage={handleShowTalker}
                            index={index}
                            previousStatement={subStatements[index - 1]}
                        />
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="page__footer">
                {statement && (
                    <StatementInput
                        toggleAskNotifications={toggleAskNotifications}
                        statement={statement}
                    />
                )}
            </div>
        </>
    );
};

export default StatementChat;
