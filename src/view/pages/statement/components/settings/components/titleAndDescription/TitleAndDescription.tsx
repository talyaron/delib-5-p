import { FC } from "react";

// Hooks & Helpers
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";
import { WithStatement } from "../../settingsTypeHelpers";
import "./TitleAndDescription.scss";

const TitleAndDescription: FC<WithStatement> = ({ statement }) => {
    const { t } = useLanguage();

    // * Variables * //
    const arrayOfStatementParagraphs = statement?.statement.split("\n") || [];
    const title = arrayOfStatementParagraphs[0];

    // Get all elements of the array except the first one
    const description = arrayOfStatementParagraphs.slice(1).join("\n");

    return (
        <div className="title-and-description">
            <label htmlFor="statement">
                <input
                    data-cy="statement-title"
                    autoFocus={true}
                    type="text"
                    name="statement"
                    placeholder={t("Group Title")}
                    defaultValue={title}
                    required={true}
                />
            </label>
            <label htmlFor="description">
                <textarea
                    name="description"
                    placeholder={t("Group Description")}
                    rows={3}
                    defaultValue={description}
                />
            </label>
        </div>
    );
};

export default TitleAndDescription;
