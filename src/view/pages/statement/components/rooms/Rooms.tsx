import { RoomsStateSelection, Statement } from "delib-npm";
import { FC, useState, useEffect } from "react";
import CreateStatementModal from "../createStatementModal/CreateStatementModal";
import { listenToAllRoomsRequest } from "../../../../../controllers/db/rooms/getRooms";
import { useAppDispatch } from "../../../../../controllers/hooks/reduxHooks";

import RoomsAdmin from "./components/roomsAdmin/RoomsAdmin";
import ChooseRoom from "./components/choose/ChooseRoom";

// import InRoom from "./user/inRoom/InRoom";
import { store } from "../../../../../model/store";
import { enterRoomsDB } from "../../../../../controllers/db/rooms/setRooms";
import { isOptionFn } from "../../../../../controllers/general/helpers";

interface StatementRoomsProps {
    statement: Statement;
    subStatements: Statement[];
}

const StatementRooms: FC<StatementRoomsProps> = ({
    statement,
    subStatements,
}) => {
    const dispatch = useAppDispatch();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        enterRoomsDB(statement);

        const unsubscribe = listenToAllRoomsRequest(statement, dispatch);

        return unsubscribe;
    }, []);

    const __subStatements = subStatements.filter((subStatement: Statement) =>
        isOptionFn(subStatement),
    );

    const isAdmin = store.getState().user.user?.uid === statement.creatorId;

    return (
        <>
            <div className="page__main">
                <div className="wrapper">
                    <RoomScreen
                        roomState={statement.roomsState}
                        subStatements={__subStatements}
                        statement={statement}
                    />

                    {isAdmin ? <RoomsAdmin statement={statement} /> : null}

                    {showModal ? (
                        <CreateStatementModal
                            parentStatement={statement}
                            isOption={true}
                            setShowModal={setShowModal}
                        />
                    ) : null}
                </div>
            </div>
            {/* <div className="page__footer">
                <StatementBottomNav
                    statement={statement}
                    setShowModal={setShowModal}
                />
            </div> */}
        </>
    );
};

export default StatementRooms;

interface RoomScreenProps {
    roomState: RoomsStateSelection | undefined;
    subStatements: Statement[];
    statement: Statement;
}

const RoomScreen: FC<RoomScreenProps> = ({
    roomState,
    subStatements,
    statement,
}) => {
    switch (roomState) {
        case RoomsStateSelection.chooseRoom:
            return <ChooseRoom subStatements={subStatements} />;
        case RoomsStateSelection.inRoom:
            return <div>{statement.creatorId}</div>;

        // return <InRoom statement={statement} />;

        default:
            return <ChooseRoom subStatements={subStatements} />;
    }
};
