import { useCallback, useEffect, useState } from "react";

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
} from "reactflow";
import "./reactFlow.scss";
import "reactflow/dist/style.css";

// Helper functions
import {
    createInitialNodesAndEdges,
    getLayoutedElements,
} from "./customNodeCont";

// Custom components
import CustomNode from "./CustomNode";
import { useMapContext } from "../../../../../../functions/hooks/useMap";
import { getStatementFromDB } from "../../../../../../functions/db/statements/getStatement";
import { updateStatementDragAndDrop } from "../../../../../../functions/db/statements/setStatments";

const nodeTypes = {
    custom: CustomNode,
};

interface Props {
    topResult: Results | undefined;
}

export default function StatementMap({ topResult }: Readonly<Props>) {
    // if (!topResult) return null;

    const { getIntersectingNodes } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [tempEdges, setTempEdges] = useState(edges);

    const { mapContext, setMapContext } = useMapContext();

    useEffect(() => {
        const direction =
            mapContext.targetPosition === Position.Top ? "TB" : "LR";
        const { nodes: createdNodes, edges: createdEdges } =
            createInitialNodesAndEdges(topResult);

        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(
                createdNodes,
                createdEdges,
                mapContext.nodeHeight,
                mapContext.nodeWidth,
                direction,
            );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setTempEdges(layoutedEdges);
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

            const { nodes: layoutedNodes, edges: layoutedEdges } =
                getLayoutedElements(nodes, edges, height, width, direction);

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges],
    );

    const onNodeDragStop = async (
        _: React.MouseEvent<Element, MouseEvent>,
        node: Node,
    ) => {
        setEdges(tempEdges);

        const intersections = getIntersectingNodes(node).map((n) => n.id);

        if (intersections.length === 0) return;

        // Pop up to ask user if he is sure he wants to move the statement here
        setMapContext((prev) => ({
            ...prev,
            moveStatementModal: true,
        }));

        // TODO: Create a function that will move statement to new chosen location...
        // 1 - the function should go through topResult variable
        // 2 - find the node that need to be move
        // 3 - find where the intersecting node is located and move it in the hirarchy
        // * don't forget to change it in DB! * //

        // Get both statements from DB, and update the dragged statement parents
        const draggedStatement = await getStatementFromDB(node.id);

        const draggedStatementParent = await getStatementFromDB(
            intersections[0],
        );

        if (!draggedStatement || !draggedStatementParent) return;

        await updateStatementDragAndDrop(
            draggedStatement,
            draggedStatementParent,
        );

        window.document.location.reload();
    };

    const onNodeDrag = useCallback(
        (_: React.MouseEvent<Element, MouseEvent>, node: Node) => {
            setEdges([]);

            const intersections = getIntersectingNodes(node).map((n) => n.id);

            setNodes((ns) =>
                ns.map((n) => ({
                    ...n,
                    className: intersections.includes(n.id) ? "highlight" : "",
                })),
            );
        },
        [],
    );

    // TODO: Create an option to save the current state of the map and return to it if changes were made...

    return (
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
        >
            <Controls />
            <Panel position="bottom-right">
                <div className="btns">
                    <button onClick={() => onLayout("TB")}>
                        vertical layout
                    </button>
                    <button onClick={() => onLayout("LR")}>
                        horizontal layout
                    </button>
                </div>
            </Panel>
        </ReactFlow>
    );
}
