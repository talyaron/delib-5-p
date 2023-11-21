import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { listenToAuth } from '../../../functions/db/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../model/users/userSlice';
import { User } from '../../../model/users/userModel';
import Accessiblity from '../../components/accessibility/Accessiblity';
import { Unsubscribe } from 'firebase/auth';
import { setFontSize } from '../../../model/users/userSlice';


const All = () => {
   const navigate = useNavigate();
    const dispatch = useDispatch();
    function updateUserToStore(user: User | null) {
        dispatch(setUser(user))
    };

    function updateFonSize(fontSize: number) {
        dispatch(setFontSize(fontSize)) 
    }

    function navigateToInitialLocationCB(pathname: string) {
        navigate(pathname)
    }

    useEffect(() => {
        const usub:Unsubscribe = listenToAuth(updateUserToStore,updateFonSize,navigateToInitialLocationCB);
     
      
        return () => {
            usub();
        }
    }, []);

    return (
        <>
            <Accessiblity />
            <Outlet />
        </>
    )
}

export default All