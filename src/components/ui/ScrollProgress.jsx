import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const PHASES = [
  { threshold: 0,  label: 'remote: Enumerating objects' },
  { threshold: 12, label: 'Compressing objects' },
  { threshold: 30, label: 'Counting objects' },
  { threshold: 50, label: 'Writing objects' },
  { threshold: 70, label: 'Receiving objects' },
  { threshold: 88, label: 'Resolving deltas' },
];

const getPhaseLabel = (percent) => {
  const phase = [...PHASES].reverse().find((p) => percent >= p.threshold);
  return phase ? phase.label : PHASES[0].label;
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  const [percent, setPercent] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timeout;
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setPercent(Math.round(v * 100));
      setIsActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsActive(false), 1400);
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [scrollYProgress]);

  const isDone = percent >= 100;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        pointerEvents: 'none',
      }}
    >
      {/* Track */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          style={{
            height: '100%',
            scaleX,
            transformOrigin: '0%',
            background: 'linear-gradient(90deg, #6366f1, #a855f7, #38bdf8)',
            boxShadow:
              '0 0 8px rgba(99,102,241,0.85), 0 0 20px rgba(168,85,247,0.3)',
          }}
        />
      </div>

      {/* Terminal badge */}
      <motion.div
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -6 }}
        transition={{ duration: 0.22 }}
        style={{
          position: 'absolute',
          top: '6px',
          right: '16px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#818cf8',
          background: 'rgba(10,10,10,0.92)',
          border: '1px solid rgba(99,102,241,0.22)',
          padding: '3px 8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
        }}
      >
        {isDone ? (
          <span style={{ color: '#28c840' }}>✓ remote: done.</span>
        ) : (
          <>
            {getPhaseLabel(percent)}:{' '}
            <span style={{ color: '#38bdf8' }}>{percent}%</span>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ScrollProgress;
