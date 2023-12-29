import { useEffect, useState } from "react";

// Third party
import { Handle, NodeProps } from "reactflow";
import { useNavigate } from "react-router-dom";

// Hooks
import { useMapContext } from "../../../../../../functions/hooks/useMap";

// Icons
import PlusIcon from "../../../../../components/icons/PlusIcon";

// Statements functions
import { calculateFontSize, statementTitleToDisplay } from "../../../../../../functions/general/helpers";



const resultColor = "#8FF18F";
const questionColor = "#5252FD";

const backgroundColor = (type: string) =>
    type === "question"
        ? questionColor
        : type === "result"
        ? resultColor
        : "gold";

const nodeStyle = (
    parentStatement: any,
    statementType: string,
    nodeTitle: string
) => {
    const style = {
        backgroundColor:
            parentStatement === "top" ? "darkblue" : backgroundColor(statementType),
        color: statementType === "question" ? "white" : "black",
        height: 40,
        width: 70,
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: ".5rem",
        cursor: "pointer",
        fontSize: calculateFontSize(nodeTitle),
    };
    return style;
};

export default function CustomNode({ data }: NodeProps) {
    const navigate = useNavigate();

    const { result, parentStatement } = data;

    const { statementId, statement, statementType } = result.top;

    const { shortVersion: nodeTitle } = statementTitleToDisplay(statement, 80);

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
            <div
                onClick={handleNodeClick}
                data-id={statementId}
                style={{
                    ...nodeStyle(parentStatement, statementType, nodeTitle),
                    textAlign: "center",
                    wordBreak: "break-word",
                }}
            >
                {nodeTitle}
            </div>
            {showBtns && (
                <>
                    <div
                        className="addIcon"
                        onClick={handleAddChildNode}
                        style={{
                            position: "absolute",
                            cursor: "pointer",
                            right:
                                mapContext.direction === "TB" ? 0 : "-1.8rem",
                            bottom:
                                mapContext.direction === "TB" ? "-1.8rem" : 0,
                        }}
                    >
                        <PlusIcon color="#9687F4" />
                    </div>
                    <div
                        className="addIcon"
                        onClick={handleAddSiblingNode}
                        style={{
                            position: "absolute",
                            cursor: "pointer",
                            left: mapContext.direction === "TB" ? "-1.8rem" : 0,
                            top: mapContext.direction === "TB" ? 0 : "-1.8rem",
                        }}
                    >
                        <PlusIcon color="#9687F4" />
                    </div>
                </>
            )}

            <Handle type="target" position={mapContext.targetPosition} />
            <Handle type="source" position={mapContext.sourcePosition} />
        </>
    );
}
