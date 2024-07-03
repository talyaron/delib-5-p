import { FC, useEffect, useState } from "react";
import styles from "./InvitationModal.module.scss";
import {
  getInvitationPathName,
  getMaxInvitationDigits,
} from "../../../../../controllers/db/invitations/getInvitations";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";
import XIcon from "../../../../components/icons/XIcon";
import InvitationModalInputBoxWrapper from "./InvitationModalInputBoxWrapper";
import InviteModal from "../../../../components/modal/InviteModal";

interface Props {
	setShowModal: (show: boolean) => void;
}
const InvitationModal: FC<Props> = ({ setShowModal }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [maxInvitation, setMaxInvitation] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    getMaxInvitationDigits().then((result) => {
      return setMaxInvitation(result);
    });
  }, []);

  async function handleJoin(ev: React.FormEvent<HTMLFormElement>) {
    try {
      ev.preventDefault();

      let pins = gettingPinsFromInput(maxInvitation,ev);
      gettingPinsFromInput(maxInvitation,ev);
      
      const fullPin = settingPins(pins);

      if (!fullPin) throw new Error("No pin value");

      const pathname = await getInvitationPathName(fullPin);
      if (!pathname) {
        setErrorMessage(
          t("Couldn't find the invitation. Please check the PIN and try again.")
        );

        return;
      }
      setShowModal(false);
      navigate(pathname);
    } catch (error) {
      console.error(error);
    }
  }

  function gettingPinsFromInput(maxInvitation:number | undefined, ev: React.FormEvent<HTMLFormElement>) {
    const pins:number[] = [];
    const form = ev.target as HTMLFormElement;
    for (let i = 0; i < maxInvitation!; i++) {
      let pinValue = (form['pin' + i] as HTMLInputElement).value;

      if (Number.isInteger(Number(pinValue)) && Number(pinValue) >= 0 && Number(pinValue) <= 9) {
        pins.push(Number(pinValue));
      }
      else {
        pins.push(0);
      }
    }
    return pins;
    
  }

  function settingPins(pins: number[]) {
    let fullPin = 0;
    for (let i = 0; i < pins.length; i++) {
      fullPin += pins[i] * Math.pow(10, i);
    }
    return fullPin;
  }

  return (
    <InviteModal>
      <div className={styles.invitation}>
        <form className={styles.invitation__form} onSubmit={handleJoin}>

          <InvitationModalInputBoxWrapper maxInvitation={maxInvitation}/>
          {errorMessage && (
            <div className={styles.invitation__error}>{errorMessage}</div>
          )}

          <input
            type="submit"
            className={styles.invitation__form__btn}
            value={t("Join")}
          ></input>
          
          <button onClick={() => setShowModal(false)}>
            <XIcon />
          </button>
          
        </form>
      </div>
    </InviteModal>
  );
};
export default InvitationModal;