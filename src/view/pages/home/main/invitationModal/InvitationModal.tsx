import {FC} from "react";
import Modal from "../../../../components/modal/Modal";
import styles from "./InvitationModal.module.scss";
import { getInvitationPathName } from "../../../../../controllers/db/invitations/getInvitations";
import { useNavigate } from "react-router-dom";


interface Props {
   setShowModal: (show: boolean) => void;
    }
const InvitationModal:FC<Props> = ({setShowModal}) => {
  const navigate = useNavigate();

  async function handleJoin(ev: any) {
    try {
      ev.preventDefault();
      if (!ev.target.pin.value) throw new Error("No pin value");
      console.log("got number", ev.target.pin.value);
      const pathname = await getInvitationPathName(ev.target.pin.value);
      if (!pathname) throw new Error("No pathname");
      setShowModal(false);
      navigate(pathname);
    
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal>
      <div className={styles.invitation}>
        <form className={styles.invitation__form} onSubmit={handleJoin}>
          <input
            type="number"
            placeholder="Enter PIN"
            id="pin"
            required={true}
          />
          <button className="btn btn--agree">Join</button>
        </form>
      </div>
    </Modal>
  );
};

export default InvitationModal;
