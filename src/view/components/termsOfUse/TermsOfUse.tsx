import { t } from "i18next";
import Modal from "../modal/Modal";

interface Props {
    handleAgreement: (agree: boolean, agreement: string) => void;
    agreement: string;
}

export default function TermsOfUse({ handleAgreement, agreement }: Props) {
    return (
        <Modal>
            <div className="termsOfUse" data-cy="termsOfUse">
                <h1 className="termsOfUse__title">{t("terms of use")}</h1>
                <p>{t(agreement)}</p>
                <div className="btns">
                    <button
                    data-cy="agree-btn"
                        className="btn btn--agree"
                        onClick={() => handleAgreement(true, t(agreement))}
                    >
                        {t("Agree")}
                    </button>
                    <button
                        className="btn btn--disagree"
                        onClick={() => handleAgreement(false, t(agreement))}
                    >
                        {t("Dont agree")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
