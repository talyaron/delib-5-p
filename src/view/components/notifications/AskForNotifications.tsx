import { useLanguage } from "../../../controllers/hooks/useLanguages";

const AskForNotifications = () => {
    const { t } = useLanguage();

    return (
        <div className="popup">
            <div className="popup__box">
                <h1>
                    {t(
                        "Would you like to receive notifications in this group?",
                    )}
                </h1>
                <div className="btnBox">
                    <button className="btn btn--default">{t("Yes")}</button>
                    <button className="btn btn--secondry">{t("No")}</button>
                </div>
            </div>
        </div>
    );
};

export default AskForNotifications;
