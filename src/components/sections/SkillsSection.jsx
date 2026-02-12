import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { EncryptedText } from '../ui/encrypted-text';
import { skillCategories } from '../../data/skills';
import techLogos from '../../data/techLogos';

const HACKER_CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01アイウエオ';

const categoryMeta = {
  'Frontend': {
    filename: 'frontend.config.ts',
    command: 'scan --modules @frontend/core',
    accentColor: '#818cf8',
    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
    glow: 'rgba(99, 102, 241, 0.12)',
  },
  'Backend': {
    filename: 'server.config.ts',
    command: 'scan --modules @backend/api',
    accentColor: '#38bdf8',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    glow: 'rgba(59, 130, 246, 0.12)',
  },
  'Bases de données': {
    filename: 'database.config.ts',
    command: 'scan --modules @database/drivers',
    accentColor: '#34d399',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    glow: 'rgba(16, 185, 129, 0.12)',
  },
};

// Matrix-style code rain background
const CodeRain = React.memo(() => {
  const columns = useMemo(() => {
    const chars = '01{}[]<>/=;:.@#$%^&*+-~|\\';
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      text: Array.from(
        { length: Math.floor(Math.random() * 25) + 15 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('\n'),
      left: `${(i / 14) * 100 + (Math.random() * 3 - 1.5)}%`,
      duration: `${Math.random() * 25 + 20}s`,
      delay: `${Math.random() * 20}s`,
      opacity: Math.random() * 0.04 + 0.015,
    }));
  }, []);

  return (
    <div className="code-rain" aria-hidden="true">
      {columns.map((col) => (
        <div
          key={col.id}
          className="code-rain-col"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
            opacity: col.opacity,
          }}
        >
          {col.text}
        </div>
      ))}
    </div>
  );
});

// 3D Terminal Card
const TerminalCard = ({ category, index }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 25 });

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

  const meta = categoryMeta[category.title] || categoryMeta['Frontend'];

  return (
    <motion.div
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 80, rotateX: 12, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.2,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      <motion.div
        ref={cardRef}
        className={`skill-card-3d${isHovered ? ' hovered' : ''}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="skill-card-inner terminal-body">
          {/* Mouse spotlight */}
          <div
            className="skill-card-spotlight"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${meta.glow}, transparent 40%)`,
            }}
          />

          {/* Scan line sweep */}
          <div className="terminal-scanline" />

          {/* ---- Terminal Title Bar ---- */}
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span className="terminal-dot" style={{ background: '#ff5f57' }} />
              <span className="terminal-dot" style={{ background: '#febc2e' }} />
              <span className="terminal-dot" style={{ background: '#28c840' }} />
            </div>
            <span className="terminal-filename">{meta.filename}</span>
          </div>

          {/* ---- Command Line with encryption effect ---- */}
          <div className="terminal-command-line">
            <span className="terminal-prompt" style={{ color: meta.accentColor }}>
              ~$
            </span>{' '}
            <EncryptedText
              text={meta.command}
              charset={HACKER_CHARSET}
              animateOn="view"
              maxDuration={1200}
              flipDelayMs={30}
              className="terminal-cmd-text"
              encryptedStyle={{ color: meta.accentColor, opacity: 0.7 }}
              revealedStyle={{ color: '#e2e8f0' }}
            />
            <span className="terminal-cursor">_</span>
          </div>

          {/* ---- Animated Progress Bar ---- */}
          <div className="terminal-progress-row">
            <div className="terminal-progress-track">
              <motion.div
                className="terminal-progress-fill"
                style={{ background: meta.gradient }}
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.8,
                  delay: index * 0.2 + 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            </div>
            <motion.span
              className="terminal-progress-label"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 2.2 }}
            >
              [{category.techs.length}/{category.techs.length}]
            </motion.span>
          </div>

          {/* ---- Tech Modules ---- */}
          <div className="terminal-modules">
            {category.techs.map((tech, i) => (
              <motion.div
                key={tech}
                className="terminal-module"
                initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.2 + i * 0.07 + 1.0,
                  duration: 0.5,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                whileHover={{
                  scale: 1.06,
                  y: -4,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
              >
                <span className="terminal-module-marker" style={{ color: meta.accentColor }}>
                  {i === category.techs.length - 1 ? '└' : '├'}
                </span>
                <img src={techLogos[tech]} alt={tech} className="terminal-module-logo" />
                <span className="terminal-module-name">{tech}</span>
                <motion.span
                  className="terminal-module-status"
                  style={{ color: '#28c840' }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.2 + i * 0.07 + 1.4,
                    type: 'spring',
                    stiffness: 500,
                    damping: 15,
                  }}
                >
                  ✓
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* ---- Status Line ---- */}
          <motion.div
            className="terminal-status-line"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 2.5 }}
          >
            <span className="terminal-status-dot" />
            <span>
              Process complete — {category.techs.length} modules verified
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkillsSection = () => {
  return (
    <section className="skills-section">
      <CodeRain />
      <div className="skills-bg-grid" />
      <div className="skills-bg-mask" />
      <div className="skills-glow-orb skills-glow-1" />
      <div className="skills-glow-orb skills-glow-2" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          title="Comp&eacute;tences &amp; Technologies"
          subtitle="Ma&icirc;trise des technologies modernes pour cr&eacute;er des exp&eacute;riences exceptionnelles"
          subtitleDuration={3500}
        />

        <div className="skills-grid-new">
          {skillCategories.map((category, index) => (
            <TerminalCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
