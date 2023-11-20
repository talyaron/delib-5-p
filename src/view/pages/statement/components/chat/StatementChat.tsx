import { FC, useState } from "react"

// Third Party Imports
import { Statement } from "delib-npm"
import { useNavigate } from "react-router-dom"

// Custom Components
import StatementChatMore, {
    handleCreateSubStatements,
} from "./StatementChatMore"
import StatementChatSetOption from "./components/StatementChatSetOption"
import Text from "../../../../components/text/Text"
import ProfileImage from "./components/ProfileImage"
import Solution from "../general/Solution"
import EditTitle from "../../../../components/edit/EditTitle"
import StatementChatSetQuestion from "./components/StatementChatSetQuestion"

// Redux Store
import { useAppSelector } from "../../../../../functions/hooks/reduxHooks"
import { store } from "../../../../../model/store"
import { statementSubscriptionSelector } from "../../../../../model/statements/statementsSlice"
import { bubbleclass } from "./StatementChatCont"
import StatementChatSetEdit from "./components/StatementChatSetEdit"

interface Props {
    statement: Statement
    showImage: Function
}

const StatementChat: FC<Props> = ({ statement, showImage }) => {
    const navigate = useNavigate()
    
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
       if(!isEdit)
            handleCreateSubStatements(statement, navigate)
        
    }

    return (
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
                <StatementChatSetEdit isAuthrized={_isAuthrized} setEdit={setIsEdit} edit={isEdit}/>
            </div>
        </div>
    )
}

export default StatementChat
