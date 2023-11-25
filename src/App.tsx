import { useEffect } from "react"

// Third party imports
import { useTranslation } from "react-i18next"
import { Outlet, useNavigate } from "react-router-dom"

// Firebase functions
import { listenToAuth } from "./functions/db/auth"
import { Unsubscribe } from "firebase/auth"

// Redux Store
import { useAppSelector } from "./functions/hooks/reduxHooks"
import { setFontSize } from "./model/users/userSlice"
import { useDispatch } from "react-redux"
import { setUser, userSelector } from "./model/users/userSlice"

// Type
import { User } from "./model/users/userModel"

// Custom components
import Accessiblity from "./view/components/accessibility/Accessiblity"

export default function App() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { i18n } = useTranslation()
    const user = useAppSelector(userSelector)

    function updateUserToStore(user: User | null) {
        dispatch(setUser(user))
    }

    function updateFonSize(fontSize: number) {
        dispatch(setFontSize(fontSize))
    }

    function navigateToInitialLocationCB(pathname: string) {
        navigate(pathname)
    }
    useEffect(() => {
        const lang = localStorage.getItem("lang")
        if (lang) {
            i18n.changeLanguage(lang)
            document.body.style.direction =
                lang === "he" || lang === "ar" ? "rtl" : "ltr"
        }
    }, [])

    useEffect(() => {
        const usub: Unsubscribe = listenToAuth(
            updateUserToStore,
            updateFonSize,
            navigateToInitialLocationCB
        )

        return () => {
            usub()
        }
    }, [])

    useEffect(() => {
        if (!user) navigate("/")
    }, [user])

    return (
        <>
            <Accessiblity />
            <Outlet />
        </>
    )
}
