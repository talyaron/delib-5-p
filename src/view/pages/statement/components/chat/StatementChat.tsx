import { FC, useEffect, useState, useRef } from "react";

// Third Party Imports
import { Statement, User } from "delib-npm";

// Custom Components
import ChatMessageCard from "./components/chatMessageCard/ChatMessageCard";
import StatementInput from "./components/input/StatementInput";
import useSlideAndSubStatement from "../../../../../controllers/hooks/useSlideAndSubStatement";

import NewMessages from "./components/newMessages/NewMessages";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { userSelector } from "@/model/users/userSlice";
import "./StatementChat.scss";

interface Props {
	statement: Statement;
	subStatements: Statement[];
	handleShowTalker: (statement: User | null) => void;
	setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;

}

let firstTime = true;
let numberOfSubStatements = 0;

const StatementChat: FC<Props> = ({
	statement,
	subStatements,
	handleShowTalker,
	
}) => {
	const user = useAppSelector(userSelector);
	const messagesEndRef = useRef(null);

	const [newMessages, setNewMessages] = useState<number>(0);

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
		scrollToBottom();
	}, []);

	useEffect(() => {
		//if new substament was not created by the user, then set newMessages to the number of new subStatements
		const lastMessage = subStatements[subStatements.length - 1];
		if (lastMessage?.creatorId !== user?.uid) {
			const isNewMessages =
				subStatements.length - numberOfSubStatements > 0 ? true : false;
			numberOfSubStatements = subStatements.length;
			if (isNewMessages) {
				setNewMessages((nmbr) => nmbr + 1);
			}
		} else {
			scrollToBottom();
		}
	}, [subStatements]);


	return (
		<>
			<div
				className={`page__main statement-chat ${toSlide && slideInOrOut}`}
			>
				{subStatements?.map((statementSub: Statement, index) => (
					<div key={statementSub.statementId}>
						<ChatMessageCard
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
				<NewMessages
					newMessages={newMessages}
					setNewMessages={setNewMessages}
					scrollToBottom={scrollToBottom}
				/>
				{statement && (
					<StatementInput
						statement={statement}
					/>
				)}
			</div>
		</>
	)

};

export default StatementChat;
