import { useRef, FC } from "react";
import { Statement } from "delib-npm";

//Custom components
import Button from "../../../view/components/buttons/button/Button";
import UploadFileIcon from "../../../view/components/icons/UploadFileIcon";

// import { SetWaitingListCont } from "./SetWaitingListCont";

//Styles
import styles from "./setWaitingList.module.scss"
import VisuallyHidden from "@/view/components/accessibility/toScreenReaders/VisuallyHidden";

	interface Props {
		statement: Statement
	}

const SetWaitingList: FC<Props> = ({  }) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			// SetWaitingListCont(files[0], statement);
		}
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		fileInputRef.current?.click();
	};

	return (
		<div>
			<label htmlFor="uploadFile">
				<VisuallyHidden labelName={"uploadFile"} />
			</label>
			<input
				id="uploadFile"
				className={styles.uploadInput}
				type="file"
				accept=".xlsx, .xls"
				onChange={handleFileChange}
				ref={fileInputRef}
			/>
			<Button
				icon={<UploadFileIcon />}
				text={"Upload members list"}
				onClick={handleButtonClick}
				className={"btn btn--affirmation"}
			/>
		</div>
	);
};

export default SetWaitingList;
