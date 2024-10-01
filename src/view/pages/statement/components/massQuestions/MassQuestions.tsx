import { Statement, StatementType } from "delib-npm";
import { FC, useState } from "react";
import MassQuestionCard from "./components/massQuestion/MassQuestionCard";
import styles from "./MassQuestions.module.scss";
import { isAuthorized } from "@/controllers/general/helpers";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { statementSubscriptionSelector } from "@/model/statements/statementsSlice";
import Text from "@/view/components/text/Text";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";

interface Props {
  statement: Statement;
  subStatements: Statement[];
}

const MassQuestions: FC<Props> = ({ statement, subStatements }) => {
	const statementSubscriptions = useAppSelector(
		statementSubscriptionSelector(statement.statementId)
	);

	const [showThankYou, setShowThankYou] = useState<boolean>(false);
	const [answerd, setAnswer] = useState<boolean[]>([]);
	const [showModal, setShowModal] = useState(false);

	const questions = subStatements.filter(
		(sub) => sub.statementType === StatementType.question
	);

	const _isAutorized = isAuthorized(statement, statementSubscriptions);

	return (
		<>
			<div className="page__main">
				<div className="wrapper">
					{!showThankYou ? (
						<>
							{statement.imagesURL?.main ? (
								<div
									className={styles.image}
									style={{
										backgroundImage: `url(${statement.imagesURL.main})`,
									}}

									// style={{backgroundColor: 'red'}}
								></div>
							) : null}
							<Text description={statement.description} />
							{questions.map((question, index: number) => (
								<MassQuestionCard
									key={question.statementId}
									statement={question}
									index={index}
									setAnswered={setAnswer}
								/>
							))}
							<div className="btns">
								{answerd.filter((a) => a).length === questions.length && (
									<button className="btn" onClick={() => setShowThankYou(true)}>
										<span>שליחה</span>
									</button>
								)}
							</div>
						</>
					) : (
						<div className={styles.thankyou}>
							<h2>תודה על התשובות</h2>
							<button className="btn" onClick={() => setShowThankYou(false)}>
								<span>עריכה חדשה</span>
							</button>
						</div>
					)}
				</div>
			</div>
			{!showThankYou && _isAutorized ? (
				<div className="page__main__bottom">
					{showModal && (
						<CreateStatementModal
							parentStatement={statement}
							isOption={false}
							setShowModal={setShowModal}
						/>
					)}
				</div>
			) : null}
		</>
	);
};

export default MassQuestions;
