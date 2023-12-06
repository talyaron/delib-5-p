import React from "react";
import { NodeProps } from "reactflow";
import { nodeHeight, nodeWidth } from "./StatementMap";
import { Results } from "delib-npm";

const resultColor = "#8FF18F";
const questionColor = "#5252FD";

const backgroundColor = (isOption: boolean) =>
    isOption ? resultColor : questionColor;

const nodeStyle = (isOption: boolean) => {
    const style = {
        backgroundColor: backgroundColor(isOption),
        width: nodeWidth,
        height: nodeHeight,
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
