import { User } from "delib-npm";
import { FC } from "react";
import SmileIcon from "../../../assets/icons/smileIcon.svg?react";
import "./Chip.scss";

// import anonymous from "../../../assets/anonymous1.png";

interface UserChipProps {
    user: User;
}
const UserChip: FC<UserChipProps> = ({ user }) => {
    const displayName = user.displayName.slice(0, 15);

    return (
        <div className="chip">
            <div className="chip-image">
                {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} />
                ) : (
                    <SmileIcon style={{ opacity: 0.4 }} />
                )}
            </div>
            <span>{displayName}</span>
        </div>
    );
};

export default UserChip;
