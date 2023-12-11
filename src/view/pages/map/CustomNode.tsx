import { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const resultColor = "#8FF18F";
const questionColor = "#5252FD";

const backgroundColor = (type: string) =>
    type === "question"
        ? questionColor
        : type === "result"
        ? resultColor
        : "#4d4d4d";

const nodeStyle = (type: string) => {
    const style = {
        backgroundColor: backgroundColor(type),
        width: "auto",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: ".7rem",
        padding: ".5rem",
    };
    return style;
};

export default function CustomNode({ data, id }: NodeProps) {
    const [showBtns, setShowBtns] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleNodeClick = () => {
        setShowBtns((prev) => !prev);
        setShowModal(false);
    };

    const handleAddNode = () => {
        setShowModal((prev) => !prev);
    };

    return (
        <>
            <div
                onClick={handleNodeClick}
                data-id={id}
                style={nodeStyle(data.type)}
            >
                {data?.label}
            </div>
            {showBtns && (
                <div
                    onClick={handleAddNode}
                    style={{
                        color: "black",
                        position: "absolute",
                        bottom: -20,
                    }}
                >
                    +
                </div>
            )}

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}
