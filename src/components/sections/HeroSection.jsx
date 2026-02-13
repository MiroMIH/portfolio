import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spotlight } from '../ui/spotlight';
import { FlipWords } from '../ui/flip-words';
import { TextGenerateEffect } from '../ui/text-generate-effect';
import { Meteors } from '../ui/meteors';
import { EncryptedText } from '../ui/encrypted-text';
import { hero } from '../../data/hero';

const HACKER_CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

const BOOT_LINES = [
  { text: '> Loading JVM... Heap: 512MB allocated', color: '#444' },
  { text: '> java.version: 21.0.2 LTS — vendor: Oracle', color: '#555' },
  { text: '> Compiling Portfolio.java...', color: '#818cf8' },
  { text: '> BUILD SUCCESS — 0 errors, 0 warnings', color: '#28c840' },
  { text: '> @Autowired dependencies injected', color: '#a855f7' },
  { text: '> Establishing secure connection...', color: '#444' },
  { text: '> new Portfolio().run()', color: '#818cf8' },
  { text: '> ACCESS GRANTED', color: '#28c840', highlight: true },
];

// ---- Code Rain Background ----
const CodeRain = React.memo(() => {
  const columns = useMemo(() => {
    const chars = '01{}[]<>/=;:.@#$%^&*+-~|\\アイウカキ';
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      text: Array.from(
        { length: Math.floor(Math.random() * 30) + 15 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('\n'),
      left: `${(i / 18) * 100 + (Math.random() * 3 - 1.5)}%`,
      duration: `${Math.random() * 25 + 20}s`,
      delay: `${Math.random() * 20}s`,
      opacity: Math.random() * 0.03 + 0.008,
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

// ---- Boot Sequence Overlay ----
const BootSequence = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    // Show lines one by one
    const lineTimers = BOOT_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), i * 260 + 300)
    );

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 38);

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    // Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, BOOT_LINES.length * 260 + 1200);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(progressInterval);
      clearInterval(cursorInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="boot-overlay"
      exit={{
        opacity: 0,
        filter: 'blur(12px)',
        scale: 1.03,
      }}
      transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {/* Subtle scanlines on boot screen */}
      <div className="boot-scanlines" />

      <div className="boot-terminal">
        {/* Terminal bar */}
        <div className="boot-terminal-bar">
          <div className="terminal-dots">
            <span className="terminal-dot" style={{ background: '#ff5f57' }} />
            <span className="terminal-dot" style={{ background: '#febc2e' }} />
            <span className="terminal-dot" style={{ background: '#28c840' }} />
          </div>
          <span className="boot-terminal-title">system.boot</span>
        </div>

        {/* Boot lines */}
        <div className="boot-lines">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              className={`boot-line${line.highlight ? ' boot-line-highlight' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span style={{ color: line.color }}>{line.text}</span>
              {i === visibleLines - 1 && (
                <span
                  className="boot-cursor"
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                >
                  _
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="boot-progress-row">
          <div className="boot-progress-track">
            <div
              className="boot-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="boot-progress-pct">{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// ---- Hero Section ----
const HeroSection = () => {
  const [bootDone, setBootDone] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBootDone(true);
  }, []);

  return (
    <section className="hero-section-new">
      {/* Boot Sequence */}
      <AnimatePresence>
        {!bootDone && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* Grid background */}
      <div className="hero-grid-bg" />
      <div className="hero-grid-mask" />

      {/* Code Rain (replaces floating icons) */}
      <CodeRain />

      {/* Scan line */}
      <div className="hero-scanline" />

      {/* Meteors */}
      <Meteors number={14} />

      {/* Spotlights */}
      <Spotlight fill="#6366f1" style={{ top: '-40%', left: '0' }} />
      <Spotlight fill="#a855f7" style={{ top: '-30%', right: '0', left: 'auto' }} />

      {/* HUD corner brackets */}
      <div className="hero-hud hero-hud-tl" />
      <div className="hero-hud hero-hud-tr" />
      <div className="hero-hud hero-hud-bl" />
      <div className="hero-hud hero-hud-br" />

      {/* Hero Content */}
      <div className="hero-content-new">
        {/* @Singleton annotation */}
        <motion.div
          className="hero-singleton"
          initial={{ opacity: 0 }}
          animate={bootDone ? { opacity: 1 } : {}}
          transition={{ delay: 0.05, duration: 0.6 }}
        >
          @Singleton
        </motion.div>

        {/* {AB} Logo with spinning gradient border */}
        <motion.div
          className="hero-avatar-wrapper"
          initial={{ scale: 0, rotate: -180 }}
          animate={bootDone ? { scale: 1, rotate: 0 } : {}}
          transition={{
            delay: 0.1,
            type: 'spring',
            stiffness: 150,
            damping: 15,
          }}
        >
          <div className="hero-avatar-glow" />
          <div className="hero-avatar-ring" />
          <div className="hero-avatar-inner">
            <div className="hero-logo">
              <span className="hero-logo-bracket">{'{'}</span>
              <span className="hero-logo-initials">AB</span>
              <span className="hero-logo-bracket">{'}'}</span>
            </div>
          </div>
        </motion.div>

        {/* Status badge */}
        <motion.div
          className="hero-status-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={bootDone ? { opacity: 1, scale: 1 } : {}}
          transition={{
            delay: 0.3,
            duration: 0.5,
            type: 'spring',
            stiffness: 200,
          }}
        >
          <span className="hero-status-dot" />
          <span>Disponible pour des projets</span>
        </motion.div>

        {/* Name with EncryptedText */}
        <motion.h1
          className="hero-name-new"
          initial={{ opacity: 0, y: 30 }}
          animate={bootDone ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {bootDone && (
            <EncryptedText
              text={hero.name}
              charset={HACKER_CHARSET}
              animateOn="mount"
              maxDuration={1500}
              flipDelayMs={35}
              encryptedStyle={{ color: '#818cf8', opacity: 0.7 }}
              revealedStyle={{}}
            />
          )}
        </motion.h1>

        {/* Terminal-style role line */}
        <motion.div
          className="hero-role-line"
          initial={{ opacity: 0 }}
          animate={bootDone ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <span className="hero-role-prompt">~$</span>
          <span className="hero-role-cmd">whoami</span>
          <span className="hero-role-separator">&rarr;</span>
          <FlipWords
            words={hero.roles}
            duration={3000}
            style={{
              color: '#a78bfa',
              fontWeight: 700,
            }}
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={bootDone ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          {bootDone && (
            <TextGenerateEffect
              words={hero.bio}
              style={{
                maxWidth: '650px',
                margin: '0 auto 2.5rem',
                fontSize: '1.05rem',
                lineHeight: 1.8,
              }}
              duration={0.4}
            />
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="hero-cta-row"
          initial={{ opacity: 0, y: 20 }}
          animate={bootDone ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href={hero.cvUrl}
            download="CV_Amir_Belaifa.pdf"
            className="hero-shimmer-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Télécharger CV
          </motion.a>

          <motion.a
            href={`mailto:${hero.email}`}
            className="hero-outline-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Me Contacter
          </motion.a>
        </motion.div>

        {/* // FIXME comment */}
        <motion.span
          className="code-comment"
          initial={{ opacity: 0 }}
          animate={bootDone ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          {'// FIXME: need more coffee'}
        </motion.span>

        {/* Secondary links */}
        <motion.div
          className="hero-secondary-links"
          initial={{ opacity: 0 }}
          animate={bootDone ? { opacity: 1 } : {}}
          transition={{ delay: 1.0 }}
        >
          <a href={`mailto:${hero.email}`}>{hero.email}</a>
          <div className="hero-secondary-dot" />
          <span>{hero.location}</span>
        </motion.div>
      </div>

      {/* // TODO comment */}
      <span className="code-comment code-comment-abs code-comment-br">
        {'// TODO: scroll down'}
      </span>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-new"
        initial={{ opacity: 0 }}
        animate={bootDone ? { opacity: 1 } : {}}
        transition={{ delay: 1.3 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            style={{ width: 20, height: 20, color: '#444' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
