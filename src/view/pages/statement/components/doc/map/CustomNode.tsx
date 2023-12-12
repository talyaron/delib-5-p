import { useEffect, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { useMyContext } from "../../../../../../functions/hooks/useMap";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const { showModal, setShowModal, setIsOption, setIsQuestion, setParentId } =
        useMyContext();
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
        setShowModal(true);
        setIsOption(data.type === "option");
        setIsQuestion(data.type === "question");
        setParentId(data.parentId);
    };
    const handleAddSiblingNode = () => {
        setShowModal(true);
        setIsOption(data.type !== "option");
        setIsQuestion(data.type !== "question");
        setParentId(id);
    };

    useEffect(() => {
        if (!showModal) setShowBtns(false);
    }, [showModal]);

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
                <>
                    <IconButton
                        onClick={handleAddSiblingNode}
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
                        onClick={handleAddChildNode}
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

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}
