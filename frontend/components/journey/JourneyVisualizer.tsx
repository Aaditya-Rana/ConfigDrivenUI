'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import * as dagre from 'dagre';
import { getJourneyGraph } from '@/lib/journey';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
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
        node.targetPosition = direction === 'LR' ? Position.Left : Position.Top;
        node.sourcePosition = direction === 'LR' ? Position.Right : Position.Bottom;
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

interface JourneyVisualizerProps {
    slug: string;
}

export default function JourneyVisualizer({ slug }: JourneyVisualizerProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGraph() {
            setLoading(true);
            const data = await getJourneyGraph(slug);
            if (data) {
                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                    data.nodes,
                    data.edges,
                    'TB'
                );

                const styledNodes = layoutedNodes.map(node => ({
                    ...node,
                    style: { background: '#fff', border: '1px solid #777', padding: 10, borderRadius: 5, width: 180 }
                }));

                const styledEdges = layoutedEdges.map(edge => ({
                    ...edge,
                    animated: true,
                    style: { stroke: '#333' }
                }));

                setNodes(styledNodes);
                setEdges(styledEdges);
            }
            setLoading(false);
        }
        loadGraph();
    }, [slug, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    if (loading) return <div className="p-10 text-center">Loading Journey Graph...</div>;

    return (
        <div style={{ width: '100%', height: '80vh', border: '1px solid #ddd' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
