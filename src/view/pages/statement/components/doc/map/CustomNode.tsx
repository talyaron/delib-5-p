import { useEffect, useState } from "react";
import { Handle, NodeProps } from "reactflow";
import { useMapContext } from "../../../../../../functions/hooks/useMap";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { statementTitleToDisplay } from "../../../../../../functions/general/helpers";

const resultColor = "#8FF18F";
const questionColor = "#5252FD";

const backgroundColor = (type: string) =>
    type === "question"
        ? questionColor
        : type === "result"
        ? resultColor
        : "gold";

const nodeStyle = (type: string) => {
    const style = {
        backgroundColor: backgroundColor(type),
        color: type === "question" ? "white" : "black",
        // width: "auto",
        // maxWidth: 150,
        height: "auto",
        width: 100,
        // height: 20,
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

    const { shortVersion: nodeTitle } = statementTitleToDisplay(data.label, 80);

    const {
        showModal,
        setShowModal,
        setIsOption,
        setIsQuestion,
        setParentId,
        targetPosition,
        sourcePosition,
    } = useMapContext();
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
        setParentId(id);

        setIsOption(data.type !== "option");
        setIsQuestion(data.type !== "question");
    };

    const handleAddSiblingNode = () => {
        setShowModal(true);
        setParentId(data.parentId);

        setIsOption(data.type === "option" || data.type === "result");
        setIsQuestion(data.type === "question");
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

            <Handle type="target" position={targetPosition} />
            <Handle type="source" position={sourcePosition} />
        </>
    );
}
