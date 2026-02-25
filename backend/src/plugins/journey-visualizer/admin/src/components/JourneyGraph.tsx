import React, { useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Position,
    type Node,
    type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const H_GAP = 60;
const V_GAP = 100;

function getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
    direction = 'TB'
): { nodes: Node[]; edges: Edge[] } {
    if (nodes.length === 0) return { nodes, edges };

    const adj = new Map<string, string[]>();
    for (const n of nodes) adj.set(n.id, []);
    for (const e of edges) adj.get(e.source)?.push(e.target);

    const hasIncoming = new Set(edges.map((e) => e.target));
    const roots = nodes.filter((n) => !hasIncoming.has(n.id)).map((n) => n.id);
    const startQueue = roots.length > 0 ? [...roots] : [nodes[0].id];

    const level = new Map<string, number>();
    for (const r of startQueue) level.set(r, 0);
    const queue = [...startQueue];
    let head = 0;
    while (head < queue.length) {
        const curr = queue[head++];
        const currLevel = level.get(curr) ?? 0;
        for (const next of adj.get(curr) ?? []) {
            if (!level.has(next)) {
                level.set(next, currLevel + 1);
                queue.push(next);
            }
        }
    }

    for (const n of nodes) {
        if (!level.has(n.id)) level.set(n.id, 0);
    }

    const byLevel = new Map<number, string[]>();
    for (const [id, lv] of level) {
        if (!byLevel.has(lv)) byLevel.set(lv, []);
        byLevel.get(lv)!.push(id);
    }

    const isVertical = direction === 'TB';

    const layoutedNodes = nodes.map((node) => {
        const lv = level.get(node.id) ?? 0;
        const row = byLevel.get(lv) ?? [];
        const idx = row.indexOf(node.id);
        const rowCount = row.length;
        const totalRowWidth = rowCount * NODE_WIDTH + (rowCount - 1) * H_GAP;
        const offsetX = idx * (NODE_WIDTH + H_GAP) - totalRowWidth / 2 + NODE_WIDTH / 2;

        return {
            ...node,
            targetPosition: isVertical ? Position.Top : Position.Left,
            sourcePosition: isVertical ? Position.Bottom : Position.Right,
            position: isVertical
                ? { x: offsetX, y: lv * (NODE_HEIGHT + V_GAP) }
                : { x: lv * (NODE_WIDTH + H_GAP), y: idx * (NODE_HEIGHT + V_GAP) },
        };
    });

    return { nodes: layoutedNodes, edges };
}

const typeColors: Record<string, string> = {
    question: '#4945FF',   // Strapi primary blue
    info: '#328048',       // Green
    form: '#D9822B',       // Orange
    default: '#4A4A6A',    // Dark gray
};

interface JourneyGraphProps {
    nodes: any[];
    edges: any[];
}

export function JourneyGraph({ nodes: rawNodes, edges: rawEdges }: JourneyGraphProps) {
    // Prepare styled nodes
    const styledNodes: Node[] = useMemo(() => {
        return rawNodes.map((node: any) => ({
            id: node.id,
            type: 'default',
            data: {
                label: node.data?.label || node.label || 'Untitled',
            },
            position: { x: 0, y: 0 },
            style: {
                background: typeColors[node.data?.screenType] || typeColors.default,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: 600,
                width: NODE_WIDTH,
                textAlign: 'center' as const,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
        }));
    }, [rawNodes]);

    const styledEdges: Edge[] = useMemo(() => {
        return rawEdges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
            animated: edge.label === 'Always',
            style: {
                stroke: edge.label === 'Always' ? '#8E8EA9' : '#4945FF',
                strokeWidth: 2,
            },
            labelStyle: { fontSize: '11px', fontWeight: 500, fill: '#32324D' },
            labelBgStyle: { fill: '#F6F6F9', fillOpacity: 0.9 },
            labelBgPadding: [6, 4] as [number, number],
            labelBgBorderRadius: 4,
        }));
    }, [rawEdges]);

    // Apply layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
        () => getLayoutedElements(styledNodes, styledEdges, 'TB'),
        [styledNodes, styledEdges]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

    return (
        <div style={{ width: '100%', height: '65vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-left"
            >
                <Background gap={16} size={1} color="#E0E0E0" />
                <Controls />
                <MiniMap
                    nodeColor={(node: Node) => {
                        const type = (node as any).data?.screenType;
                        return typeColors[type] || typeColors.default;
                    }}
                    style={{ borderRadius: 8 }}
                />
            </ReactFlow>
        </div>
    );
}
