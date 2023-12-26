import { FC } from "react";
import EditIcon from "../icons/EditIcon";

interface Props {
    isAuthrized: boolean;
    setEdit: Function;
    edit: boolean;
}

const SetEdit: FC<Props> = ({ isAuthrized, setEdit, edit }) => {
    return (
        <div>
            {isAuthrized && (
                <div className="clickable" onClick={() => setEdit(!edit)}>
                    <EditIcon color={edit ? "blue" : "lightgray"} />
                </div>
            )}
        </div>
    );
};

export default SetEdit;
