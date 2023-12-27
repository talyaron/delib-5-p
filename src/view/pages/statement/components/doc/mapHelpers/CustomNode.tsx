import { useEffect, useState } from "react";

// Third party
import { Handle, NodeProps } from "reactflow";
import { useNavigate } from "react-router-dom";

// Hooks
import { useMapContext } from "../../../../../../functions/hooks/useMap";

// Icons
import PlusIcon from "../../../../../components/icons/PlusIcon";

// Statements functions
import { statementTitleToDisplay } from "../../../../../../functions/general/helpers";
import { Statement } from "delib-npm";

function calculateFontSize(text: string) {
    // Set the base font size and a multiplier for adjusting based on text length
    const baseFontSize = 20;
    const fontSizeMultiplier = 0.2;

    // Calculate the font size based on the length of the text
    const fontSize = Math.max(
        baseFontSize - fontSizeMultiplier * text.length,
        8
    );

    return `${fontSize}px`;
}

const resultColor = "#8FF18F";
const questionColor = "#5252FD";

const backgroundColor = (type: string) =>
    type === "question"
        ? questionColor
        : type === "result"
        ? resultColor
        : "gold";

const nodeStyle = (
    parentData: any,
    statementType: string,
    nodeTitle: string
) => {
    const style = {
        backgroundColor:
            parentData === "top" ? "darkblue" : backgroundColor(statementType),
        color: statementType === "question" ? "white" : "black",
        height: 70,
        width: 100,
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

    const { result, parentData } = data;

    const { statementId, statement, statementType } = result.top;

    const { shortVersion: nodeTitle } = statementTitleToDisplay(statement, 80);

    const { mapContext, setMapContext } = useMapContext();

    const [showBtns, setShowBtns] = useState(false);

    const handleNodeClick = () => {
        console.log(parentData);
        if (!showBtns) {
            setShowBtns((prev) => !prev);
        } else {
            navigate(`/statement/${statementId}/chat`, {
                state: { from: window.location.pathname },
            });
        }
    };

    const handleAddChildNode = () => {
        console.log("handleAddChildNode");
        setMapContext((prev) => ({
            ...prev,
            showModal: true,
            parentData: result.top,
            isOption: statementType !== "option",
            isQuestion: statementType !== "question",
        }));
    };

    const handleAddSiblingNode = () => {
        console.log("handleAddSiblingNode");
        setMapContext((prev) => ({
            ...prev,
            showModal: true,
            parentData: parentData,
            isOption: statementType !== "option",
            isQuestion: statementType !== "question",
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
                    ...nodeStyle(parentData, statementType, nodeTitle),
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
                            right: 0,
                            bottom: "-2.2rem",
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
                            left: "-2.2rem",
                            top: 0,
                        }}
                    >
                        <PlusIcon color="#9687F4" />
                    </div>
                    {/* <IconButton
                        onClick={handleAddChildNode}
                        size="small"
                        sx={{
                            position: "absolute",
                            cursor: "pointer",
                            right: -10,
                            bottom: -25,
                            zIndex: 100,
                            width: 20,
                            height: 20,
                        }}
                        color="secondary"
                    >
                        <AddIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                    <IconButton
                        onClick={handleAddSiblingNode}
                        size="small"
                        sx={{
                            position: "absolute",
                            cursor: "pointer",
                            left: -25,
                            top: 0,
                            width: 20,
                            height: 20,
                        }}
                        color="secondary"
                    >
                        <AddIcon sx={{ fontSize: 12 }} />
                    </IconButton> */}
                </>
            )}

            <Handle type="target" position={mapContext.targetPosition} />
            <Handle type="source" position={mapContext.sourcePosition} />
        </>
    );
}
