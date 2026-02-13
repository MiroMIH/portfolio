import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { EncryptedText } from '../ui/encrypted-text';

const HACKER_CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

const TiltCard = ({ children, className = '', delay = 0 }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), {
    stiffness: 200,
    damping: 25,
  });

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [mx, my]
  );

  const handleMouseLeave = () => {
    setIsHovered(false);
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >
      <motion.div
        ref={cardRef}
        className={`skill-card-3d${isHovered ? ' hovered' : ''} ${className}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="skill-card-inner terminal-body">
          <div
            className="skill-card-spotlight"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
            }}
          />
          <div className="terminal-scanline" />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ActivitySection = () => {
  return (
    <section className="activity-section">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          title="Activité & Stats"
          subtitle="Contributions GitHub et progression LeetCode"
          subtitleDuration={2500}
        />

        <div className="activity-grid">
          {/* GitHub Contribution Graph */}
          <TiltCard className="activity-card" delay={0}>
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="terminal-filename">com.amir.git.log</span>
            </div>

            <div className="terminal-command-line">
              <span className="terminal-prompt" style={{ color: '#818cf8' }}>
                ~$
              </span>{' '}
              <EncryptedText
                text="git log --graph --author=MiroMIH"
                charset={HACKER_CHARSET}
                animateOn="view"
                maxDuration={1200}
                flipDelayMs={30}
                className="terminal-cmd-text"
                encryptedStyle={{ color: '#818cf8', opacity: 0.7 }}
                revealedStyle={{ color: '#e2e8f0' }}
              />
              <span className="terminal-cursor">_</span>
            </div>

            <motion.div
              className="activity-img-wrapper"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <img
                src="https://ghchart.rshah.org/MiroMIH"
                alt="GitHub Contribution Graph"
                className="activity-img"
              />
            </motion.div>

            <motion.div
              className="terminal-status-line"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
            >
              <span className="terminal-status-dot" />
              <span>contributions loaded — streaming commits</span>
            </motion.div>
          </TiltCard>

          {/* LeetCode Stats */}
          <TiltCard className="activity-card" delay={0.15}>
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="terminal-filename">com.amir.leetcode.stats</span>
            </div>

            <div className="terminal-command-line">
              <span className="terminal-prompt" style={{ color: '#f59e0b' }}>
                ~$
              </span>{' '}
              <EncryptedText
                text="leetcode stats --user=MiroMIH"
                charset={HACKER_CHARSET}
                animateOn="view"
                maxDuration={1200}
                flipDelayMs={30}
                className="terminal-cmd-text"
                encryptedStyle={{ color: '#f59e0b', opacity: 0.7 }}
                revealedStyle={{ color: '#e2e8f0' }}
              />
              <span className="terminal-cursor">_</span>
            </div>

            <motion.div
              className="activity-img-wrapper"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <img
                src="https://leetcard.jacoblin.cool/MiroMIH?theme=dark&font=Source%20Code%20Pro"
                alt="LeetCode Stats"
                className="activity-img"
              />
            </motion.div>

            <motion.div
              className="terminal-status-line"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
            >
              <span className="terminal-status-dot" />
              <span>stats fetched — problem solving active</span>
            </motion.div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

export default ActivitySection;
