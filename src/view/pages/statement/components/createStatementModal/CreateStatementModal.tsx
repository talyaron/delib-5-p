import { FC, useState } from "react";

// Third party imports
import { Statement, StatementType } from "delib-npm";

// Statements Helpers

// Images
import newQuestionGraphic from "@/assets/images/newQuestionGraphic.png";
import newOptionGraphic from "@/assets/images/newOptionGraphic.png";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { createStatementFromModal } from "../settings/statementSettingsCont";
import Modal from "@/view/components/modal/Modal";
import "./CreateStatementModal.scss";
import Button, { ButtonType } from "@/view/components/buttons/button/Button";

interface CreateStatementModalProps {
  parentStatement: Statement | "top";
  isOption: boolean;
  singleSelection?: boolean;
  setShowModal: (bool: boolean) => void;
  getSubStatements?: () => Promise<void>;
  toggleAskNotifications?: () => void;
  isSendToStoreTemp?: boolean; // This is used for setting the input from the user to the store and from there to the UI as a new statement
  allowedTypes?: StatementType[];
}

const CreateStatementModal: FC<CreateStatementModalProps> = ({
	parentStatement,
	isOption,
	setShowModal,
	getSubStatements,
	isSendToStoreTemp,
	allowedTypes,
}) => {
	const [isOptionSelected, setIsOptionSelected] = useState(isOption);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const { t } = useLanguage();

	const onFormSubmit = async () => {
		setShowModal(false);

		await createStatementFromModal({
			title,
			description,
			isOptionSelected,
			parentStatement,
			isSendToStoreTemp,
		});

		await getSubStatements?.();
	};

	return (
		<Modal className="create-statement-modal">
			<form className="overlay" onSubmit={onFormSubmit}>
				<div className="modal-image">
					<img
						src={isOptionSelected ? newOptionGraphic : newQuestionGraphic}
						alt="New Statement"
					/>
				</div>

				<Tabs
					isOptionChosen={isOptionSelected}
					setIsOptionChosen={setIsOptionSelected}
					parentStatement={parentStatement}
					allowedTypes={allowedTypes}
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
		</Modal>
	);
};

export default CreateStatementModal;

interface TabsProps {
  allowedTypes?: StatementType[];
  isOptionChosen: boolean;
  setIsOptionChosen: (isOptionChosen: boolean) => void;
  parentStatement: Statement | "top";
}

const Tabs: FC<TabsProps> = ({
	allowedTypes,
	isOptionChosen,
	setIsOptionChosen,
}) => {
	const { t } = useLanguage();

	return (
		<div className="tabs">
			{allowedTypes?.includes(StatementType.option) && (
				<button
					onClick={() => setIsOptionChosen(true)}
					className={`tab option ${isOptionChosen ? "active" : ""}`}
				>
					{t("Option")}

					{isOptionChosen && <div className="block" />}
				</button>
			)}
			{allowedTypes?.includes(StatementType.question) && (
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
			<Button
				text={t("Cancel")}
				onClick={onCancel}
				buttonType={ButtonType.SECONDARY}
				className="cancel-button"
			/>
			<Button
				text={t(`Add ${isOption ? "Option" : "Question"}`)}
				buttonType={ButtonType.PRIMARY}
				data-cy="add-statement-simple"
			/>
		</div>
	);
};
