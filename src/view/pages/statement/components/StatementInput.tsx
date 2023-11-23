import { FC, useState } from "react"

// Third Party Imports
import { Screen, Statement } from "delib-npm"

// Helpers
import { setStatmentToDB } from "../../../../functions/db/statements/setStatments"
import { getNewStatment } from "../../../../functions/general/helpers"

// MUI
import SendIcon from "@mui/icons-material/Send"
import { IconButton } from "@mui/material"

// Redux Store
import { useAppSelector } from "../../../../functions/hooks/reduxHooks"
import { userSelector } from "../../../../model/users/userSlice"

interface Props {
    statement: Statement
    topBar: React.RefObject<HTMLDivElement>
}

const StatementInput: FC<Props> = ({ statement, topBar }) => {
    const user = useAppSelector(userSelector)

    const [margin, setMargin] = useState("0%")

    const direction =
        document.body.style.direction === "rtl" ? "row" : "row-reverse"

    function handleAddStatement(e: any) {
        try {
            e.preventDefault()

            if (!user) throw new Error("No user")

            const value = e.target.newStatement.value

            //remove white spaces and \n
            const _value = value.replace(/\s+/g, " ").trim()

            if (!_value) throw new Error("No value")

            const newStatement: Statement | undefined = getNewStatment({
                value,
                statement,
                user,
            })
            if (!newStatement) throw new Error("No statement")

            newStatement.subScreens = [Screen.CHAT, Screen.OPTIONS, Screen.VOTE]

            setStatmentToDB(newStatement)

            e.target.reset()
        } catch (error) {
            console.error(error)
        }
    }

    function handleInput(e: any) {
        try {
            const _isMobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                )
                    ? true
                    : false

            if (e.key === "Enter" && !e.shiftKey && !_isMobile) {
                const _value = e.target.value.replace(/\s+/g, " ").trim()
                if (!_value) {
                    e.target.value = ""
                    return
                }

                // submit form
                if (!user) throw new Error("No user")

                const newStatement: Statement | undefined = getNewStatment({
                    value: e.target.value,
                    statement,
                    user,
                })

                if (!newStatement) throw new Error("No statement")

                newStatement.subScreens = [
                    Screen.CHAT,
                    Screen.OPTIONS,
                    Screen.VOTE,
                ]

                setStatmentToDB(newStatement)
                e.target.value = ""
            }
        } catch (error) {
            console.error(error)
        }
    }

    const _isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
            ? true
            : false

    const handleFocus = () => {
        if (topBar?.current && _isMobile) {
            topBar.current.scrollIntoView()
            setMargin("60%")
        }
    }

    return (
        <form
            onSubmit={handleAddStatement}
            name="theForm"
            className="statement__form"
            style={{
                flexDirection: direction,
                position: "fixed",
                bottom: margin,
            }}
        >
            <textarea
                rows={3}
                className="statement__form__input"
                name="newStatement"
                onKeyUp={handleInput}
                required
                autoFocus={true}
                onFocusCapture={handleFocus}
            />
            <div className="statement__form__sendBtnBox">
                <IconButton type="submit">
                    <SendIcon />
                </IconButton>
            </div>
        </form>
    )
}

export default StatementInput
