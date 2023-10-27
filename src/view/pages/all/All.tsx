import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { listenToAuth } from '../../../functions/db/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../model/users/userSlice';
import { User } from '../../../model/users/userModel';
import { setIntialLocationSessionStorage } from '../../../functions/general/helpers';
import Accessiblity from '../../components/accessibility/Accessiblity';
import { Unsubscribe } from 'firebase/auth';
import { setFontSize } from '../../../model/accessibility/accessibiliySlice';


const All = () => {
    const location = useLocation();

    const dispatch = useDispatch();
    function updateUserToStore(user: User | null) {
        dispatch(setUser(user))
    };

    function updateFonSize(fontSize: number) {
        dispatch(setFontSize(fontSize)) 
    }

    useEffect(() => {
        const usub:Unsubscribe = listenToAuth(updateUserToStore,updateFonSize);
        setIntialLocationSessionStorage(location.pathname);
        console.log('firstTime');
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