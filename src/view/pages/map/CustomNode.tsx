import React from "react";
import { NodeProps } from "reactflow";

const resultColor = "#8FF18F";
const questionColor = "#5252FD";

const backgroundColor = (isOption: boolean) =>
    isOption ? resultColor : questionColor;

const nodeStyle = (isOption: boolean) => {
    const style = {
        backgroundColor: backgroundColor(isOption),
        width: "auto",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: ".7rem",
    };
    return style;
};

export default function CustomNode({ data }: NodeProps) {
    return <div style={nodeStyle(data.isOption)}>{data?.label}</div>;
}
