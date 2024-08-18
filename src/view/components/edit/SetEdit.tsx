import React, { FC } from "react";
import EditIcon from "@/assets/icons/editIcon.svg?react";

interface Props {
    isAuthorized: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    edit: boolean;
    text?: string;
}

const SetEdit: FC<Props> = ({ isAuthorized, setEdit, edit, text }) => {
	if (!isAuthorized) return null;

	return (
		<>
			{text && (
				<span className="clickable" onClick={() => setEdit(!edit)}>
					{text}
				</span>
			)}
			<div>
				{isAuthorized && (
					<div className="clickable" onClick={() => setEdit(!edit)}>
						<EditIcon style={{ color: "#226CBC" }} />
					</div>
				)}
			</div>
		</>
	);
};

export default SetEdit;
