import React from "react";
import Modal from "../../../../../components/modal/Modal";

// Images
import moveStatementIllustration from "../../../../../../assets/images/moveStatementIllustration.png";

export default function MoveStatementModal({
    handleMoveStatement,
}: Readonly<{
    handleMoveStatement: (move: boolean) => void;
}>) {
    return (
        <Modal className="create-statement-modal">
            <div
                className="overlay"
                style={{ height: "fit-content", gap: "2rem" }}
            >
                <div className="modal-image">
                    <img src={moveStatementIllustration} alt="New Statement" />
                </div>
                <h1 className="modalText">
                    Are you sure you want to move statement here?
                </h1>

                <div className="create-statement-buttons">
                    <button
                        onClick={() => handleMoveStatement(false)}
                        className="cancel-button"
                    >
                        Not yet
                    </button>
                    <button
                        onClick={() => handleMoveStatement(true)}
                        className={"add-button question"}
                    >
                        Yes, I do
                    </button>
                </div>
            </div>
        </Modal>
    );
}
