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
import ArrowBackIosIcon from "../../icons/ArrowBackIosIcon";
import ScreenFadeInOut from "../../components/animation/ScreenFadeInOut";

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
        <ScreenFadeInOut className="page" duration={1}>
            <div
                className="page__header"
                style={{ flexDirection: "row", padding: 10 }}
            >
                <h1>{statement.top.statement}</h1>
                <b>-</b>
                <h2>Mind Map</h2>
                <div
                    onClick={() =>
                        navigate("/home/map", {
                            state: { from: window.location.pathname },
                        })
                    }
                    style={{
                        cursor: "pointer",
                        position: "absolute",
                        left: 20,
                    }}
                >
                    <ArrowBackIosIcon />
                </div>
            </div>
            <div style={{ height: "100vh", width: "100%" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    fitView
                    onNodeClick={(event, node) => {
                        navigate(`/statement/${node.id}/chat`, {
                            state: { from: window.location.pathname },
                        });
                    }}
                >
                    <Controls />
                </ReactFlow>
            </div>
        </ScreenFadeInOut>
    );
}
