import {
    Statement,
    NavObject,
    Screen,
    ResultsBy,
    UserSchema,
    StatementType,
} from "delib-npm"
import { store } from "../../../../../model/store"
import { setStatmentToDB } from "../../../../../functions/db/statements/setStatments"

export async function handleSetStatment(
    ev: React.FormEvent<HTMLFormElement>,
    setIsLoading: Function,
    statement: Statement | undefined,
    statementId: string | undefined,
    navigate: Function,
    navArray: NavObject[]
) {
    try {
        if (!statement) throw new Error("statement is undefined")
        if (!statementId) throw new Error("statementId is undefined")

        ev.preventDefault()
        setIsLoading(true)
        const data = new FormData(ev.currentTarget)
        const user = store.getState().user.user
        if (!user) throw new Error("user is undefined")

        let title: any = data.get("statement")
        const resultsBy = data.get("resultsBy") as ResultsBy
        const numberOfResults: number = Number(data.get("numberOfResults"))

        const description = data.get("description")

        const _statement = `${title}\n${description}`

        //add to title * at the beggining
        if (title && !title.startsWith("*")) title = "*" + title

        UserSchema.parse(user)

        const newStatement: any = Object.fromEntries(data.entries())

        newStatement.subScreens = parseScreensCheckBoxes(newStatement, navArray)
        newStatement.statement = _statement
        newStatement.resultsSettings = {
            numberOfResults: numberOfResults,
            resultsBy: resultsBy || ResultsBy.topVote,
            deep: 1,
            minConsensus: 1,
        }
        newStatement.statementId = statement?.statementId || crypto.randomUUID()
        newStatement.creatorId =
            statement?.creator.uid || store.getState().user.user?.uid
        newStatement.parentId = statement?.parentId || statementId || "top"
        newStatement.topParentId =
            statement?.topParentId || statementId || "top"
        newStatement.statementType = getStatementType(statement, statementId)
        newStatement.creator = statement?.creator || user
        newStatement.hasChildren =
            newStatement.hasChildren === "on" ? true : false
        if (statement) {
            newStatement.lastUpdate = new Date().getTime()
        }
        newStatement.createdAt = statement?.createdAt || new Date().getTime()

        newStatement.consensus = statement?.consensus || 0

        const setSubsciption: boolean = statementId === undefined ? true : false

        //remove all "on" values
        for (const key in newStatement) {
            if (newStatement[key] === "on") delete newStatement[key]
        }

        const _statementId = await setStatmentToDB(newStatement, setSubsciption)

        if (_statementId) navigate(`/home/statement/${_statementId}/chat`)
        else throw new Error("statement not found")
    } catch (error) {
        console.error(error)
    }

    function getStatementType(
        statement: Statement,
        statementId: string | undefined
    ) {
        try {
            if (!statementId) return StatementType.question
            if (statement.statementType) return statement.statementType
            else return StatementType.statement
        } catch (error) {
            console.error(error)
            return StatementType.statement
        }
    }
}

export function isSubPageChecked(
    statement: Statement | undefined,
    navObj: NavObject
) {
    try {
        //in case of a new statement
        if (!statement) {
            if (navObj.default === false) return false
            else return true
        }
        //in case of an existing statement
        const subScreens = statement.subScreens as Screen[]
        if (subScreens === undefined) return true
        if (subScreens?.includes(navObj.link)) return true
    } catch (error) {
        console.error(error)
        return true
    }
}
export function parseScreensCheckBoxes(dataObj: Object, navArray: NavObject[]) {
    try {
        if (!dataObj) throw new Error("dataObj is undefined")
        if (!navArray) throw new Error("navArray is undefined")
        const _navArray = [...navArray]

        const screens = _navArray
            //@ts-ignore
            .filter((navObj) => dataObj[navObj.link] === "on")
            .map((navObj) => navObj.link)
        return screens
    } catch (error) {
        console.error(error)
        return []
    }
}
