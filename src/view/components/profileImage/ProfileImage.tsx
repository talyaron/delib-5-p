import { FC, useContext } from "react";
import "./ProfileImage.scss";
import { StatementContext } from "@/view/pages/statement/StatementCont";

const ProfileImage: FC = () => {
	const {talker} = useContext(StatementContext);

	if (!talker) return null;

	// const photoURL = user.photoURL ? user.photoURL : anonymous;

	return (
		<>
			<div className="profile-image">
				<div className="profile-image-box">
					{talker.photoURL && <div
						className="image"
						style={{ backgroundImage: `url(${talker.photoURL})` }}
					></div>}
					<h3>{talker.displayName}</h3>
				</div>
			</div>
		</>
	);
};

export default ProfileImage;
