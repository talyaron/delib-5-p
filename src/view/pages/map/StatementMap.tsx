import { useEffect } from "react";

// Third party imports

// React Flow imports
import ReactFlow, { Controls, useNodesState, useEdgesState } from "reactflow";
import "./reactFlow.scss";
import "reactflow/dist/style.css";

// Helper functions
import { createInitialNodesAndEdges, getLayoutedElements } from "./mapCont";

// Custom components
import CustomNode from "./CustomNode";

// Custom hooks
import { Results } from "delib-npm";

const nodeTypes = {
    custom: CustomNode,
};

interface Props {
    topResult: Results;
}

export default function StatementMap({ topResult }: Props) {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    useEffect(() => {
        const { nodes: createdNodes, edges: createdEdges } =
            createInitialNodesAndEdges(topResult);

        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(createdNodes, createdEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [topResult]);

    return (
        <ReactFlow
            elementsSelectable={false}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
        >
            <Controls />
        </ReactFlow>
    );
}
