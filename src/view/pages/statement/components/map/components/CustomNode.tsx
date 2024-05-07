import { useEffect, useState } from "react";

// Third party
import { Handle, NodeProps } from "reactflow";
import { useNavigate } from "react-router-dom";

// Hooks
import { useMapContext } from "../../../../../../controllers/hooks/useMap";

// Icons
import PlusIcon from "../../../../../../assets/icons/plusIcon.svg?react";

// Statements functions
import { statementTitleToDisplay } from "../../../../../../controllers/general/helpers";
import useStatementColor from "../../../../../../controllers/hooks/useStatementColor";
import { nodeStyle } from "../mapHelpers/customNodeCont";

export default function CustomNode({ data }: NodeProps) {
    const navigate = useNavigate();

    const { result, parentStatement } = data;

    const { statementId, statement, statementType } = result.top;

    const { shortVersion: nodeTitle } = statementTitleToDisplay(statement, 80);

    const statementColor = useStatementColor(statementType);

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
            isOption: statementType !== "option",
            isQuestion: statementType !== "question",
        }));
    };

    const handleAddSiblingNode = () => {
        setMapContext((prev) => ({
            ...prev,
            showModal: true,
            parentStatement: parentStatement,
            isOption: statementType === "option",
            isQuestion: statementType === "question",
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
                    textAlign: "center",
                    wordBreak: "break-word",
                }}
                className="node__content"
            >
                {nodeTitle}
            </button>
            {showBtns && (
                <>
                    <button
                        className="addIcon"
                        onClick={handleAddChildNode}
                        style={{
                            right:
                                mapContext.direction === "TB" ? 0 : "-1.3rem",
                            bottom:
                                mapContext.direction === "TB" ? "-1.3rem" : 0,
                        }}
                    >
                        <PlusIcon />
                    </button>

                    <button
                        className="addIcon"
                        onClick={handleAddSiblingNode}
                        style={{
                            left: mapContext.direction === "TB" ? "-1.3rem" : 0,
                            top: mapContext.direction === "TB" ? 0 : "-1.3rem",
                        }}
                    >
                        <PlusIcon />
                    </button>
                </>
            )}

            <Handle type="target" position={mapContext.targetPosition} />
            <Handle type="source" position={mapContext.sourcePosition} />
        </>
    );
}
