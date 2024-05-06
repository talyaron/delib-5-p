import { useCallback, useEffect, useState } from "react";

// Styles
import "../../../../statement/components/createStatementModal/CreateStatementModal.scss";

// Third party imports
import { Results } from "delib-npm";

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
} from "reactflow";
import "../mapHelpers/reactFlow.scss";
import "reactflow/dist/style.css";

// Helper functions
import {
    createInitialNodesAndEdges,
    getLayoutElements,
} from "../mapHelpers/customNodeCont";
import { updateStatementParents } from "../../../../../../controllers/db/statements/setStatements";
import { getStatementFromDB } from "../../../../../../controllers/db/statements/getStatement";

// Hooks
import { useMapContext } from "../../../../../../controllers/hooks/useMap";

// Custom components
import CustomNode from "./CustomNode";
import MoveStatementModal from "./MoveStatementModal";

const nodeTypes = {
    custom: CustomNode,
};

interface Props {
    topResult: Results;
    getSubStatements: () => Promise<void>;
}

export default function TreeChart({
    topResult,
    getSubStatements,
}: Readonly<Props>) {
    // React Flow hooks
    const { getIntersectingNodes } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Use State
    const [tempEdges, setTempEdges] = useState(edges);
    const [rfInstance, setRfInstance] = useState<null | ReactFlowInstance<
        any,
        any
    >>(null);
    const [intersectedNodeId, setIntersectedNodeId] = useState("");
    const [draggedNodeId, setDraggedNodeId] = useState("");

    // Context
    const { mapContext, setMapContext } = useMapContext();

    useEffect(() => {
        const { nodes: createdNodes, edges: createdEdges } =
            createInitialNodesAndEdges(topResult);

        const { nodes: layoutNodes, edges: layoutEdges } = getLayoutElements(
            createdNodes,
            createdEdges,
            mapContext.nodeHeight,
            mapContext.nodeWidth,
            mapContext.direction,
        );

        setNodes(layoutNodes);
        setEdges(layoutEdges);
        setTempEdges(layoutEdges);

        setTimeout(() => {
            onSave();
        }, 500);
    }, [topResult]);

    const onLayout = useCallback(
        (direction: "TB" | "LR") => {
            const width = direction === "TB" ? 50 : 90;
            const height = direction === "TB" ? 50 : 30;

            setMapContext((prev) => ({
                ...prev,
                targetPosition:
                    direction === "TB" ? Position.Top : Position.Left,
                sourcePosition:
                    direction === "TB" ? Position.Bottom : Position.Right,
                nodeWidth: width,
                nodeHeight: height,
                direction,
            }));

            const { nodes: layoutNodes, edges: layoutEdges } =
                getLayoutElements(nodes, edges, height, width, direction);

            setNodes([...layoutNodes]);
            setEdges([...layoutEdges]);
        },
        [nodes, edges],
    );

    const onNodeDragStop = async (
        _: React.MouseEvent<Element, MouseEvent>,
        node: Node,
    ) => {
        const intersectedNode = getIntersectingNodes(node).find((n) => n.id);

        if (!intersectedNode) return setEdges(tempEdges);

        setDraggedNodeId(node.id);
        setIntersectedNodeId(intersectedNode.id);

        setMapContext((prev) => ({
            ...prev,
            moveStatementModal: true,
        }));
    };

    const onNodeDrag = useCallback(
        (_: React.MouseEvent<Element, MouseEvent>, node: Node) => {
            setEdges([]);

            const intersectedNode = getIntersectingNodes(node).find(
                (n) => n.id,
            );

            if (!intersectedNode) return;

            setNodes((ns) =>
                ns.map((n) => ({
                    ...n,
                    className: intersectedNode.id === n.id ? "highlight" : "",
                })),
            );
        },
        [getIntersectingNodes, setNodes],
    );

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem("flowKey", JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const getFlow = localStorage.getItem("flowKey");
            if (!getFlow) return;

            const flow = JSON.parse(getFlow);

            if (flow) {
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
            }
        };

        restoreFlow();
    }, [setNodes, setEdges]);

    const handleMoveStatement = async (move: boolean) => {
        if (move) {
            // Get dragged statement and new parent statement id's from DB
            const [draggedStatement, newDraggedStatementParent] =
                await Promise.all([
                    getStatementFromDB(draggedNodeId),
                    getStatementFromDB(intersectedNodeId),
                ]);
            if (!draggedStatement || !newDraggedStatementParent) return;

            // Update dragged statement parent array in DB
            await updateStatementParents(
                draggedStatement,
                newDraggedStatementParent,
            );

            // Get updated top result and sub statements
            await getSubStatements();
        } else {
            onRestore();
        }

        // Close Modal
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onInit={(reactFlowInstance) => {
                    setRfInstance(reactFlowInstance);
                    const flow = reactFlowInstance.toObject();
                    localStorage.setItem("flowKey", JSON.stringify(flow));
                }}
            >
                <Controls />
                <Panel position="bottom-right" style={{ marginBottom: "2rem" }}>
                    <div className="btns">
                        <button
                            className="btn btn--agree"
                            onClick={() => onLayout("TB")}
                        >
                            vertical layout
                        </button>
                        <button
                            className="btn btn--agree"
                            onClick={() => onLayout("LR")}
                        >
                            horizontal layout
                        </button>
                        <button onClick={onRestore} className="btn btn--agree">
                            Restore
                        </button>
                        <button onClick={onSave} className="btn btn--agree">
                            Save
                        </button>
                    </div>
                </Panel>
            </ReactFlow>

            {mapContext.moveStatementModal && (
                <MoveStatementModal handleMoveStatement={handleMoveStatement} />
            )}
        </>
    );
}
