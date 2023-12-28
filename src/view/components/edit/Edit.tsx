import { FC } from "react";
import edit from "../../../assets/edit.svg";
import { Statement } from "delib-npm";
import { useNavigate } from "react-router-dom";
// import { auth } from '../../../functions/db/auth';
import { store } from "../../../model/store";

interface Props {
    statement: Statement;
}

const Edit: FC<Props> = ({ statement }) => {
    const navigate = useNavigate();
    const user = store.getState().user.user;

    function handleEdit() {
        try {
            navigate(`/home/updateStatement/${statement.statementId}`, {
                state: { from: window.location.pathname },
            });
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            {user?.uid === statement.creatorId ? (
                <div className="clickable" onClick={handleEdit}>
                    <img src={edit} alt="edit" />
                </div>
            ) : (
                <div />
            )}
        </>
    );
};

export default Edit;
