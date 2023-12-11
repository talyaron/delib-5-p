import dagre from "@dagrejs/dagre";
import { Results } from "delib-npm";
import { Edge, Node, Position } from "reactflow";

const position = { x: 0, y: 0 };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 50;
const nodeHeight = 50;

export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "TB"
) => {
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        node.targetPosition = Position.Top;
        node.sourcePosition = Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

// const resultColor = "#8FF18F";
// const questionColor = "#5252FD";

// const backgroundColor = (res: Results) =>
//     res.top.statementType === "result"
//         ? resultColor
//         : res.top.statementType === "question"
//         ? questionColor
//         : "#b7b7b7";

// const nodeStyle = (result: Results) => {
//     const style = {
//         backgroundColor: backgroundColor(result),
//         color: result.top.statementType === "result" ? "black" : "white",
//         width: "auto",
//         height: "auto",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontSize: ".7rem",
//         border: "none",
//         outline: "none",
//         cursor: "pointer",
//     };
//     return style;
// };

const edgeStyle = {
    stroke: "#000",
    strokeWidth: 1,
    strokeOpacity: 0.5,
};

const nodeOptions = (result: Results) => {
    return {
        id: result.top.statementId,
        data: { label: result.top.statement, type: result.top.statementType },
        position,
        // style: nodeStyle(result),
        type: "custom",
    };
};

const edgeOptions = (result: Results, parentId: string): Edge => {
    return {
        id: `e${parentId}-${result.top.statementId}`,
        source: parentId,
        target: result.top.statementId,
        style: edgeStyle,
    };
};
export const createInitialNodesAndEdges = (result: Results) => {
    try {
        const edges: Edge[] = [];

        const nodes: Node[] = [nodeOptions(result)];

        if (!result.sub) return { nodes, edges };

        if (result?.sub?.length === 0) {
            return { nodes, edges };
        } else {
            result.sub.forEach((sub) => {
                nodes.push(nodeOptions(sub));

                edges.push(edgeOptions(sub, result.top.statementId));

                if (sub.sub) {
                    createNodes(sub.sub, sub.top.statementId);
                }
            });
        }

        function createNodes(results: Results[], parentId: string) {
            results.forEach((sub) => {
                nodes.push(nodeOptions(sub));

                edges.push(edgeOptions(sub, parentId));

                if (sub.sub && sub.sub.length > 0) {
                    createNodes(sub.sub, sub.top.statementId);
                }
            });
        }

        return { nodes, edges };
    } catch (error) {
        console.log("createInitialElements() failed: ", error);
        return { nodes: [], edges: [] };
    }
};

export const testNodes: Node[] = [
    {
        id: "1",
        data: { label: "input", isOption: true },
        position,
    },
    {
        id: "2",
        data: { label: "node 2", isOption: false },
        position,
    },
    {
        id: "2a",
        data: { label: "node 2a", isOption: true },
        position,
    },
    {
        id: "2b",
        data: { label: "node 2b", isOption: false },
        position,
    },
    {
        id: "2c",
        data: { label: "node 2c", isOption: true },
        position,
    },
    {
        id: "2d",
        data: { label: "node 2d", isOption: false },
        position,
    },
    {
        id: "3",
        data: { label: "node 3", isOption: true },
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

export const testEdges: Edge[] = [
    { id: "e12", source: "1", target: "2", animated: true },
    { id: "e13", source: "1", target: "3", animated: true },
    { id: "e22a", source: "2", target: "2a", animated: true },
    { id: "e22b", source: "2", target: "2b", animated: true },
    { id: "e22c", source: "2", target: "2c", animated: true },
    { id: "e2c2d", source: "2c", target: "2d", animated: true },
    { id: "e45", source: "4", target: "5", animated: true },
    { id: "e56", source: "5", target: "6", animated: true },
    { id: "e57", source: "5", target: "7", animated: true },
];
