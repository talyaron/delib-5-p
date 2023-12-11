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
        color: type === "result" ? "black" : "white",
        width: "auto",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: ".7rem",
        padding: ".5rem",
        cursor: "pointer",
    };
    return style;
};

export default function CustomNode({ data, id }: NodeProps) {
    // const navigate = useNavigate();
    const [showBtns, setShowBtns] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleNodeClick = () => {
        setShowBtns((prev) => !prev);
    };

    const handleAddNode = () => {
        setShowModal(true);
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
                        cursor: "pointer",
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
