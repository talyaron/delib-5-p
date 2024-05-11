import { expect, test } from "vitest";

import {
    createInitialNodesAndEdges,
    edgeOptions,
    edgeStyle,
    getLayoutedElements,
} from "./customNodeCont";
import { Results, Statement } from "delib-npm";
import { Edge, Node } from "reactflow";

test("createInitialNodesAndEdges", () => {
    const result = undefined;
    const { nodes, edges } = createInitialNodesAndEdges(result);
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
});

test("should return nodes and edges for a valid result with no sub-results", () => {
    const result = {
        top: { statementId: "1" } as Statement,
        sub: [],
    };

    const { nodes, edges } = createInitialNodesAndEdges(result);
    expect(nodes.length).toBe(1);
    expect(edges.length).toBe(0);
    expect(nodes[0].data.result.top.statementId).toBe("1");
    expect(nodes[0].data.parentStatement).toBe("top");
});

test("should return nodes and edges for a valid result with sub-results", () => {
    const result: Results = {
        top: { statementId: "1" } as Statement,
        sub: [
            {
                top: { statementId: "2" } as Statement,
                sub: [],
            },
        ],
    };
    const { nodes, edges } = createInitialNodesAndEdges(result);
    expect(nodes.length).toBe(2);
    expect(edges.length).toBe(1);
    expect(nodes[0].data.result.top.statementId).toBe("1");
    expect(nodes[0].data.parentStatement).toBe("top");
    expect(nodes[1].data.result.top.statementId).toBe("2");
    expect(nodes[1].data.parentStatement.statementId).toBe("1");
    expect(edges[0].source).toBe("1");
    expect(edges[0].target).toBe("2");
});

test("should return correct edge object with different parent and child IDs", () => {
    const result: Results = {
        top: { statementId: "1" } as Statement,
        sub: [
            {
                top: { statementId: "12" } as Statement,
                sub: [],
            },
        ],
    };
    const parentId = "2";
    const edge = edgeOptions(result.sub[0], parentId);
    expect(edge.id).toBe(`e${parentId}-${result.sub[0].top.statementId}`);
    expect(edge.source).toBe(parentId);
    expect(edge.target).toBe(result.sub[0].top.statementId);
    expect(edge.style).toEqual(edgeStyle);
});

test("should return empty nodes and edges arrays if input nodes and edges arrays are empty", () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeHeight = 100;
    const nodeWidth = 100;
    const direction = "TB";

    const result = getLayoutedElements(
        nodes,
        edges,
        nodeHeight,
        nodeWidth,
        direction,
    );

    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
});

test("should correctly layout nodes and edges in a horizontal direction", () => {
    const nodes: Node[] = [
        { id: "1", position: { x: 0, y: 0 }, type: "default", data: {} },
        { id: "2", position: { x: 0, y: 0 }, type: "default", data: {} },
        { id: "3", position: { x: 0, y: 0 }, type: "default", data: {} },
    ];
    const edges: Edge[] = [
        { id: "e1", source: "1", target: "2", type: "smoothstep" },
        { id: "e2", source: "2", target: "3", type: "smoothstep" },
    ];
    const nodeHeight = 100;
    const nodeWidth = 100;
    const direction = "LR";

    const result = getLayoutedElements(
        nodes,
        edges,
        nodeHeight,
        nodeWidth,
        direction,
    );

    expect(result.nodes.length).toBeGreaterThan(0);
    expect(result.edges.length).toBeGreaterThan(0);
});
