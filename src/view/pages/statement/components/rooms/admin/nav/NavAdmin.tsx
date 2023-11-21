import { FC } from "react"

// Third party
import { RoomsStateSelection, Statement } from "delib-npm"
import { t } from "i18next"

// Styles
import _styles from "../admin.module.css"

const styles = _styles as any

interface Props {
    roomSelectionFn: Function
    statement: Statement
}

interface AdminNav {
    link: RoomsStateSelection
    name: string
    id: string
}

export const navArray: AdminNav[] = [
    {
        link: RoomsStateSelection.SELECT_ROOMS,
        name: t("Participants choose rooms"),
        id: "choose",
    },
    {
        link: RoomsStateSelection.DIVIDE,
        name: t("Show division into rooms"),
        id: "divide",
    },
]

const NavAdmin: FC<Props> = ({ roomSelectionFn, statement }) => {
    // const { page } = useParams();
    // const _navArray = showNavElements(statement, navArray);

    return (
        <nav className={styles.nav}>
            {navArray.map((navObject: AdminNav) => (
                <div
                    key={`admin-${navObject.id}`}
                    onClick={() => roomSelectionFn(navObject.link)}
                    className={
                        statement.roomsState === navObject.link
                            ? styles.item__selected
                            : styles.item
                    }
                >
                    {navObject.name}
                </div>
            ))}
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

export default NavAdmin
