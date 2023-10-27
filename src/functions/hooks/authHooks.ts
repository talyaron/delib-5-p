// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react'
import { store } from '../../model/store';

const useAuth = () => {
    const [isLogged, setIsLogged] = useState(false)
    const user = store.getState().user.user;
    useEffect(() => {
        if (user) setIsLogged(true)
        else setIsLogged(false)
    }, [user])
 
    return isLogged;
}

export default useAuth