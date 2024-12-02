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
import { useLocation } from "react-router-dom";
import Description from "../evaluations/components/description/Description";

interface Props {
  statement: Statement;
  subStatements: Statement[];
  handleShowTalker: (statement: User | null) => void;
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
	const location = useLocation();

	const [newMessages, setNewMessages] = useState<number>(0);

	const { toSlide, slideInOrOut } = useSlideAndSubStatement(statement.parentId);

	function scrollToHash() {
		if (location.hash) {
			const element = document.querySelector(location.hash);

			if (element) {
				element.scrollIntoView();
				firstTime = false;

				return;
			}
		}
	}

	//scroll to bottom
	const scrollToBottom = () => {
		if (!messagesEndRef) return;
		if (!messagesEndRef.current) return;
		if (location.hash) return;
		if (firstTime) {
			//@ts-ignore
			messagesEndRef.current.scrollIntoView({ behavior: "auto" });
			firstTime = false;
		} else {
			//@ts-ignore
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		firstTime = true;
	}, []);

	//effects
	useEffect(() => {

		if (!firstTime) return;

		if (location.hash) {
			scrollToHash();
		} else {
			scrollToBottom();
		}
		firstTime = false;
	}, [subStatements]);

	useEffect(() => {
		//if new sub-statement was not created by the user, then set newMessages to the number of new subStatements
		const lastMessage = subStatements[subStatements.length - 1];
		if (lastMessage?.creatorId !== user?.uid) {
			const isNewMessages =
		subStatements.length - numberOfSubStatements > 0;
			numberOfSubStatements = subStatements.length;
			if (isNewMessages) {
				setNewMessages((n) => n + 1);
			}
		} else {
		
			scrollToBottom();
	 
		}
	}, [subStatements.length]);

	return (
		<>
			<div
				className={`page__main statement-chat ${toSlide && slideInOrOut}`}
				id={`msg-${statement.statementId}`}
			>
				<div className="statement-chat__description">
					<Description statement={statement} />
				</div>
				{subStatements?.map((statementSub: Statement, index) => (
					<div key={statementSub.statementId}>
						<ChatMessageCard
							parentStatement={statement}
							statement={statementSub}
							showImage={handleShowTalker}
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
				{statement && <StatementInput statement={statement} />}
			</div>
		</>
	);
};

export default StatementChat;
