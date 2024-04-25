import dagre from "@dagrejs/dagre";
import { Results, Statement } from "delib-npm";
import { Edge, Node, Position } from "reactflow";

const position = { x: 0, y: 0 };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    nodeHeight: number,
    nodeWidth: number,
    direction = "TB",
) => {
    const isHorizontal = direction === "LR";

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node, index) => {
        if (index === 0) {
            dagreGraph.setNode(node.id, {
                width: nodeWidth * 1.5,
                height: nodeHeight * 1.5,
            });
        } else {
            dagreGraph.setNode(node.id, {
                width: nodeWidth,
                height: nodeHeight,
            });
        }
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

export const nodeOptions = (result: Results, parentStatement: "top" | Statement) => {
    return {
        id: result.top.statementId,
        data: {
            result,
            parentStatement,
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

export const createInitialNodesAndEdges = (result: Results | undefined) => {
    try {
        if (!result) return { nodes: [], edges: [] };
        const edges: Edge[] = [];

        const nodes: Node[] = [nodeOptions(result, "top")];

        if (!result.sub || result?.sub?.length === 0) return { nodes, edges };

        createNodes(result.sub, result.top);

        function createNodes(results: Results[], parentStatement: Statement) {
            results.forEach((sub) => {
                nodes.push(nodeOptions(sub, parentStatement));

                edges.push(edgeOptions(sub, parentStatement.statementId));

                if (sub.sub && sub.sub.length > 0) {
                    createNodes(sub.sub, sub.top);
                }
            });
        }

        return { nodes, edges };
    } catch (error) {
        console.error("createInitialElements() failed: ", error);

        return { nodes: [], edges: [] };
    }
};
