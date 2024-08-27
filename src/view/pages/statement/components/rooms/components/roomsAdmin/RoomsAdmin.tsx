import { Statement } from "delib-npm";
import { FC } from "react";

import { useLanguage } from "@/controllers/hooks/useLanguages";
import "./RoomsAdmin.scss";
import Button from "@/view/components/buttons/button/Button";
import { toggleRoomEditingInDB } from "@/controllers/db/rooms/setRooms";

interface Props {
  statement: Statement;
}

const RoomsAdmin: FC<Props> = ({ statement }) => {
  const { t } = useLanguage();
  function handleToggleEdit() {
	toggleRoomEditingInDB(statement.statementId);
  }

  return (
    <div className="rooms-admin">
      <p className="title">{t("Management board")}</p>

      <Button
        text={t("Set Into Rooms")}
        onClick={handleToggleEdit}
      />
      <div>
        <input type="number" defaultValue={7}/>
      </div>
    </div>
  );
};

export default RoomsAdmin;
