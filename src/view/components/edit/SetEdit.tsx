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
				<span
					className="clickable"
					onClick={() => setEdit(!edit)}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setEdit(!edit);
						}
					}}
				>
					{text}
				</span>
			)}
			<div>
				{isAuthorized && (
					<button className="clickable" onClick={() => setEdit(!edit)} aria-label="Edit">
						<EditIcon style={{ color: "#226CBC" }} />
					</button>
				)}
			</div>
		</>
	);
};

export default SetEdit;
