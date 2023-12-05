const position = { x: 0, y: 0 };
const edgeType = "smoothstep";

import { Results } from "delib-npm";
import { Edge, Node } from "reactflow";

export const initialNodes: Node[] = [
    {
        id: "1",
        type: "input",
        data: { label: "input" },
        position,
    },
    {
        id: "2",
        data: { label: "node 2" },
        position,
        parentNode: "1",
    },
    {
        id: "2a",
        data: { label: "node 2a" },
        position,
    },
    {
        id: "2b",
        data: { label: "node 2b" },
        position,
    },
    {
        id: "2c",
        data: { label: "node 2c" },
        position,
    },
    {
        id: "2d",
        data: { label: "node 2d" },
        position,
    },
    {
        id: "3",
        data: { label: "node 3" },
        position,
    },
    // {
    //     id: "4",
    //     data: { label: "node 4" },
    //     position,
    // },
    // {
    //     id: "5",
    //     data: { label: "node 5" },
    //     position,
    // },
    // {
    //     id: "6",
    //     type: "output",
    //     data: { label: "output" },
    //     position,
    // },
    // { id: "7", type: "output", data: { label: "output" }, position },
];

export const initialEdges: Edge[] = [
    { id: "e12", source: "1", target: "2", type: edgeType, animated: true },
    { id: "e13", source: "1", target: "3", type: edgeType, animated: true },
    { id: "e22a", source: "2", target: "2a", type: edgeType, animated: true },
    { id: "e22b", source: "2", target: "2b", type: edgeType, animated: true },
    { id: "e22c", source: "2", target: "2c", type: edgeType, animated: true },
    { id: "e2c2d", source: "2c", target: "2d", type: edgeType, animated: true },
    { id: "e45", source: "4", target: "5", type: edgeType, animated: true },
    { id: "e56", source: "5", target: "6", type: edgeType, animated: true },
    { id: "e57", source: "5", target: "7", type: edgeType, animated: true },
];

export const createInitEdges = (nodes: Node[]) => {
    try {
        const edges: Edge[] = [];
        nodes.forEach((node) => {
            const children = nodes.filter((n) => n.parentNode === node.id);

            if (children.length === 0) return;

            children.forEach((child, index) => {
                edges.push({
                    id: `${index}-${node.id}-${child.id}`,
                    source: node.id,
                    target: child.id,
                    type: edgeType,
                    animated: true,
                });
            });
        });
        return edges;
    } catch (error) {
        console.log("createInitEdges() failed: ", error);
    }
};

export const createInitialNodes = (result: Results) => {
    try {
        const optionColor = "#8FF18F";
        const questionColor = "#5252FD";

        const backgroundColor = (res: Results) =>
            res.top.statementType === "option" ? optionColor : questionColor;

        const nodes: Node[] = [
            {
                id: result.top.statementId,
                data: { label: result.top.statement },
                position,
                style: {
                    backgroundColor: backgroundColor(result),
                    color: "white",
                },
            },
        ];

        if (!result.sub) return nodes;

        if (result?.sub?.length === 0) {
            return nodes;
        } else {
            result.sub.forEach((sub) => {
                nodes.push({
                    id: sub.top.statementId,
                    data: { label: sub.top.statement },
                    position,
                    parentNode: result.top.statementId,
                    style: {
                        backgroundColor: backgroundColor(sub),
                        color: "white",
                    },
                });
                if (sub.sub) {
                    createNodes(sub.sub, sub.top.statementId);
                }
            });
        }

        function createNodes(results: Results[], parentId: string) {
            results.forEach((sub) => {
                nodes.push({
                    id: sub.top.statementId,
                    data: { label: sub.top.statement },
                    position,
                    parentNode: parentId,
                    style: {
                        backgroundColor: backgroundColor(sub),
                        color: "white",
                    },
                });
                if (sub.sub && sub.sub.length > 0) {
                    createNodes(sub.sub, sub.top.statementId);
                }
            });
        }

        return nodes;
    } catch (error) {
        console.log("createInitialElements() failed: ", error);
    }
};
