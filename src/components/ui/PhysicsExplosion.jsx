import React, { useEffect, useRef, useCallback } from 'react';

const CODE_SYMBOLS = [
  '{}', '()', '=>', ';;', '//', 'null', 'void', 'true', 'false',
  '[]', '&&', '||', '!==', '===', '@', 'new', 'try', 'catch',
  '☕', 'if', 'for', 'fn()', 'API', 'NaN', '404', '200', 'OK!',
  'git', 'npm', 'err', '@Bean', 'SQL', 'async', 'await', 'class',
  'break', 'return', 'public', 'static', 'import', 'throw', 'final',
  'null!', 'EOF', '#[]', 'mvn', 'int', '0x1F', 'type', 'enum',
];

const COLORS = [
  '#6366f1', '#a855f7', '#38bdf8', '#28c840',
  '#f59e0b', '#ff5f57', '#fb923c', '#818cf8',
];

const createParticle = (x, y) => {
  const angle = Math.random() * Math.PI * 2;
  const speed = 180 + Math.random() * 520;
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - Math.random() * 180,
    symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 10 + Math.random() * 13,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 6,
    life: 1,
    decay: 0.18 + Math.random() * 0.28,
    bounces: 0,
  };
};

const PhysicsExplosion = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const runningRef = useRef(false);

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;

    const canvas = canvasRef.current;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    let lastTime = null;

    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0.01);

      for (const p of particlesRef.current) {
        // physics
        p.vy += 780 * dt;   // gravity
        p.vx *= 0.987;      // air drag
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotSpeed * dt;
        p.life -= p.decay * dt;

        // floor bounce
        if (p.y > canvas.height - 20) {
          p.y = canvas.height - 20;
          p.vy *= -0.42;
          p.vx *= 0.72;
          p.rotSpeed *= 0.65;
          p.bounces++;
          if (p.bounces > 3) p.life -= 0.22;
        }

        // wall bounce
        if (p.x < 5) { p.x = 5; p.vx = Math.abs(p.vx) * 0.55; }
        if (p.x > canvas.width - 5) { p.x = canvas.width - 5; p.vx = -Math.abs(p.vx) * 0.55; }

        if (p.life <= 0) continue;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `bold ${p.size}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 14;
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      }

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        runningRef.current = false;
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
  }, []);

  const triggerBurst = useCallback((x, y, count = 72) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(x, y));
    }

    startLoop();
  }, [startLoop]);

  useEffect(() => {
    let seq = '';

    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      seq = (seq + e.key.toLowerCase()).slice(-8);
      if (seq.endsWith('boom')) {
        triggerBurst(window.innerWidth / 2, window.innerHeight / 2);
        window.dispatchEvent(new CustomEvent('ee-unlock', { detail: 'boom' }));
        seq = '';
      }
    };

    // clicking during active explosion spawns more particles at cursor
    const onClick = (e) => {
      if (runningRef.current) {
        triggerBurst(e.clientX, e.clientY, 28);
      }
    };

    // custom event so other components (terminal, easter eggs) can trigger it
    const onExplode = (e) => {
      triggerBurst(
        e.detail?.x ?? window.innerWidth / 2,
        e.detail?.y ?? window.innerHeight / 2,
        e.detail?.count ?? 72,
      );
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    document.addEventListener('portfolio:explode', onExplode);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      document.removeEventListener('portfolio:explode', onExplode);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [triggerBurst]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9980,
        display: 'none',
      }}
    />
  );
};

export default PhysicsExplosion;
