import { useLanguage } from "../../../functions/hooks/useLanguages";
import Modal from "../modal/Modal";

interface Props {
    handleAgreement: (agree: boolean, agreement: string) => void;
    agreement: string;
}

export default function TermsOfUse({ handleAgreement, agreement }: Props) {
    const { languageData } = useLanguage();

    return (
        <Modal>
            <div className="termsOfUse" data-cy="termsOfUse">
                <h1 className="termsOfUse__title">
                    {languageData["terms of use"]}
                </h1>
                <p>{languageData[agreement]}</p>
                <div className="btns">
                    <button
                        className="btn btn--agree"
                        onClick={() =>
                            handleAgreement(true, languageData[agreement])
                        }
                    >
                        {languageData["Agree"]}
                    </button>
                    <button
                        data-cy="agree-btn"
                        className="btn btn--disagree"
                        onClick={() =>
                            handleAgreement(false, languageData[agreement])
                        }
                    >
                        {languageData["Dont agree"]}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
