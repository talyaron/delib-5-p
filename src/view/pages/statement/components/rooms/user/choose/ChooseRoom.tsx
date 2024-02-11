import { FC } from "react";

// Third party
import { Statement } from "delib-npm";

// Custom components
import RoomChoosingCard from "./RoomChoosingCard";

interface Props {
    subStatements: Statement[];
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseRoom: FC<Props> = ({ subStatements, setShowModal }) => {

    return (
        <>
            <h2>"{("Division into rooms")}"</h2>
            <div className="roomsCards__wrapper">
                {subStatements.map((subStatement: Statement) => {
                    return (
                        <RoomChoosingCard
                            key={subStatement.statementId}
                            statement={subStatement}
                        />
                    );
                })}
            </div>
            <div className="fav fav--fixed" onClick={() => setShowModal(true)}>
                <div>+</div>
            </div>
        </>
    );
};

export default ChooseRoom;
