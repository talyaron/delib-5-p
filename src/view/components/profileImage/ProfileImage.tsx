import { FC } from "react";
import { User } from "delib-npm";
import "./ProfileImage.scss";

interface Props {
    user: User | null;
}
const ProfileImage: FC<Props> = ({ user }) => {
    if (!user) return null;

    // const photoURL = user.photoURL ? user.photoURL : anonymous;

    return (
        <>
            <div className="profile-image">
                <div className="profile-image-box">
                    {/* <div
                        className="image"
                        style={{ backgroundImage: `url(${photoURL})` }}
                    ></div> */}
                    <h3>{user.displayName}</h3>
                </div>
            </div>
        </>
    );
};

export default ProfileImage;
