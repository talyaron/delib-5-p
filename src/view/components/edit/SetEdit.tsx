import { FC } from "react";
import EditIcon from "../../../assets/icons/EditIcon";

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
                    <EditIcon />
                </div>
            )}
        </div>
    );
};

export default SetEdit;
