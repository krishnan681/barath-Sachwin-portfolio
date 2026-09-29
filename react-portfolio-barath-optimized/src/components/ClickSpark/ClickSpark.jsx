import { useRef, useEffect, useCallback } from 'react';

const ClickSpark = ({
  sparkColor = '#1b4ef5',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animationIdRef = useRef(0);
  const lastDprRef = useRef(0);

  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case 'linear': return t;
        case 'ease-in': return t * t;
        case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default: return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight || lastDprRef.current !== dpr) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        lastDprRef.current = dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = 0;
    };
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(animationIdRef.current);
  }, []);

  const draw = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = lastDprRef.current || Math.min(window.devicePixelRatio || 1, 2);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const activeSparks = [];
    ctx.strokeStyle = sparkColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    for (const spark of sparksRef.current) {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) continue;

      const progress = elapsed / duration;
      const eased = easeFunc(progress);
      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);
      const cos = Math.cos(spark.angle);
      const sin = Math.sin(spark.angle);
      const x1 = spark.x + distance * cos;
      const y1 = spark.y + distance * sin;
      const x2 = spark.x + (distance + lineLength) * cos;
      const y2 = spark.y + (distance + lineLength) * sin;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      activeSparks.push(spark);
    }

    sparksRef.current = activeSparks;

    // Do not keep a requestAnimationFrame alive while idle.
    if (activeSparks.length > 0) {
      animationIdRef.current = requestAnimationFrame(draw);
    } else {
      animationIdRef.current = 0;
    }
  }, [duration, easeFunc, extraScale, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));

    sparksRef.current.push(...newSparks);

    if (!animationIdRef.current) {
      animationIdRef.current = requestAnimationFrame(draw);
    }
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', minHeight: '100%' }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
          userSelect: 'none',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
