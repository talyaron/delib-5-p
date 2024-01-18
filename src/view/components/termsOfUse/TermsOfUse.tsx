import Modal from "../modal/Modal";

interface Props {
    handleAgreement: (agree: boolean, agreement: string) => void;
    agreement: string;
}

export default function TermsOfUse({ handleAgreement, agreement }: Props) {
    return (
        <Modal>
            <div className="termsOfUse">
                <h1 className="termsOfUse__title">{"terms of use"}</h1>
                <p>{agreement}</p>
                <div className="btns">
                    <button
                        className="btn btn--agree"
                        onClick={() => handleAgreement(true, agreement)}
                    >
                        {"Agree"}
                    </button>
                    <button
                        className="btn btn--disagree"
                        onClick={() => handleAgreement(false, agreement)}
                    >
                        {"Dont agree"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
