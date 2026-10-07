import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
  pulse: number;
}

export const DataPipeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const hoverRef = useRef<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const nodes: Node[] = [];
    const nodeCount = 40;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 1.5,
        size: 2 + Math.random() * 3,
        alpha: 0.1 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const speedMultiplier = hoverRef.current ? 3 : 1;
      const accentColor = '#00FF41';

      nodes.forEach((node, i) => {
        // Move right
        node.x += node.speed * speedMultiplier;
        if (node.x > width) {
          node.x = -10;
          node.y = Math.random() * height;
        }

        // Pulse effect
        node.pulse += 0.05;
        const currentAlpha = node.alpha + Math.sin(node.pulse) * 0.1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `${accentColor}${Math.floor(currentAlpha * 255)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.shadowBlur = hoverRef.current ? 15 : 5;
        ctx.shadowColor = accentColor;
        ctx.fill();

        // Draw connections
        nodes.forEach((targetNode, j) => {
          if (i === j) return;
          const dx = node.x - targetNode.x;
          const dy = node.y - targetNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            const lineAlpha = (1 - distance / 150) * 0.15;
            ctx.strokeStyle = `${accentColor}${Math.floor(lineAlpha * 255)
              .toString(16)
              .padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    hoverRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    setIsHovered(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        overflow: 'hidden',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
          opacity: 0.8,
        }}
      />

      {/* Edge fades */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, var(--background), transparent, var(--background))',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, var(--background), transparent, var(--background))',
          pointerEvents: 'none',
        }}
      />

      {/* Terminal status overlay */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'var(--accent)',
          opacity: 0.5,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          letterSpacing: '0.1em',
          pointerEvents: 'none',
          textAlign: 'right',
        }}
      >
        <div>SYSTEM_STATUS: ACTIVE</div>
        <div>PIPELINE_FLOW: {isHovered ? 'ACCELERATED' : 'STABLE'}</div>
        <div>DATA_NODES: 40</div>
        <div>LATENCY: 12ms</div>
      </div>
    </div>
  );
};