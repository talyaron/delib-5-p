import { FC, useEffect, useRef, useState } from "react";

// Third Party Imports
import { Statement, User } from "delib-npm";

// Custom Components
import StatementChatCard from "./StatementChatCard";
import StatementInput from "./components/input/StatementInput";
import ScreenSlide from "../../../../components/animation/ScreenSlide";
import useSlideAndSubStatement from "../../../../../functions/hooks/useSlideAndSubStatement";
import EnableNotifications from "../../../../components/enableNotifications/EnableNotifications";

interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: (statement: User | null) => void;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

let firstTime = true;

const StatementChat: FC<Props> = ({
    statement,
    subStatements,
    handleShowTalker,
    setShowAskPermission,
}) => {
    // TODO: Add to user schema if user was asket to recieve notifications
    const [askNotifications, setAskNotifications] = useState(false);
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
            </ScreenSlide>
            <div className="page__footer">
                {statement && (
                    <StatementInput
                        statement={statement}
                        setAskNotifications={setAskNotifications}
                    />
                )}
            </div>
            {askNotifications && (
                <EnableNotifications
                    statement={statement}
                    setAskNotifications={setAskNotifications}
                    setShowAskPermission={setShowAskPermission}
                />
            )}
        </>
    );
};

export default StatementChat;
