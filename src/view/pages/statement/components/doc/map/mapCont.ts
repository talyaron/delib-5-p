import dagre from "@dagrejs/dagre";
import { Results } from "delib-npm";
import { Edge, Node, Position } from "reactflow";

const position = { x: 0, y: 0 };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "TB",
    nodeHeight: number,
    nodeWidth: number
) => {
    const isHorizontal = direction === "LR";

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

        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

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

const edgeStyle = {
    stroke: "#000",
    strokeWidth: 1,
    strokeOpacity: 0.5,
};

const nodeOptions = (result: Results, parentId: string) => {
    return {
        id: result.top.statementId,
        data: {
            label: result.top.statement,
            type: result.top.statementType,
            parentId,
        },
        position,
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

        const nodes: Node[] = [nodeOptions(result, "top")];

        if (!result.sub) return { nodes, edges };

        if (result?.sub?.length === 0) {
            return { nodes, edges };
        } else {
            createNodes(result.sub, result.top.statementId);
        }

        function createNodes(results: Results[], parentId: string) {
            results.forEach((sub) => {
                nodes.push(nodeOptions(sub, parentId));

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
