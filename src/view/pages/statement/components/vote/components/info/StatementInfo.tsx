import { Statement } from "delib-npm";
import { FC, useState } from "react";
import {
    getDescription,
    getTitle,
    isAuthorized,
} from "../../../../../../../controllers/general/helpers";
import Text from "../../../../../../components/text/Text";
import { handleSubmitInfo } from "./StatementInfoCont";

//image
import infoGraphic from "../../../../../../../assets/images/infoGraphic.png";
import EditIcon from "../../../../../../../assets/icons/editIcon.svg?react";

import { useAppSelector } from "../../../../../../../controllers/hooks/reduxHooks";
import {
    statementSelector,
    statementSubscriptionSelector,
} from "../../../../../../../model/statements/statementsSlice";
import "./StatementInfo.scss";
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";

interface Props {
    statement: Statement | null;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementInfo: FC<Props> = ({ statement, setShowInfo }) => {
    const { t } = useLanguage();
    if (!statement) return null;

    const statementSubscription = useAppSelector(
        statementSubscriptionSelector(statement.statementId),
    );
    const parentStatement = useAppSelector(
        statementSelector(statement.parentId),
    );

    const [isInEditMode, setIsInEditMode] = useState(false);

    const title = getTitle(statement);
    const description = getDescription(statement);
    const _isAuthorized = isAuthorized(
        statement,
        statementSubscription,
        parentStatement?.creatorId,
    );

    return (
        <div className="statement-info">
            <div className="info-graphic">
                <img src={infoGraphic} alt="info" />
            </div>

            {isInEditMode ? (
                <form
                    className="form"
                    onSubmit={(e: any) =>
                        handleSubmitInfo(
                            e,
                            statement,
                            setIsInEditMode,
                            setShowInfo,
                        )
                    }
                >
                    <div className="inputs">
                        <input
                            type="text"
                            defaultValue={title}
                            name="title"
                            required={true}
                        />
                        <textarea
                            defaultValue={description}
                            name="description"
                            placeholder={t("description")}
                        />
                    </div>
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setIsInEditMode(false)}
                        >
                            {t("Cancel")}
                        </button>
                        <button type="submit" className="save-button">
                            {t("Save")}
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="texts">
                        <h3>
                            {title}
                            {_isAuthorized && (
                                <div className="edit-icon">
                                    <EditIcon
                                        onClick={() => setIsInEditMode(true)}
                                    />
                                </div>
                            )}
                        </h3>
                        <div className="text">
                            <Text text={description} />
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button
                            className="close-button"
                            onClick={() => setShowInfo(false)}
                        >
                            {t("Close")}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default StatementInfo;
