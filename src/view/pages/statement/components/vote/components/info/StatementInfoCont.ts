import { Statement } from "delib-npm";
import { updateStatementText } from "@/controllers/db/statements/setStatements";

export function handleSubmitInfo(
	e: React.FormEvent<HTMLFormElement>,
	formData: {
        title: string;
        description: string;
    },
	statement: Statement,
	setEdit: React.Dispatch<React.SetStateAction<boolean>>,
	setShowInfo: React.Dispatch<React.SetStateAction<boolean>>,
) {
	e.preventDefault();
	try {
		//get data from form
		const title = formData.title;
		const description = formData.description;

		//add title and description
		

		//update statement to DB
		if (!statement) throw new Error("No statement");
		updateStatementText(statement, title, description);
		setEdit(false);
		setShowInfo(false);
	} catch (error) {
		console.error(error);
	}
}
