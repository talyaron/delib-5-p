import { FC, useState } from "react";

// Third Party Imports
import { Statement, StatementType } from "delib-npm";

// Icons
import SendIcon from "@/view/components/icons/SendIcon";

// Redux Store
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { userSelector } from "@/model/users/userSlice";
import useDirection from "@/controllers/hooks/useDirection";
import { handleAddStatement } from "./StatementInputCont";
import useStatementColor from "@/controllers/hooks/useStatementColor";

interface Props {
    statement: Statement;
}

const StatementInput: FC<Props> = ({ statement }) => {
	if (!statement) throw new Error("No statement");

	// Redux hooks
	const user = useAppSelector(userSelector);

	const statementColor = useStatementColor(statement.statementType || StatementType.statement);

	const direction = useDirection();
	const [message, setMessage] = useState("");

	function handleKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		try {
			const _isMobile =
                !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                	navigator.userAgent,
                );

			if (e.key === "Enter" && !e.shiftKey && !_isMobile) {
				handleSubmitInput(e);
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleSubmitInput = (
		e:
            | React.FormEvent<HTMLFormElement>
            | React.KeyboardEvent<HTMLTextAreaElement>,
	) => {
		e.preventDefault();

		// Create statement
		handleAddStatement(message, statement, user);

		setMessage(""); // Clear input
	};

	return (
		<form
			onSubmit={(e) => handleSubmitInput(e)}
			name="theForm"
			className="page__footer__form"
			style={{ flexDirection: direction }}
		>
			<button
				type="submit"
				className="page__footer__form__sendBtnBox"
				aria-label="Submit Button"
				style={statementColor}
				data-cy="statement-chat-send-btn"
			>
				<SendIcon color={statementColor.color} />
			</button>
			<textarea
				data-cy="statement-chat-input"
				style={{ height: "4rem" }}
				className="page__footer__form__input"
				aria-label="Form Input"
				name="newStatement"
				onKeyUp={(e) => handleKeyUp(e)}
				autoFocus={false}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				required
			/>
		</form>
	);
};

export default StatementInput;
