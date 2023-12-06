import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import ReactFlow, {
    ConnectionLineType,
    Node,
    Edge,
    Position,
    Controls,
} from "reactflow";

import "reactflow/dist/style.css";
import dagre from "@dagrejs/dagre";

import {
    createInitEdges,
    createInitialNodes,
    initialEdges,
    initialNodes,
} from "./example";
import useSortStatements from "../../../functions/hooks/useSortStatements";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const nodeWidth = 100;
export const nodeHeight = 20;

const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "TB"
) => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

export default function StatementMap() {
    const { statementId } = useParams();
    const results = useSortStatements();
    const navigate = useNavigate();

    const statement = results.find(
        (state) => state.top.statementId === statementId
    );

    if (!statement) return <div>Statement not found</div>;

    const createdNodes = createInitialNodes(statement);
    if (!createdNodes) return <div>createdNodes failed</div>;

    const createdEdges = createInitEdges(createdNodes);
    if (!createdEdges) return <div>createdEdges failed</div>;

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        createdNodes,
        createdEdges
    );

    const [nodes, setNodes] = React.useState(layoutedNodes);
    const [edges, setEdges] = React.useState(layoutedEdges);

    return (
        <div className="center">
            Statement ID - {statementId}
            <h1>{statement?.top.statement}</h1>
            <div
                style={{
                    height: "90vh",
                    width: "100vw",
                }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    fitView
                    onNodeClick={(event, node) => {
                        navigate(`/statement/${node.id}/chat`);
                    }}
                >
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}
