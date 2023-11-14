import { FC, useState } from "react"
import { Statement } from "delib-npm"
import StatementChatMore, {
    handleCreateSubStatements,
} from "../StatementChatMore"

//icons

import Text from "../../../../components/text/Text"
import StatementChatSetOption from "./StatementChatSetOption"
import ProfileImage from "./ProfileImage"
import { store } from "../../../../../model/store"
import Solution from "../general/Solution"
import { useNavigate } from "react-router-dom"
import EditTitle from "../../../../components/edit/EditTitle"
import StatementChatSetQuestion from "./StatementChatSetQuestion"
import { isAuthorized } from "../../../../../functions/general/helpers"
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks"
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice"
import _ from "lodash"

interface Props {
    statement: Statement
    showImage: Function
    page: any
}

const StatementChat: FC<Props> = ({ statement, showImage, page }) => {
    const navigate = useNavigate()
    console.log(statement.statementId)
    const statementubscription = useAppSelector(
        statementSubscriptionSelector(statement.parentId)
    )

    // const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false)

    const userId = store.getState().user.user?.uid
    const creatorId = statement.creatorId
    const _isAuthrized = isAuthorized(statement, statementubscription)

    const isMe = userId === creatorId
    const { isOption, isQuestion } = statement

    function handleEdit() {
        if (userId === creatorId) setIsEdit(true)
        else {
            handleCreateSubStatements(statement, navigate, page)
        }
    }

    return (
        <>
            <div
                className={
                    isMe
                        ? `statement__chatCard statement__chatCard--me`
                        : "statement__chatCard statement__chatCard--other"
                }
            >
                <div className="statement__chatCard__left">
                    <ProfileImage statement={statement} showImage={showImage} />
                </div>

                <div
                    className={
                        isOption
                            ? "statement__bubble statement__bubble--option"
                            : "statement__bubble"
                    }
                >
                    <div className={bubbleclass(isQuestion, isMe)}>
                        <div
                            className="statement__bubble__text"
                            onClick={handleEdit}
                        >
                            <div className="statement__bubble__text__text">
                                {!isEdit ? (
                                    <Text text={statement.statement} />
                                ) : (
                                    <EditTitle
                                        statement={statement}
                                        setEdit={setIsEdit}
                                        isTextArea={true}
                                    />
                                )}
                            </div>

                            <Solution statement={statement} />
                        </div>
                        {isQuestion || isOption ? (
                            <div className="statement__bubble__more">
                                <StatementChatMore
                                    statement={statement}
                                    page={page}
                                    hasChildren={true}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="statement__chatCard__right">
                    {isQuestion ? null : (
                        <StatementChatSetOption statement={statement} />
                    )}
                    {!_isAuthrized || isOption ? null : (
                        <StatementChatSetQuestion statement={statement} />
                    )}
                </div>
            </div>
        </>
    )
}

export default StatementChat

function bubbleclass(isQuestion: boolean | undefined, isMe: boolean) {
    if (isQuestion) {
        if (isMe) {
            return "bubble right question--yes"
        } else {
            return "bubble left question--yes"
        }
    } else {
        if (isMe) {
            return "bubble right question--no"
        } else {
            return "bubble left question--no"
        }
    }
}
