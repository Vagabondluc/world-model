
import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { GraphData } from '../../../types/graph';
import { ForceSimulation, SimNode } from '../../../utils/forceSimulation';

// Component props
interface GraphRendererProps {
    data: GraphData;
    onNodeClick?: (nodeId: string) => void;
}

// Styling
const styles = {
    container: css`
        width: 100%;
        height: 100%;
        min-height: 500px;
        background-color: var(--parchment-bg);
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        position: relative;
        overflow: hidden;
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
    `,
    canvas: css`
        display: block;
    `,
};

export const GraphRenderer: FC<GraphRendererProps> = ({ data, onNodeClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const simulationRef = useRef<ForceSimulation | null>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 }); // pan & zoom
    
    const dragState = useRef<{ isDragging: boolean; isPanning: boolean; node: SimNode | null; lastPos: {x: number; y: number} }>({
        isDragging: false,
        isPanning: false,
        node: null,
        lastPos: { x: 0, y: 0 },
    });
    
    // Initialize simulation nodes when data changes
    useEffect(() => {
        const { width, height } = containerRef.current?.getBoundingClientRect() || { width: 500, height: 500 };
        simulationRef.current = new ForceSimulation(data, width, height);
    }, [data]);

    // Rendering loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            if (!simulationRef.current) return;
            
            simulationRef.current.tick(dragState.current.node);
            
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width / 2 + transform.x, canvas.height / 2 + transform.y);
            ctx.scale(transform.k, transform.k);
            
            // Draw links
            ctx.strokeStyle = 'rgba(58, 45, 29, 0.3)';
            ctx.lineWidth = 1.5 / transform.k;
            simulationRef.current.links.forEach(link => {
                ctx.beginPath();
                ctx.moveTo(link.source.x, link.source.y);
                ctx.lineTo(link.target.x, link.target.y);
                ctx.stroke();
            });

            // Draw nodes
            simulationRef.current.nodes.forEach(node => {
                const radius = node.val * 5 + 5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = '#6f4e37'; // medium-brown
                ctx.fill();
                ctx.strokeStyle = '#3a2d1d'; // dark-brown
                ctx.lineWidth = 2 / transform.k;
                ctx.stroke();
                
                // Draw labels
                ctx.fillStyle = '#3a2d1d';
                ctx.font = `${12 / transform.k}px 'Lora', serif`;
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + radius + 12 / transform.k);
            });
            
            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };
        
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [transform]);

    const getMousePos = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!simulationRef.current) return;
        
        const mousePos = getMousePos(e);
        const worldPos = {
            x: (mousePos.x - canvasRef.current!.width / 2 - transform.x) / transform.k,
            y: (mousePos.y - canvasRef.current!.height / 2 - transform.y) / transform.k,
        };

        const clickedNode = simulationRef.current.getNodeAt(worldPos.x, worldPos.y);
        
        dragState.current = {
            isDragging: true,
            isPanning: !clickedNode,
            node: clickedNode || null,
            lastPos: mousePos,
        };
    }, [transform]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dragState.current.isDragging) return;
        const mousePos = getMousePos(e);

        if (dragState.current.isPanning) {
            const dx = mousePos.x - dragState.current.lastPos.x;
            const dy = mousePos.y - dragState.current.lastPos.y;
            setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
        } else if (dragState.current.node && simulationRef.current) {
            const worldPos = {
                x: (mousePos.x - canvasRef.current!.width / 2 - transform.x) / transform.k,
                y: (mousePos.y - canvasRef.current!.height / 2 - transform.y) / transform.k,
            };
            simulationRef.current.updateNodePosition(dragState.current.node.id, worldPos.x, worldPos.y);
        }
        
        dragState.current.lastPos = mousePos;
    }, [transform]);

    const handleMouseUp = useCallback(() => {
        if (dragState.current.node && !dragState.current.isPanning) {
             if (onNodeClick) onNodeClick(dragState.current.node.id);
        }
        dragState.current = { isDragging: false, isPanning: false, node: null, lastPos: { x: 0, y: 0 } };
    }, [onNodeClick]);

    const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const scaleFactor = 1.1;
        const newK = e.deltaY < 0 ? transform.k * scaleFactor : transform.k / scaleFactor;
        const newZoom = Math.max(0.2, Math.min(newK, 5));
        
        // Zoom towards mouse
        const mousePos = getMousePos(e);
        const worldX = (mousePos.x - transform.x) / transform.k;
        const worldY = (mousePos.y - transform.y) / transform.k;
        
        const newX = mousePos.x - worldX * newZoom;
        const newY = mousePos.y - worldY * newZoom;
        
        setTransform({ x: newX - canvasRef.current!.width/2, y: newY - canvasRef.current!.height/2, k: newZoom });
    }, [transform]);

    // Handle resize
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            if (canvasRef.current) {
                canvasRef.current.width = width;
                canvasRef.current.height = height;
            }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={styles.container}>
            <canvas 
                ref={canvasRef} 
                className={styles.canvas} 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            />
        </div>
    );
};
