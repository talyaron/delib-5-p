import { Statement } from 'delib-npm';
import { FC } from 'react';

interface Props {
    statement: Statement;
    showImage: Function;
}

const ProfileImage:FC<Props>= ({statement, showImage}) => {
    const userProfile = statement.creator.photoURL;


    //from statement.creator.displayName get only first three letters
    const displayName = statement.creator.displayName.slice(0,6);
    
    


    return (
        <>
         <div onClick={() => showImage(statement.creator)} className="statement__chatCard__profile" style={userProfile ?{ backgroundImage: `url(${userProfile})`} :{backgroundColor:"#dab7fa"}}>
            {userProfile?null:<span>{displayName}</span>}
         </div>
        </>
    )
}

export default ProfileImage