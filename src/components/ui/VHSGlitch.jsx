import React, { useEffect, useRef, useCallback, useState } from 'react';

const DURATION = 5500;

const VHSGlitch = () => {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const canvasRef = useRef(null);

  const activate = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    setActive(true);
    window.dispatchEvent(new CustomEvent('ee-unlock', { detail: 'glitch' }));
    setTimeout(() => {
      activeRef.current = false;
      setActive(false);
    }, DURATION);
  }, []);

  // Keyboard trigger: type "glitch" anywhere on the page
  useEffect(() => {
    let seq = '';
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      seq = (seq + e.key.toLowerCase()).slice(-10);
      if (seq.endsWith('glitch')) {
        activate();
        seq = '';
      }
    };
    const onEvent = () => activate();

    document.addEventListener('keydown', onKey);
    document.addEventListener('portfolio:glitch', onEvent);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('portfolio:glitch', onEvent);
    };
  }, [activate]);

  // Canvas: noise + glitch bars at 60fps
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    let frame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Static noise — random white specks
      for (let i = 0; i < 220; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.18})`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          1 + Math.random() * 3,
          1
        );
      }

      // Coloured glitch bars
      for (let i = 0; i < 5; i++) {
        if (Math.random() > 0.52) {
          const y = Math.random() * canvas.height;
          const h = 1 + Math.random() * 22;
          const r = Math.random();
          if (r < 0.33)      ctx.fillStyle = `rgba(255,0,60,${0.1 + Math.random() * 0.3})`;
          else if (r < 0.66) ctx.fillStyle = `rgba(0,255,255,${0.08 + Math.random() * 0.24})`;
          else               ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.12})`;
          ctx.fillRect(0, y, canvas.width, h);
        }
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  // Body filter flicker
  useEffect(() => {
    if (!active) {
      document.body.style.filter = '';
      return;
    }
    let t = 0;
    const id = setInterval(() => {
      t++;
      if (Math.random() > 0.8) {
        // Dramatic glitch frame
        const hue = (Math.random() - 0.5) * 160;
        const sat = 1.5 + Math.random() * 2.2;
        const br  = 0.72 + Math.random() * 0.55;
        document.body.style.filter =
          `hue-rotate(${hue}deg) saturate(${sat}) contrast(1.3) brightness(${br})`;
      } else {
        // Subtle drift
        const hue = Math.sin(t * 0.15) * 14;
        document.body.style.filter =
          `hue-rotate(${hue}deg) saturate(1.3) contrast(1.07)`;
      }
    }, 65);
    return () => {
      clearInterval(id);
      document.body.style.filter = '';
    };
  }, [active]);

  // Body shake / horizontal tear
  useEffect(() => {
    if (!active) {
      document.body.style.transform = '';
      return;
    }
    const id = setInterval(() => {
      if (Math.random() > 0.68) {
        const x = (Math.random() - 0.5) * 12;
        const y = (Math.random() - 0.5) * 5;
        document.body.style.transform = `translate(${x}px,${y}px)`;
        setTimeout(() => { document.body.style.transform = ''; }, 40 + Math.random() * 70);
      }
    }, 110);
    return () => {
      clearInterval(id);
      document.body.style.transform = '';
    };
  }, [active]);

  const now = new Date();

  return (
    <>
      <style>{`
        @keyframes vhs-scan {
          from { transform: translateY(-80px); }
          to   { transform: translateY(100vh); }
        }
        @keyframes rec-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes rgb-r {
          0%, 100% { transform: translateX(0px); }
          30%      { transform: translateX(5px);  }
          70%      { transform: translateX(-3px); }
        }
        @keyframes rgb-c {
          0%, 100% { transform: translateX(0px);  }
          30%      { transform: translateX(-5px); }
          70%      { transform: translateX(3px);  }
        }
        @keyframes tracking-drift {
          0%,100% { transform: translateX(-50%) skewX(0deg);   opacity: 0.12; }
          25%     { transform: translateX(-50%) skewX(-1.5deg); opacity: 0.2;  }
          75%     { transform: translateX(-50%) skewX(1deg);    opacity: 0.08; }
        }
      `}</style>

      {/* Noise + glitch-bar canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          pointerEvents: 'none', zIndex: 9975,
          display: active ? 'block' : 'none',
        }}
      />

      {active && (
        <>
          {/* Horizontal scanlines */}
          <div style={{
            position: 'fixed', inset: 0,
            pointerEvents: 'none', zIndex: 9976,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.11) 2px, rgba(0,0,0,0.11) 4px)',
          }} />

          {/* Slow moving scan bar (CRT phosphor sweep) */}
          <div style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '70px',
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.028), transparent)',
            pointerEvents: 'none', zIndex: 9977,
            animation: 'vhs-scan 2.8s linear infinite',
          }} />

          {/* RGB split — red channel */}
          <div style={{
            position: 'fixed', inset: 0,
            pointerEvents: 'none', zIndex: 9973,
            background: 'rgba(255,0,0,0.04)',
            mixBlendMode: 'screen',
            animation: 'rgb-r 0.13s steps(1) infinite',
          }} />

          {/* RGB split — cyan channel */}
          <div style={{
            position: 'fixed', inset: 0,
            pointerEvents: 'none', zIndex: 9973,
            background: 'rgba(0,255,255,0.04)',
            mixBlendMode: 'screen',
            animation: 'rgb-c 0.13s steps(1) infinite',
          }} />

          {/* ◉ REC indicator */}
          <div style={{
            position: 'fixed', top: '1.2rem', left: '1.5rem',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, color: '#ff4444',
            pointerEvents: 'none', zIndex: 9978,
            textShadow: '2px 0 rgba(0,255,255,0.55), -2px 0 rgba(255,0,0,0.55)',
            letterSpacing: '0.08em',
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#ff3333',
              animation: 'rec-blink 0.55s step-end infinite',
              boxShadow: '0 0 8px #ff3333',
            }} />
            REC
          </div>

          {/* VHS timestamp */}
          <div style={{
            position: 'fixed', bottom: '5.5rem', left: '1.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: 'rgba(255,255,255,0.72)',
            pointerEvents: 'none', zIndex: 9978,
            textShadow: '2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,255,255,0.5)',
            letterSpacing: '0.05em',
          }}>
            SP &nbsp; {now.toLocaleDateString()} &nbsp; {now.toLocaleTimeString()}
          </div>

          {/* TRACKING... label */}
          <div style={{
            position: 'fixed', top: '48%', left: '50%',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: 'rgba(255,255,255,0.13)',
            pointerEvents: 'none', zIndex: 9978,
            letterSpacing: '0.35em',
            animation: 'tracking-drift 0.4s ease-in-out infinite',
          }}>
            TRACKING...
          </div>

          {/* Tape speed label */}
          <div style={{
            position: 'fixed', top: '1.2rem', right: '1.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, color: 'rgba(255,255,255,0.45)',
            pointerEvents: 'none', zIndex: 9978,
            letterSpacing: '0.1em',
            textShadow: '1px 0 rgba(255,0,0,0.4), -1px 0 rgba(0,255,255,0.4)',
          }}>
            EP · SLP
          </div>
        </>
      )}
    </>
  );
};

export default VHSGlitch;
