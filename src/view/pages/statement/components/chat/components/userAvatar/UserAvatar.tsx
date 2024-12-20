import { User } from "delib-npm";
import { FC, useContext } from "react";

// Third Party Imports

// Helpers
import {
	generateRandomLightColor,
	getInitials,
} from "@/controllers/general/helpers";
import "./UserAvatar.scss";
import { StatementContext } from "@/view/pages/statement/StatementCont";

interface UserAvatarProps {
    user: User;
}

const UserAvatar: FC<UserAvatarProps> = ({ user }) => {
	const { photoURL, displayName, uid } = user;
	const {handleShowTalker} = useContext(StatementContext);

	const initials = getInitials(displayName);
	const color = generateRandomLightColor(uid);

	return (
		<button
			className="user-avatar"
			onClick={() => handleShowTalker(user)}
			style={
				photoURL
					? { backgroundImage: `url(${photoURL})` }
					: { backgroundColor: color }
			}
		>
			{!photoURL && <span>{initials}</span>}
		</button>
	);
};

export default UserAvatar;
