import { useCallback, useEffect, useState } from 'react';

// Styles
import '@/view/pages/statement/components/createStatementModal/CreateStatementModal.scss';

// Third party imports
import { Results } from 'delib-npm';

// React Flow imports
import ReactFlow, {
	Controls,
	useNodesState,
	useEdgesState,
	Panel,
	Position,
	Node,
	useReactFlow,
	ReactFlowInstance,
} from 'reactflow';
import '../mapHelpers/reactFlow.scss';
import 'reactflow/dist/style.css';

// icons
import MapSaveIcon from '@/assets/icons/MapSaveIcon.svg';
import MapRestoreIcon from '@/assets/icons/MapRestoreIcon.svg';
import MapVerticalLayoutIcon from '@/assets/icons/MapVerticalLayoutIcon.svg';
import MapHorizontalLayoutIcon from '@/assets/icons/MapHorizontalLayoutIcon.svg';
import MapCancelIcon from '@/assets/icons/MapCancelIcon.svg';
import MapHamburgerIcon from '@/assets/icons/MapHamburgerIcon.svg';

// Helper functions
import {
	createInitialNodesAndEdges,
	getLayoutedElements,
} from '../mapHelpers/customNodeCont';

// Hooks
import { useMapContext } from '../../../../../../controllers/hooks/useMap';

// Custom components
import CustomNode from './CustomNode';
import Modal from '../../../../../components/modal/Modal';
import { updateStatementParents } from '../../../../../../controllers/db/statements/setStatements';
import { getStatementFromDB } from '../../../../../../controllers/db/statements/getStatement';

const nodeTypes = {
	custom: CustomNode,
};

interface Props {
	descendants: Results[];
	isAdmin: boolean;
}

export default function TreeChart({ descendants, isAdmin }: Readonly<Props>) {
	const { getIntersectingNodes } = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [tempEdges, setTempEdges] = useState(edges);
	const [rfInstance, setRfInstance] = useState<null | ReactFlowInstance<
		unknown,
		unknown
	>>(null);

	const [intersectedNodeId, setIntersectedNodeId] = useState('');
	const [draggedNodeId, setDraggedNodeId] = useState('');

	const { mapContext, setMapContext } = useMapContext();

	const [isButtonVisible, setIsButtonVisible] = useState(false);

	const handleHamburgerClick = () => {
		setIsButtonVisible(true);
	};

	const handleCancelClick = () => {
		setIsButtonVisible(false);
	};

	useEffect(() => {
		const { nodes: createdNodes, edges: createdEdges } =
			createInitialNodesAndEdges(descendants[0]);

		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
			createdNodes,
			createdEdges,
			mapContext.nodeHeight,
			mapContext.nodeWidth,
			mapContext.direction
		);

		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
		setTempEdges(layoutedEdges);

		setTimeout(() => {
			onSave();
		}, 500);
	}, [descendants[0]]);

	const onLayout = useCallback(
		(direction: 'TB' | 'LR') => {
			const width = direction === 'TB' ? 50 : 90;
			const height = direction === 'TB' ? 50 : 30;

			setMapContext((prev) => ({
				...prev,
				targetPosition: direction === 'TB' ? Position.Top : Position.Left,
				sourcePosition: direction === 'TB' ? Position.Bottom : Position.Right,
				nodeWidth: width,
				nodeHeight: height,
				direction,
			}));

			const { nodes: layoutedNodes, edges: layoutedEdges } =
				getLayoutedElements(nodes, edges, height, width, direction);

			setNodes([...layoutedNodes]);
			setEdges([...layoutedEdges]);
		},
		[nodes, edges]
	);

	const onNodeDragStop = async (
		_: React.MouseEvent<Element, MouseEvent>,
		node: Node
	) => {
		const intersections = getIntersectingNodes(node).map((n) => n.id);

		if (intersections.length === 0) return setEdges(tempEdges);

		setDraggedNodeId(node.id);
		setIntersectedNodeId(intersections[0]);

		setMapContext((prev) => ({
			...prev,
			moveStatementModal: true,
		}));
	};

	const onNodeDrag = useCallback(
		(_: React.MouseEvent<Element, MouseEvent>, node: Node) => {
			setEdges([]);

			const intersections = getIntersectingNodes(node).find((n) => n.id);

			setNodes((ns) =>
				ns.map((n) => ({
					...n,
					className: intersections?.id === n.id ? 'highlight' : '',
				}))
			);
		},
		[]
	);

	const onSave = useCallback(() => {
		if (rfInstance) {
			const flow = rfInstance.toObject();
			localStorage.setItem('flowKey', JSON.stringify(flow));
		}
	}, [rfInstance]);

	const onRestore = useCallback(() => {
		const restoreFlow = async () => {
			const getFlow = localStorage.getItem('flowKey');
			if (!getFlow) return;

			const flow = JSON.parse(getFlow);

			if (flow) {
				setNodes(flow.nodes || []);
				setEdges(flow.edges || []);
			}
		};

		restoreFlow();
	}, [setNodes]);

	const handleMoveStatement = async (move: boolean) => {
		if (move) {
			const [draggedStatement, newDraggedStatementParent] = await Promise.all([
				getStatementFromDB(draggedNodeId),
				getStatementFromDB(intersectedNodeId),
			]);
			if (!draggedStatement || !newDraggedStatementParent) return;
			await updateStatementParents(draggedStatement, newDraggedStatementParent);
		} else {
			onRestore();
		}
		setMapContext((prev) => ({
			...prev,
			moveStatementModal: !prev.moveStatementModal,
		}));
	};

	return (
		<>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				fitView
				style={{ height: `100vh` }}
				nodesDraggable={isAdmin}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeDrag={onNodeDrag}
				onNodeDragStop={onNodeDragStop}
				onInit={(reactFlowInstance) => {
					setRfInstance(reactFlowInstance);
					const flow = reactFlowInstance.toObject();
					localStorage.setItem('flowKey', JSON.stringify(flow));
				}}
			>
				<Controls />
				<Panel position="bottom-right" className="btnsPanel">
					{!isButtonVisible && (
						<div className="mainButton">
							<button onClick={handleHamburgerClick}>
								<img src={MapHamburgerIcon} alt="Hamburger" />
							</button>
						</div>
					)}
					{isButtonVisible && (
						<div className={`arc-buttons ${isButtonVisible ? 'open' : ''}`}>
							<button onClick={handleCancelClick}>
								<img src={MapCancelIcon} alt="Cancel" />
							</button>
							<button onClick={() => onLayout('TB')}>
								<img src={MapVerticalLayoutIcon} alt="vertical layout" />
							</button>
							<button onClick={() => onLayout('LR')}>
								<img src={MapHorizontalLayoutIcon} alt="horizontal layout" />
							</button>
							<button onClick={onRestore}>
								<img src={MapRestoreIcon} alt="Restore" />
							</button>
							<button onClick={onSave}>
								<img src={MapSaveIcon} alt="Save" />
							</button>
						</div>
					)}
				</Panel>
			</ReactFlow>
			{mapContext.moveStatementModal && (
				<Modal>
					<div style={{ padding: '1rem' }}>
						<h1>Are you sure you want to move statement here?</h1>
						<br />
						<div className="btnBox">
							<button
								onClick={() => handleMoveStatement(true)}
								className="btn btn--large btn--add"
							>
								Yes
							</button>
							<button
								onClick={() => handleMoveStatement(false)}
								className="btn btn--large btn--disagree"
							>
								No
							</button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
}
