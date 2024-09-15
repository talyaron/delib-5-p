import { FC, useState } from "react";

// Styles
import styles from "./enterNameModal.module.scss";

// Custom components
import Modal from "../modal/Modal";

// Functions
import { signAnonymously } from "@/controllers/db/auth";
import { useLanguage } from "@/controllers/hooks/useLanguages";
import Button, { ButtonType } from "../buttons/button/Button";

interface Props {
  closeModal: VoidFunction;
}

const EnterNameModal: FC<Props> = ({ closeModal }) => {
	const [displayName, setDisplayName] = useState<string | null>(null);
	const [showStartBtn, setShowStartBtn] = useState<boolean>(false);
	
	const { t } = useLanguage();

	function handleSetName(ev: React.ChangeEvent<HTMLInputElement>) {
		setDisplayName(ev.target.value);
		if (isReadyToStart(ev.target.value)) setShowStartBtn(true);
		else setShowStartBtn(false);
	}

	function handleStart() {
		try {
			if (isReadyToStart(displayName)) {
				signAnonymously();
				const _displayName = displayName || "Anonymous";
				sessionStorage.setItem("displayName", _displayName);
				closeModal();
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Modal>
			<div className={styles.box} data-cy="anonymous-input">
				<input
					className={styles.input}
					onChange={handleSetName}
					type="text"
					name="displayName"
					placeholder={t("Nickname")}
					autoFocus={true}
					autoComplete="off"
				/>
				<div className="btns">
					{<Button
						buttonType={ButtonType.PRIMARY}
						data-cy="anonymous-start-btn"
						text={t("Start")}
						onClick={handleStart}
						disabled={!showStartBtn}
					/>}
					<Button
						buttonType={ButtonType.SECONDARY}
						data-cy="anonymous-cancel-btn"
						text={t("Cancel")}
						onClick={closeModal}

						// className="btn"
					/>
				</div>
			</div>
		</Modal>
	);
};

export default EnterNameModal;

function isReadyToStart(displayName: string | null) {
	if (displayName === null) return false;
	if (displayName.length > 2) return true;
	else return false;
}
