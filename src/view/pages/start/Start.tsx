import { useEffect } from "react"
import { googleLogin } from "../../../functions/db/auth"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../functions/hooks/reduxHooks"
import { userSelector } from "../../../model/users/userSlice"
import { getIntialLocationSessionStorage } from "../../../functions/general/helpers"

//img
import Logo from "../../../assets/logo/logo-128px.png"
// import EnterName from './EnterName';

const Start = () => {
    const navigate = useNavigate()
    const user = useAppSelector(userSelector)
    // const [showNameModul, setShowNameModul] = useState(false);

    useEffect(() => {
        if (user) {
            navigate(getIntialLocationSessionStorage() || "/home")
        } else {
            console.info("not logged")
        }
    }, [user])

    return (
        <div className="page splashPage">
            <h1 className="splashPage__title">Delib 5</h1>
            <img src={Logo} alt="Delib logo" />
            <h2 className="splashPage__subTitle">יוצרים הסכמות</h2>
            <button className="splashPage__loginButton" onClick={googleLogin}>
                התחברות עם גוגל
            </button>
            {/* <div className="btn loginButton" onClick={()=>setShowNameModul(true)}>
                    התחברות עם שם זמני
                </div> */}
            <a
                href="http://delib.org"
                style={{
                    marginTop: "30px",
                    textDecoration: "none",
                }}
            >
                <h2>מבית המכון לדמוקרטיה דיונית</h2>
            </a>
            {/* {showNameModul?<EnterName setShowNameModul={setShowNameModul}/>:null} */}
        </div>
    )
}

export default Start
