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
import { createInitialNodesAndEdges, getLayoutedElements } from "./mapCont";

// Custom components
import CustomNode from "./CustomNode";
import { useMapContext } from "../../../../../../functions/hooks/useMap";

const nodeTypes = {
    custom: CustomNode,
};

interface Props {
    topResult: Results;
}

export default function StatementMap({ topResult }: Props) {
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
                mapContext.nodeWidth
            );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [topResult]);

    const onLayout = useCallback(
        (direction: string) => {
            const width = direction === "TB" ? 80 : 120;
            const height = direction === "TB" ? 80 : 50;

            setMapContext((prev) => ({
                ...prev,
                targetPosition:
                    direction === "TB" ? Position.Top : Position.Left,
                sourcePosition:
                    direction === "TB" ? Position.Bottom : Position.Right,
                nodeWidth: width,
                nodeHeight: height,
            }));

            const { nodes: layoutedNodes, edges: layoutedEdges } =
                getLayoutedElements(nodes, edges, direction, height, width);

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges]
    );

    return (
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
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
