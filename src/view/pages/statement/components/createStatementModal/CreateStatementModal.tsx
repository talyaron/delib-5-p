import { FC, useState } from "react";

// Third party imports
import { Statement, StatementType, isAllowedStatementType } from "delib-npm";

// Statements Helpers

// Custom Components
import Loader from "../../../../components/loaders/Loader";

// Images
import newQuestionGraphic from "../../../../../assets/images/newQuestionGraphic.png";
import newOptionGraphic from "../../../../../assets/images/newOptionGraphic.png";
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";
import { createStatementFromModal } from "../settings/statementSettingsCont";
import Modal from "../../../../components/modal/Modal";
import "./CreateStatementModal.scss";

interface CreateStatementModalProps {
    parentStatement: Statement | "top";
    isOption: boolean;
    setShowModal: (bool: boolean) => void;
    getSubStatements?: () => Promise<void>;
    toggleAskNotifications?: () => void;
	isSendToStoreTemp?: boolean; // This is used for setting the input from the user to the store and from there to the UI as a new statement
}

const CreateStatementModal: FC<CreateStatementModalProps> = ({
	parentStatement,
	isOption,
	setShowModal,
	getSubStatements,
	toggleAskNotifications,
	isSendToStoreTemp
}) => {
	const [isOptionSelected, setIsOptionSelected] = useState(isOption);
	const [isLoading, setIsLoading] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const { t } = useLanguage();

	const onFormSubmit = async () => {
		setIsLoading(true);
		await createStatementFromModal({
			title,
			description,
			isOptionSelected,
			toggleAskNotifications,
			parentStatement,
			isSendToStoreTemp
		});
		setShowModal(false);
		setIsLoading(false);

		await getSubStatements?.();
	};

	return (
		<Modal className="create-statement-modal">
			{isLoading ? (
				<div className="center">
					<h2>{t("Updating")}</h2>
					<Loader />
				</div>
			) : (
				<form className="overlay" onSubmit={onFormSubmit}>
					<div className="modal-image">
						<img
							src={
								isOptionSelected
									? newOptionGraphic
									: newQuestionGraphic
							}
							alt="New Statement"
						/>
					</div>

					<Tabs
						isOptionChosen={isOptionSelected}
						setIsOptionChosen={setIsOptionSelected}
						parentStatement={parentStatement}
					/>

					<div className="form-inputs">
						<input
							data-cy="statement-title-simple"
							autoComplete="off"
							autoFocus={true}
							type="text"
							placeholder={t("Title")}
							required
							minLength={3}
							value={title}
							onChange={(ev) => setTitle(ev.target.value)}
						/>
						<textarea
							name="description"
							placeholder={t("Description")}
							rows={4}
							value={description}
							onChange={(ev) => setDescription(ev.target.value)}
						></textarea>
					</div>

					<CreateStatementButtons
						isOption={isOptionSelected}
						onCancel={() => setShowModal(false)}
					/>
				</form>
			)}
		</Modal>
	);
};

export default CreateStatementModal;

interface TabsProps {
    isOptionChosen: boolean;
    setIsOptionChosen: (isOptionChosen: boolean) => void;
    parentStatement: Statement | "top";
}

const Tabs: FC<TabsProps> = ({
	isOptionChosen,
	setIsOptionChosen,
	parentStatement,
}) => {
	const { t } = useLanguage();

	return (
		<div className="tabs">
			{isAllowedStatementType({
				parentStatement,
				statementType: StatementType.option,
			}) && (
				<button
					onClick={() => setIsOptionChosen(true)}
					className={`tab option ${isOptionChosen ? "active" : ""}`}
				>
					{t("Option")}

					{isOptionChosen && <div className="block" />}
				</button>
			)}
			{isAllowedStatementType({
				parentStatement,
				statementType: StatementType.question,
			}) && (
				<button
					onClick={() => setIsOptionChosen(false)}
					className={`tab question ${isOptionChosen ? "" : "active"}`}
				>
					{t("Question")}
					{!isOptionChosen && <div className="block" />}
				</button>
			)}
		</div>
	);
};

interface CreateStatementButtonsProps {
    isOption: boolean;
    onCancel: VoidFunction;
}

const CreateStatementButtons: FC<CreateStatementButtonsProps> = ({
	isOption,
	onCancel,
}) => {
	const { t } = useLanguage();

	return (
		<div className="create-statement-buttons">
			<button onClick={onCancel} type="button" className="cancel-button">
				{t("Cancel")}
			</button>
			<button
				className={`add-button ${isOption ? "option" : "question"}`}
				type="submit"
				data-cy="add-statement-simple"
			>
				{t(`Add ${isOption ? "Option" : "Question"}`)}
			</button>
		</div>
	);
};
