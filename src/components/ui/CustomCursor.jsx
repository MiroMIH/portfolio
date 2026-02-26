import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isTouchDevice] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  );
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const ringX = useSpring(mouseX, { damping: 28, stiffness: 280 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 280 });

  useEffect(() => {
    if (isTouchDevice) return;

    // Inject cursor:none globally
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);
    const onOver = (e) => {
      const el = e.target.closest(
        'a, button, [role="button"], input, textarea, label, select, [data-hover]'
      );
      setIsHovering(!!el);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);

    return () => {
      const injected = document.getElementById('custom-cursor-style');
      if (injected) injected.remove();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
    };
  }, [isTouchDevice, mouseX, mouseY]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trailing ring — spring-lagged */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9997,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 50 : isClicking ? 22 : 36,
            height: isHovering ? 50 : isClicking ? 22 : 36,
            borderColor: isHovering
              ? 'rgba(168,85,247,0.85)'
              : 'rgba(99,102,241,0.35)',
            boxShadow: isHovering
              ? '0 0 20px rgba(168,85,247,0.35), 0 0 40px rgba(168,85,247,0.12)'
              : '0 0 8px rgba(99,102,241,0.18)',
          }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            borderRadius: '50%',
            border: '1.5px solid rgba(99,102,241,0.35)',
          }}
        />
      </motion.div>

      {/* Precise dot — no lag */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      >
        <motion.div
          animate={{
            width: isClicking ? 14 : isHovering ? 5 : 8,
            height: isClicking ? 14 : isHovering ? 5 : 8,
            opacity: isClicking ? 0.55 : 1,
            background: isHovering ? '#a855f7' : '#6366f1',
            boxShadow: isHovering
              ? '0 0 12px rgba(168,85,247,1), 0 0 28px rgba(168,85,247,0.5)'
              : '0 0 8px rgba(99,102,241,1), 0 0 20px rgba(99,102,241,0.5)',
          }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          style={{ borderRadius: '50%' }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
