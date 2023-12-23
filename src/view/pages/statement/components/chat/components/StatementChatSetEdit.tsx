import { FC } from "react";
import { MdEdit } from "react-icons/md";
<MdEdit />;

interface Props {
    isAuthrized: boolean;
    setEdit: Function;
    edit: boolean;
}

const StatementChatSetEdit: FC<Props> = ({ isAuthrized, setEdit, edit }) => {
    return (
        <div>
            {isAuthrized && (
                <div className="clickable" onClick={() => setEdit(!edit)}>
                    <MdEdit color={edit ? "blue" : "lightgray"} size="1.5rem" />
                </div>
            )}
        </div>
    );
};

export default StatementChatSetEdit;
