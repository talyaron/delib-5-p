import { FC } from "react"
import { Link, useParams } from "react-router-dom"
import { Statement,NavObject, Screen} from "delib-npm";




interface Props {
    roomSelectionFn: Function;

}



export const navArray: NavObject[] = [
    { link: Screen.ADMIN_CHOOSE, name: "בחירת חדרים", id: "choose" },
    { link: Screen.ADMIN_DIVIDE, name: "חלוקה לחדרים", id: "divide" },
]


const NavAdmin: FC<Props> = ({ roomSelectionFn }) => {

    const { page } = useParams();
    // const _navArray = showNavElements(statement, navArray);

    return (
        <nav className="admin__nav">

            {navArray.map((navObject: NavObject) =>
                //@ts-ignore
                <div onClick={roomSelectionFn} className={(page === navObject.link) || (navObject.link === "" && page === undefined) ?
                    "admin__nav__item"
                    :
                    "admin__nav__item btn--danger"}>

                    {navObject.name}

                </div>)}

        </nav>
    )
}

// export function showNavElements(statement:Statement|undefined, navArray: NavObject[]) {
//     try {
//         if (!statement) return navArray;
//         let _navArray = [...navArray];
      
    
//         const { subScreens } = statement;
          
//         //show setting page if admin of statement
//         if (!isAdmin(statement.creatorId)) {
//             _navArray = navArray.filter((navObj: NavObject) => navObj.link !== Screen.SETTINGS)
//         }
        
//         if (subScreens === undefined) {
//             return _navArray
//         }
//         if (subScreens.length > 0) {
//             _navArray = _navArray
//             //@ts-ignore
//             .filter((navObj: NavObject) => subScreens.includes(navObj.link))
            
//             if(isAdmin(statement.creatorId)){
//                 const adminTab = navArray.find(navObj => navObj.link === Screen.SETTINGS);
//                 if(adminTab) _navArray.push(adminTab);
//             }
            
//             return _navArray
//         } else {
//             return _navArray
//         }

//         function isAdmin(creatorId:string|undefined){
//             try {
//                 if(!creatorId) return false;
//                 const userUid = auth.currentUser?.uid;
//                 if(userUid === creatorId) return true;
//             } catch (error) {
//                 console.error(error);
//                 return false;
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         return navArray;
//     }
// }

export default NavAdmin;