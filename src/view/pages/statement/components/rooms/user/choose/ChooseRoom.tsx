import { FC } from "react";

// Third party
import { Statement } from "delib-npm";
import { t } from "i18next";

// Custom components
import StatementRoomCard from "./StatementRoomCard";

interface Props {
    subStatements: Statement[];
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseRoom: FC<Props> = ({ subStatements, setShowModal }) => {

    return (
        <>
            <h2>"{t("Division into rooms")}"</h2>
            <div className="roomsCards__wrapper">
                {subStatements.map((subStatement: Statement) => {
                    return (
                        <StatementRoomCard
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
