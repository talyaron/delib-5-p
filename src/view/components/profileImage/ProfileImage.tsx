import { FC } from 'react'
import { User } from 'delib-npm';
import anonymous from '../../../assets/anonymous1.png'

interface Props {
    user: User | null
}
const ProfileImage: FC<Props> = ({ user }) => {
    if (!user) return null;
    const photoURL = user.photoURL ? user.photoURL : anonymous;

    return (
        <>
         
        <div className='profileImage'>
            <div className="profileImage__box">
                <div className="profileImage__img" style={{ backgroundImage: `url(${photoURL})` }}></div>
                <h3>{user.displayName}</h3>
            </div>
        </div>
        </>
    )
}

export default ProfileImage