import { useEffect, useState } from "react";
import { Handle, NodeProps } from "reactflow";
import { useMapContext } from "../../../../../../functions/hooks/useMap";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { statementTitleToDisplay } from "../../../../../../functions/general/helpers";

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

const nodeStyle = (data: any, nodeTitle: string) => {
    const style = {
        backgroundColor:
            data.parentId === "top" ? "darkblue" : backgroundColor(data.type),
        color: data.type === "question" ? "white" : "black",
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

export default function CustomNode({ data, id }: NodeProps) {
    const navigate = useNavigate();

    const { shortVersion: nodeTitle } = statementTitleToDisplay(data.label, 80);

    const { mapContext, setMapContext } = useMapContext();

    const [showBtns, setShowBtns] = useState(false);

    const handleNodeClick = () => {
        if (!showBtns) {
            setShowBtns((prev) => !prev);
        } else {
            navigate(`/statement/${id}/chat`, {
                state: { from: window.location.pathname },
            });
        }
    };

    const handleAddChildNode = () => {
        setMapContext((prev) => ({
            ...prev,
            showModal: true,
            parentId: id,
            isOption: data.type !== "option",
            isQuestion: data.type !== "question",
        }));
    };

    const handleAddSiblingNode = () => {
        setMapContext((prev) => ({
            ...prev,
            showModal: true,
            parentId: data.parentId,
            isOption: data.type !== "option",
            isQuestion: data.type !== "question",
        }));
    };

    useEffect(() => {
        if (!mapContext.showModal) setShowBtns(false);
    }, [mapContext.showModal]);

    return (
        <>
            <div
                onClick={handleNodeClick}
                data-id={id}
                style={{
                    ...nodeStyle(data, nodeTitle),
                    textAlign: "center",
                    wordBreak: "break-word",
                }}
            >
                {nodeTitle}
            </div>
            {showBtns && (
                <>
                    <IconButton
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
                    </IconButton>
                </>
            )}

            <Handle type="target" position={mapContext.targetPosition} />
            <Handle type="source" position={mapContext.sourcePosition} />
        </>
    );
}
