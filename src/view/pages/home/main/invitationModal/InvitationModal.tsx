import { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { handleGetMaxInvitationDigits } from "./invitationModalCont";

const InvitationModal = () => {
  const [numberOfDigits, setNumberOfDigits] = useState<number>(0);
  useEffect(() => {
    handleGetMaxInvitationDigits(setNumberOfDigits);
  }, []);
  return <Modal>test: {numberOfDigits}</Modal>;
};

export default InvitationModal;
