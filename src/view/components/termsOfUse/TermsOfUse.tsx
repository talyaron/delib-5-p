import { useLanguage } from "../../../controllers/hooks/useLanguages";
import Modal from "../modal/Modal";
import "./TermsOfUse.scss";

interface Props {
    handleAgreement: (agree: boolean, agreement: string) => void;
    agreement: string;
}

export default function TermsOfUse({ handleAgreement, agreement }: Props) {
    const { t } = useLanguage();

    return (
        <Modal>
            <div className="terms-of-use" data-cy="termsOfUse">
                <h1 className="terms-of-use-title">{t("terms of use")}</h1>
                <p>{agreement}</p>
                <div className="btns">
                    <button
                        className="btn btn--agree"
                        onClick={() => handleAgreement(true, agreement)}
                    >
                        {t("Agree")}
                    </button>
                    <button
                        data-cy="agree-btn"
                        className="btn btn--disagree"
                        onClick={() => handleAgreement(false, agreement)}
                    >
                        {t("Dont agree")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
