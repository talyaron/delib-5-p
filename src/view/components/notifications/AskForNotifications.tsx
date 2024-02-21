import { useLanguage } from "../../../functions/hooks/useLanguages";

const AskForNotifications = () => {
    const { languageData } = useLanguage();

    return (
        <div className="popup">
            <div className="popup__box">
                <h1>
                    {
                        languageData[
                            "Would you like to receive notifications in this group?"
                        ]
                    }
                </h1>
                <div className="btnBox">
                    <button className="btn btn--default">
                        {languageData["Yes"]}
                    </button>
                    <button className="btn btn--secondry">
                        {languageData["No"]}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AskForNotifications;
