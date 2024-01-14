import React, { FC } from "react";
import EditIcon from "../../../assets/icons/EditIcon";

interface Props {
    isAuthrized: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    edit: boolean;
    text?: string;
}

const SetEdit: FC<Props> = ({ isAuthrized, setEdit, edit, text }) => {
    if (!isAuthrized) return null;

    return (
        <>
            {text && (
                <span className="clickable" onClick={() => setEdit(!edit)}>
                    {text}
                </span>
            )}
            <div>
                {isAuthrized && (
                    <div className="clickable" onClick={() => setEdit(!edit)}>
                        <EditIcon />
                    </div>
                )}
            </div>
        </>
    );
};

export default SetEdit;
