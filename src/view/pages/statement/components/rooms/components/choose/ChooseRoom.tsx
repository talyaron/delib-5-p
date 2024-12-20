import { Statement, StatementType } from "delib-npm";
import { FC, useState } from "react";

// Third party

// Custom components
import CreateStatementModal from "../../../createStatementModal/CreateStatementModal";
import styles from "./ChooseRoom.module.scss";
import RoomChoosingCard from "./roomChoosingCard/RoomChoosingCard";
import { useLanguage } from "@/controllers/hooks/useLanguages";

import Button from "@/view/components/buttons/button/Button";

interface Props {
  statement: Statement;
  topics: Statement[];
}

const ChooseRoom: FC<Props> = ({ statement, topics }) => {
	const { t } = useLanguage();
	const [showModal, setShowModal] = useState(false);

	return (
		<div className={`${styles.wrapper} wrapper`}>
    
			<div className="btns">
				<Button text={t("Create new room")} onClick={() => handleAddRoom()} />
			</div>
			<div className="roomsCards__wrapper">
				{topics.map((topic: Statement) => {
					return <RoomChoosingCard key={topic.statementId} topic={topic} />;
				})}
       
			</div>
			{showModal && (
				<CreateStatementModal
					allowedTypes={[StatementType.option]}
					parentStatement={statement}
					isOption={true}
					setShowModal={setShowModal}
				/>
			)}
		</div>
	);

	function handleAddRoom() {
		setShowModal(true);
	}
};

export default ChooseRoom;
