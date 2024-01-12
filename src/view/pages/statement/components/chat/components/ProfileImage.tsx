import { FC } from "react";

// Third Party Imports
import { User, Statement } from "delib-npm";

// Helpers
import {
    generateRandomLightColor,
    getInitials,
} from "../../../../../../functions/general/helpers";

interface Props {
    statement: Statement;
    showImage: (statement: User | null) => void;
}

const ProfileImage: FC<Props> = ({ statement, showImage }) => {
    const userProfile = statement.creator.photoURL;

    const displayName = getInitials(statement.creator.displayName);

    const color = generateRandomLightColor(statement.creator.uid);

    return (
        <div
            onClick={() => showImage(statement.creator)}
            className="message__user__avatar"
            style={
                userProfile
                    ? { backgroundImage: `url(${userProfile})` }
                    : { backgroundColor: color }
            }
        >
            {!userProfile && <span>{displayName}</span>}
        </div>
    );
};

export default ProfileImage;
