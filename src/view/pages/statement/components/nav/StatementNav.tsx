import { FC } from "react"
import { Link, useParams } from "react-router-dom"
import { Statement,NavObject, Screen} from "delib-npm";
import { store } from "../../../../../model/store";



interface Props {
    statement: Statement

}



export const navArray: NavObject[] = [
    { link: Screen.CHAT, name: "שיחה", id: "main" },
    { link: Screen.OPTIONS, name: "פתרונות", id: "options" },
    { link: Screen.VOTE, name: "הצבעה", id: "vote" },
    { link: Screen.GROUPS, name: "חדרים", id: "rooms", default: false},
    { link: Screen.SETTINGS, name: "הגדרות", id: "settings"}
]


const StatementNav: FC<Props> = ({ statement }) => {

    const { page } = useParams();
    const _navArray = showNavElements(statement, navArray);

    return (
        <nav className="statement__nav">

            {_navArray.map((navObject: NavObject) =>
                //@ts-ignore
                <Link key={navObject.id} to={`${navObject.link}`} className={(page === navObject.link) || (navObject.link === "" && page === undefined) ?
                    "statement__nav__button statement__nav__button--selected"
                    :
                    "statement__nav__button"}>

                    {navObject.name}

                </Link>)}

        </nav>
    )
}

export function showNavElements(statement:Statement|undefined, navArray: NavObject[]) {
    try {
        if (!statement) return navArray;
        let _navArray = [...navArray];
      
    
        const { subScreens } = statement;
          
        //show setting page if admin of statement
        if (!isAdmin(statement.creatorId)) {
            _navArray = navArray.filter((navObj: NavObject) => navObj.link !== Screen.SETTINGS)
        }
        
        if (subScreens === undefined) {
            return _navArray
        }
        if (subScreens.length > 0) {
            _navArray = _navArray
            //@ts-ignore
            .filter((navObj: NavObject) => subScreens.includes(navObj.link))
            
            if(isAdmin(statement.creatorId)){
                const adminTab = navArray.find(navObj => navObj.link === Screen.SETTINGS);
                if(adminTab) _navArray.push(adminTab);
            }
            
            return _navArray
        } else {
            return _navArray
        }

        function isAdmin(creatorId:string|undefined){
            try {
                if(!creatorId) return false;
                const userUid = store.getState().user.user?.uid;
                if(userUid === creatorId) return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    } catch (error) {
        console.error(error);
        return navArray;
    }
}

export default StatementNav;