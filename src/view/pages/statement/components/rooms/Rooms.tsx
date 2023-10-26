import { LobbyRooms, RoomAskToJoin, RoomsStateSelection, Statement } from 'delib-npm'
import { FC, useState, useEffect } from 'react'
import Modal from '../../../../components/modal/Modal'
import NewSetStatementSimple from '../set/NewStatementSimple'
import { listenToAllRoomsRquest, listenToLobbyRoomJoiners, listenToRoomsRquest } from '../../../../../functions/db/rooms/getRooms'
import { useAppDispatch } from '../../../../../functions/hooks/reduxHooks'
import { setAskToJoinRooms, setLobbyRooms } from '../../../../../model/statements/statementsSlice'
import RoomsAdmin from './admin/RoomsAdmin'
import SelectRoom from './comp/choose/ChooseRoom'
import RoomQuestions from './comp/divide/RoomDivide'
import { auth } from '../../../../../functions/db/auth'
import NavAdmin from './admin/nav/NavAdmin'
import { setRoomsStateToDB } from '../../../../../functions/db/rooms/setRooms'
interface Props {
    statement: Statement
    subStatements: Statement[]
}

let unsub = () => { }, unsub2 = () => { }, unsub3 = () => { };


const StatmentRooms: FC<Props> = ({ statement, subStatements }) => {
    const dispatch = useAppDispatch();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        unsub = listenToRoomsRquest(statement.statementId, updateRequestForRooms);
        unsub2 = listenToLobbyRoomJoiners(statement.statementId, updateLobbyRoomJoinersCounts);

        if (statement.creatorId === auth.currentUser?.uid) unsub3 = listenToAllRoomsRquest(statement, updateRequestForRooms);
        return () => {
            unsub();
            unsub2();
            unsub3();
        }

    }, [])

    function updateRequestForRooms(roomAsked: RoomAskToJoin) {
        dispatch(setAskToJoinRooms({ request: roomAsked, parentId: statement.statementId }))
    }

    function updateLobbyRoomJoinersCounts(lobbyRooms: LobbyRooms[]) {
        dispatch(setLobbyRooms({ lobbyRooms }))
    }


    const __substatements = subStatements.filter((subStatement: Statement) => subStatement.isOption);
    const isAdmin = auth.currentUser?.uid === statement.creatorId;

    return (
        <div className='page__main'>
            <div className='wrapper'>
                {switchRoomScreens(statement.roomsState, __substatements, statement, setShowModal)}

                {isAdmin ? <RoomsAdmin statement={statement} /> : null}


                {showModal ? <Modal>
                    <NewSetStatementSimple parentStatement={statement} isOption={true} setShowModal={setShowModal} />
                </Modal> : null}
            </div>
          
        </div>
    )
}

export default StatmentRooms;

function switchRoomScreens(roomState: RoomsStateSelection | undefined, subStatements: Statement[], statement: Statement, setShowModal: Function) {
    switch (roomState) {
        case RoomsStateSelection.SELECT_ROOMS:
            return <SelectRoom subStatements={subStatements} setShowModal={setShowModal} />
        case RoomsStateSelection.DIVIDE:
            return <RoomQuestions statement={statement} />
        default:
            return <SelectRoom subStatements={subStatements} setShowModal={setShowModal} />
    }
}