import { useEffect, useState } from 'react';
import { googleLogin } from '../../../functions/db/auth'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../functions/hooks/reduxHooks';
import { userSelector } from '../../../model/users/userSlice';
import { getIntialLocationSessionStorage } from '../../../functions/general/helpers';

//img
import Logo from '../../../assets/logo/logo-128px.png';
import EnterName from './EnterName';

const Start = () => {
    const navigate = useNavigate();
    const user = useAppSelector(userSelector)
    const [showNameModul, setShowNameModul] = useState(false);
 
    useEffect(() => {
        if (user){
            navigate(getIntialLocationSessionStorage()|| '/home');
          
        }else{
            console.info('not logged')
        }
    }, [user])
    
    
    return (
        <div
            className='page splashPage'
        >
            <div className='centerElement'>
                <div id='login__splashName' >
                   <h1>Delib 5</h1> 
                   <img src={Logo} alt="Delib logo"/>
                </div>
                <div id='login__splashSubName' className='opacity07'>
                    <h2>יוצרים הסכמות</h2>
                </div>
                
                {/* <h1 className='login__callForAction'>call for action</h1>
                <div className='anonymousLogin'>
                    <input type='text' className='inputLogin' placeholder='כינוי' />
                    <div className="buttons loginButton" >
                        <div>התחברות עם משתמש זמני</div>
                    </div>
                </div>
                <p> -- או -- </p> */}
                <div className="btns">
                <div className="buttons loginButton" onClick={googleLogin}>
                    <div>התחברות עם גוגל</div>
                </div>
                <div className="btn loginButton" onClick={()=>setShowNameModul(true)}>
                    התחברות עם שם זמני
                </div>
                </div>
                <br />
                <a href="http://delib.org" style={{color:'white', marginTop:'30px', textDecoration:"none"}}><h2>מבית המכון לדמוקרטיה דיונית</h2></a>
            </div>
            {showNameModul?<EnterName setShowNameModul={setShowNameModul}/>:null}
        </div >
    )
}

export default Start