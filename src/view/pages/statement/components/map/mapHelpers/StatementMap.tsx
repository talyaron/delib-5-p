import { useCallback, useEffect } from "react";

// Third party imports
import { Results } from "delib-npm";

// React Flow imports
import ReactFlow, {
    Controls,
    useNodesState,
    useEdgesState,
    Panel,
    Position,
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

const nodeTypes = {
    custom: CustomNode,
};

interface Props {
    topResult: Results | undefined;
}

export default function StatementMap({ topResult }: Props) {
    if(!topResult) return null;
    
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

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
                direction,
                mapContext.nodeHeight,
                mapContext.nodeWidth,
            );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
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
                getLayoutedElements(nodes, edges, direction, height, width);

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges],
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            style={{ height: `100vh` }}
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
