import React, { useEffect } from "react";

// Third party imports
import { useNavigate, useParams } from "react-router-dom";

// React Flow imports
import ReactFlow, {
    ConnectionLineType,
    Controls,
    useNodesState,
    useEdgesState,
} from "reactflow";
import "./reactFlow.scss";
import "reactflow/dist/style.css";

// Helper functions
import { createInitialNodesAndEdges, getLayoutedElements } from "./mapCont";

// Custom hooks
import useSortStatements from "../../../functions/hooks/useSortStatements";

export default function StatementMap() {
    const { statementId } = useParams();
    const results = useSortStatements();
    const navigate = useNavigate();

    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    const statement = results.find(
        (state) => state.top.statementId === statementId
    );

    if (!statement) return <div className="center">Statement not found</div>;

    useEffect(() => {
        const { nodes: createdNodes, edges: createdEdges } =
            createInitialNodesAndEdges(statement);

        const { nodes: layoutedNodes, edges: layoutedEdges } =
            getLayoutedElements(createdNodes, createdEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [statementId]);

    return (
        <div className="center">
            <h1>Mind Map</h1>
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
