import { FC, useContext, useEffect, useState } from 'react'
import { StatementContext } from '../../../../StatementCont'
import styles from './Document.module.scss'
import Button, { ButtonType } from '@/view/components/buttons/button/Button'
import Modal from '@/view/components/modal/Modal'
import AddStage from './addStage/AddStage'
import { useSelector } from 'react-redux'
import { statementSubsSelector } from '@/model/statements/statementsSlice'
import StageCard from './stages/StageCard'
import { Statement, StatementType } from 'delib-npm'
import { updateStatementsOrderToDB } from '@/controllers/db/statements/setStatements'

const Document: FC = () => {
	const { statement } = useContext(StatementContext);
	const initialStages = useSelector(statementSubsSelector(statement?.statementId))
		.filter((sub: Statement) => sub.statementType === StatementType.stage).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

	const [stages, setStages] = useState<Statement[]>(initialStages);
	const [showAddStage, setShowAddStage] = useState<boolean>(false);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	useEffect(() => {
		setStages(initialStages);
	}, [initialStages.length]);

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number): void => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = 'move';

		// Required for Firefox
		e.dataTransfer.setData('text/plain', '');
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number): void => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === dropIndex) return;

		const newStages = [...stages];
		const draggedStage = newStages[draggedIndex];
		newStages.splice(draggedIndex, 1);
		newStages.splice(dropIndex, 0, draggedStage);

		newStages.forEach((stage, index) => {
			stage.order = index;
		});
		updateStatementsOrderToDB(newStages);

		setStages(newStages);
		setDraggedIndex(null);
	};

	const handleDragEnd = (): void => {
		setDraggedIndex(null);
	};

	return (
		<div className={styles.wrapper}>
			<h2>Question</h2>
			<p>{statement?.description}</p>
			<Button
				text="Add Stage"
				type="button"
				buttonType={ButtonType.PRIMARY}
				onClick={() => setShowAddStage(true)}
			/>

			{showAddStage && (
				<Modal>
					<AddStage setShowAddStage={setShowAddStage} />
				</Modal>
			)}

			<div className={styles.stagesWrapper}>
				{stages.map((stage, index) => (
					<div
						key={stage.statementId}
						className={`${styles.stageContainer} ${draggedIndex === index ? styles.dragging : ''}`}
						draggable
						onDragStart={(e) => handleDragStart(e, index)}
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, index)}
						onDragEnd={handleDragEnd}
					>
						<div className={styles.dragHandle}></div>
						<StageCard statement={stage} />
					</div>
				))}
			</div>
		</div>
	);
};

export default Document;