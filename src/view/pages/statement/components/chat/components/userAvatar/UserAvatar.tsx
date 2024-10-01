import { FC } from "react";

// Third Party Imports
import { User } from "delib-npm";

// Helpers
import {
	generateRandomLightColor,
	getInitials,
} from "@/controllers/general/helpers";
import "./UserAvatar.scss";

interface UserAvatarProps {
    user: User;
    showImage: (user: User) => void;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, showImage }) => {
	const { photoURL, displayName, uid } = user;

	const initials = getInitials(displayName);
	const color = generateRandomLightColor(uid);

	return (
		<button
			className="user-avatar"
			onClick={() => showImage(user)}
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
