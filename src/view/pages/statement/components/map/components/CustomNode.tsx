import { Statement } from 'delib-npm';
import { useEffect, useState } from 'react';

// Third party
import { useNavigate } from 'react-router-dom';
import { Handle, NodeProps } from 'reactflow';

// Hooks

// Icons
import PlusIcon from '@/assets/icons/plusIcon.svg?react';

// Statements functions
import {
	calculateFontSize,
	statementTitleToDisplay,
} from '@/controllers/general/helpers';
import { useMapContext } from '@/controllers/hooks/useMap';
import useStatementColor from '@/controllers/hooks/useStatementColor';

const nodeStyle = (
	parentStatement: Statement | 'top',
	statementColor: { backgroundColor: string; color: string },
	nodeTitle: string
) => {
	const style = {
		backgroundColor:
			parentStatement === 'top' ? 'darkblue' : statementColor.backgroundColor,
		color: statementColor.color,
		height: 40,
		width: 70,
		borderRadius: '5px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '.5rem',
		cursor: 'pointer',
		fontSize: calculateFontSize(nodeTitle),
	};

	return style;
};

export default function CustomNode({ data }: NodeProps) {
	const navigate = useNavigate();

	const { result, parentStatement } = data;

	const { statementId, statement, deliberativeElement, isResult } =
		result.top as Statement;

	const { shortVersion: nodeTitle } = statementTitleToDisplay(statement, 80);

	const statementColor = useStatementColor({ deliberativeElement, isResult });

	const { mapContext, setMapContext } = useMapContext();

	const [showBtns, setShowBtns] = useState(false);

	const handleNodeClick = () => {
		if (!showBtns) {
			setShowBtns((prev) => !prev);
		} else {
			navigate(`/statement/${statementId}/chat`, {
				state: { from: window.location.pathname },
			});
		}
	};

	const handleAddChildNode = () => {
		setMapContext((prev) => ({
			...prev,
			showModal: true,
			parentStatement: result.top,
		}));
	};

	const handleAddSiblingNode = () => {
		setMapContext((prev) => ({
			...prev,
			showModal: true,
			parentStatement: parentStatement,
		}));
	};

	useEffect(() => {
		if (!mapContext.showModal) setShowBtns(false);
	}, [mapContext.showModal]);

	return (
		<>
			<button
				onClick={handleNodeClick}
				data-id={statementId}
				style={{
					...nodeStyle(parentStatement, statementColor, nodeTitle),
					textAlign: 'center',
					wordBreak: 'break-word',
				}}
				className='node__content'
			>
				{nodeTitle}
			</button>
			{showBtns && (
				<>
					<button
						className='addIcon'
						onClick={handleAddChildNode}
						aria-label='Add child node'
						style={{
							position: 'absolute',
							cursor: 'pointer',
							right: mapContext.direction === 'TB' ? 0 : '-1.8rem',
							bottom: mapContext.direction === 'TB' ? '-1.8rem' : 0,
						}}
					>
						<PlusIcon />
					</button>

					<button
						className='addIcon'
						onClick={handleAddSiblingNode}
						aria-label='Add sibling node'
						style={{
							position: 'absolute',
							cursor: 'pointer',
							left: mapContext.direction === 'TB' ? '-1.8rem' : 0,
							top: mapContext.direction === 'TB' ? 0 : '-1.8rem',
						}}
					>
						<PlusIcon />
					</button>
				</>
			)}

			<Handle type='target' position={mapContext.targetPosition} />
			<Handle type='source' position={mapContext.sourcePosition} />
		</>
	);
}
