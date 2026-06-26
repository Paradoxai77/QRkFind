import { useRef, useEffect, useCallback, useMemo } from 'react';
import './DotGrid.css';

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 82, g: 39, b: 255 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid = ({
  dotSize = 1.5,
  gap = 24,
  baseColor = '#313244',
  activeColor = '#38c826',
  proximity = 120,
  shockRadius = 180,
  shockStrength = 8,
  className = '',
  style
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new window.Path2D();
    p.arc(0, 0, dotSize, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize * 2 + gap));
    const rows = Math.floor((height + gap) / (dotSize * 2 + gap));
    const cell = dotSize * 2 + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize;
    const startY = extraY / 2 + dotSize;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, vx: 0, vy: 0 });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId;
    const proxSq = proximity * proximity;
    const spring = 0.04;
    const damping = 0.15;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pr = pointerRef.current;

      for (const dot of dotsRef.current) {
        // Physics update
        const ax = -spring * dot.xOffset - damping * dot.vx;
        const ay = -spring * dot.yOffset - damping * dot.vy;
        dot.vx += ax;
        dot.vy += ay;
        dot.xOffset += dot.vx;
        dot.yOffset += dot.vy;

        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        
        const dx = dot.cx - pr.x;
        const dy = dot.cy - pr.y;
        const dsq = dx * dx + dy * dy;

        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      window.addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = e => {
      const now = performance.now();
      const pr = pointerRef.current;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = px - pr.lastX;
      const dy = py - pr.lastY;
      const vx = (dx / Math.max(1, dt)) * 10;
      const vy = (dy / Math.max(1, dt)) * 10;
      const speed = Math.hypot(vx, vy);

      pr.x = px;
      pr.y = py;
      pr.lastX = px;
      pr.lastY = py;
      pr.lastTime = now;

      for (const dot of dotsRef.current) {
        const dx_dot = dot.cx - px;
        const dy_dot = dot.cy - py;
        const dist = Math.hypot(dx_dot, dy_dot);
        if (dist < proximity && speed > 0.5) {
          const force = (1 - dist / proximity) * 1.5;
          const pushX = (dx_dot / Math.max(1, dist)) * force * (speed * 0.15);
          const pushY = (dy_dot / Math.max(1, dist)) * force * (speed * 0.15);
          dot.vx += pushX;
          dot.vy += pushY;
        }
      }
    };

    const onClick = e => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dx = dot.cx - cx;
        const dy = dot.cy - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < shockRadius) {
          const falloff = 1 - dist / shockRadius;
          const force = falloff * shockStrength;
          const pushX = (dx / Math.max(1, dist)) * force;
          const pushY = (dy / Math.max(1, dist)) * force;
          dot.vx += pushX;
          dot.vy += pushY;
        }
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, [proximity, shockRadius, shockStrength]);

  return (
    <div ref={wrapperRef} className={`dot-grid ${className}`} style={style}>
      <canvas ref={canvasRef} className="dot-grid__canvas" />
    </div>
  );
};

export default DotGrid;
