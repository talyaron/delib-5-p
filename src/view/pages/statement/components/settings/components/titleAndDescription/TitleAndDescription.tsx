import { FC } from "react";

// Hooks & Helpers
import { useLanguage } from "../../../../../../../controllers/hooks/useLanguages";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import "./TitleAndDescription.scss";

const TitleAndDescription: FC<StatementSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	const { t } = useLanguage();

	// * Variables * //
	const arrayOfStatementParagraphs = statement?.statement.split("\n") || [];
	const title = arrayOfStatementParagraphs[0];

	// Get all elements of the array except the first one
	const description = arrayOfStatementParagraphs.slice(1).join("\n");

	return (
		<div className="title-and-description">
			<label htmlFor="statement-title">
				<input
					id="statement-title"
					data-cy="statement-title"
					autoFocus={true}
					type="text"
					name="statement"
					placeholder={t("Group Title")}
					value={title}
					onChange={(e) => {
						const newTitle = e.target.value;
						setStatementToEdit({
							...statement,
							statement: `${newTitle}\n${description}`,
						});
					}}
					required={true}
				/>
			</label>
			<label htmlFor="statement-description">
				<textarea
					id="statement-description"
					name="description"
					placeholder={t("Group Description")}
					rows={3}
					value={description}
					onChange={(e) => {
						const newDescription = e.target.value;
						setStatementToEdit({
							...statement,
							statement: `${title}\n${newDescription}`,
						});
					}}
				/>
			</label>
		</div>
	);
};

export default TitleAndDescription;
