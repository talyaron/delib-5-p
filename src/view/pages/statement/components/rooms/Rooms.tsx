import { RoomsStateSelection, Statement } from "delib-npm";
import React, { FC, useState, useEffect } from "react";
import Modal from "../../../../components/modal/Modal";
import NewSetStatementSimple from "../set/NewStatementSimple";
import { listenToAllRoomsRquest } from "../../../../../functions/db/rooms/getRooms";
import { useAppDispatch } from "../../../../../functions/hooks/reduxHooks";

import RoomsAdmin from "./admin/RoomsAdmin";
import ChooseRoom from "./user/choose/ChooseRoom";
import InRoom from "./user/inRoom/InRoom";
import { store } from "../../../../../model/store";
import { enterRoomsDB } from "../../../../../functions/db/rooms/setRooms";
import { isOptionFn } from "../../../../../functions/general/helpers";
import { Unsubscribe } from "firebase/auth";

interface Props {
    statement: Statement;
    subStatements: Statement[];
}

const StatmentRooms: FC<Props> = ({ statement, subStatements }) => {
    const dispatch = useAppDispatch();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
       
        enterRoomsDB(statement);

        const unsub = listenToAllRoomsRquest(statement, dispatch);

        return () => {
            if (unsub) unsub();
        };
    }, []);

    const __substatements = subStatements.filter((subStatement: Statement) =>
        isOptionFn(subStatement),
    );

    const isAdmin = store.getState().user.user?.uid === statement.creatorId;

    return (
        <div className="page__main">
            <div className="wrapper">
                {switchRoomScreens(
                    statement.roomsState,
                    __substatements,
                    statement,
                    setShowModal,
                )}

                {isAdmin ? <RoomsAdmin statement={statement} /> : null}

                {showModal ? (
                    <Modal>
                        <NewSetStatementSimple
                            parentStatement={statement}
                            isOption={true}
                            setShowModal={setShowModal}
                        />
                    </Modal>
                ) : null}
            </div>
        </div>
    );
};

export default StatmentRooms;

function switchRoomScreens(
    roomState: RoomsStateSelection | undefined,
    subStatements: Statement[],
    statement: Statement,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
) {
    switch (roomState) {
        case RoomsStateSelection.chooseRoom:
            return (
                <ChooseRoom
                    subStatements={subStatements}
                    setShowModal={setShowModal}
                />
            );
        case RoomsStateSelection.inRoom:
            return <InRoom statement={statement} />;
        default:
            return (
                <ChooseRoom
                    subStatements={subStatements}
                    setShowModal={setShowModal}
                />
            );
    }
}
