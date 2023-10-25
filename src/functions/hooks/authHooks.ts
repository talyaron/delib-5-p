// import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react'
import { auth } from '../db/auth';

const useAuth = () => {
    const [isLogged, setIsLogged] = useState(false)
    const user = auth.currentUser;
    useEffect(() => {
        if (user) setIsLogged(true)
        else setIsLogged(false)
    }, [user])
 
    return isLogged;
}

export default useAuth