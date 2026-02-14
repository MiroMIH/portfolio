import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { EncryptedText } from '../ui/encrypted-text';
import { projects, filterCategories } from '../../data/projects';
import techLogos from '../../data/techLogos';

const HACKER_CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

// Get all navigable (non-professional) projects
const navigableProjects = projects.filter((p) => p.category !== 'Professionnel');

// Transition phases: typing -> visible -> deleting -> swap -> typing
const PHASE_TYPING = 'typing';
const PHASE_VISIBLE = 'visible';
const PHASE_DELETING = 'deleting';

// ---- Project Detail Modal ----
const ProjectDetailModal = ({ project, onClose, onNavigate, onImageEasterEgg, onRedDotEasterEgg }) => {
  // The project currently being displayed (swaps after delete animation)
  const [displayedProject, setDisplayedProject] = useState(project);
  const [phase, setPhase] = useState(PHASE_TYPING);
  const [typedLines, setTypedLines] = useState(0);
  const [typedCmd, setTypedCmd] = useState('');
  const [cmdDone, setCmdDone] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showHiddenComment, setShowHiddenComment] = useState(false);
  const [imageGlitch, setImageGlitch] = useState(false);
  const [forceKill, setForceKill] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const contentRef = useRef(null);
  const imageClickRef = useRef(0);
  const imageClickTimerRef = useRef(null);
  const redDotClickRef = useRef(0);
  const redDotTimerRef = useRef(null);
  const pendingProjectRef = useRef(null);
  const maxLines = 8;

  const p = displayedProject;
  const isInProgress = p.status === 'in-progress';
  const statusColor = isInProgress ? '#febc2e' : '#28c840';
  const statusText = isInProgress ? 'IN_PROGRESS' : 'COMPLETED';
  const fullCmd = `cat com.amir.projects.${p.id}`;

  // Line numbers counter
  const lineNumberBase = useRef(1);
  let lineCounter = lineNumberBase.current;
  const getLineNum = () => {
    const num = lineCounter;
    lineCounter += 1;
    return num;
  };

  // When parent changes the project prop, start delete animation
  useEffect(() => {
    if (project.id !== displayedProject.id) {
      pendingProjectRef.current = project;
      if (phase === PHASE_VISIBLE) {
        setPhase(PHASE_DELETING);
      }
    }
  }, [project, displayedProject.id, phase]);

  // PHASE: DELETING — reverse the line reveal, then erase the command
  useEffect(() => {
    if (phase !== PHASE_DELETING) return;

    // First collapse lines (fast)
    if (typedLines > 0) {
      const timer = setTimeout(() => setTypedLines((l) => l - 1), 40);
      return () => clearTimeout(timer);
    }

    // Then erase the command text
    if (typedCmd.length > 0) {
      const timer = setTimeout(() => {
        setTypedCmd((cmd) => cmd.slice(0, -1));
      }, 18);
      return () => clearTimeout(timer);
    }

    // Deletion complete — swap project and start typing
    if (pendingProjectRef.current) {
      setDisplayedProject(pendingProjectRef.current);
      pendingProjectRef.current = null;
      setShowHiddenComment(false);
      setActiveScreenshot(0);
      setCmdDone(false);
      setPhase(PHASE_TYPING);
      // Scroll to top
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  }, [phase, typedLines, typedCmd]);

  // PHASE: TYPING — type the command character by character
  useEffect(() => {
    if (phase !== PHASE_TYPING) return;
    const target = `cat com.amir.projects.${displayedProject.id}`;

    if (typedCmd.length < target.length) {
      const timer = setTimeout(() => {
        setTypedCmd(target.slice(0, typedCmd.length + 1));
      }, 35);
      return () => clearTimeout(timer);
    }

    // Command fully typed
    setCmdDone(true);
  }, [phase, typedCmd, displayedProject.id]);

  // After command is done, stagger sections in
  useEffect(() => {
    if (!cmdDone || phase === PHASE_DELETING) return;
    if (typedLines < maxLines) {
      const timer = setTimeout(() => setTypedLines((l) => l + 1), 100);
      return () => clearTimeout(timer);
    }
    if (typedLines >= maxLines && phase === PHASE_TYPING) {
      setPhase(PHASE_VISIBLE);
    }
  }, [typedLines, cmdDone, phase]);

  // Initial typing on first mount
  useEffect(() => {
    setTypedCmd('');
    setCmdDone(false);
    setTypedLines(0);
    setPhase(PHASE_TYPING);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard: ESC to close, left/right to navigate
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (phase === PHASE_DELETING) return; // block nav during transition
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const idx = navigableProjects.findIndex((np) => np.id === displayedProject.id);
        if (idx === -1) return;
        let next;
        if (e.key === 'ArrowLeft') {
          next = idx > 0 ? idx - 1 : navigableProjects.length - 1;
        } else {
          next = idx < navigableProjects.length - 1 ? idx + 1 : 0;
        }
        onNavigate(navigableProjects[next]);
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate, displayedProject.id, phase]);

  // Spotlight mouse tracking
  const handleMouseMove = useCallback((e) => {
    const modal = e.currentTarget;
    const rect = modal.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  // Scroll detection for hidden comment
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setShowHiddenComment(true);
    }
  }, []);

  // Easter egg: click image 5 times for glitch
  const handleImageClick = useCallback(() => {
    imageClickRef.current++;
    clearTimeout(imageClickTimerRef.current);
    imageClickTimerRef.current = setTimeout(() => { imageClickRef.current = 0; }, 2000);
    if (imageClickRef.current >= 5) {
      imageClickRef.current = 0;
      setImageGlitch(true);
      onImageEasterEgg();
      setTimeout(() => setImageGlitch(false), 1500);
    }
  }, [onImageEasterEgg]);

  // Easter egg: click red dot 3 times for force kill
  const handleRedDotClick = useCallback((e) => {
    e.stopPropagation();
    redDotClickRef.current++;
    clearTimeout(redDotTimerRef.current);
    redDotTimerRef.current = setTimeout(() => { redDotClickRef.current = 0; }, 1200);
    if (redDotClickRef.current >= 3) {
      redDotClickRef.current = 0;
      setForceKill(true);
      onRedDotEasterEgg();
      setTimeout(() => {
        setForceKill(false);
        onClose();
      }, 2000);
    } else {
      // Single click still closes normally on first click — but only after timer expires
    }
  }, [onClose, onRedDotEasterEgg]);

  // Current nav index (based on displayed project)
  const navIdx = navigableProjects.findIndex((np) => np.id === p.id);
  const screenshots = p.screenshots || [p.img];
  const isTransitioning = phase === PHASE_DELETING;

  return (
    <motion.div
      className="proj-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className={`proj-modal${forceKill ? ' proj-modal-force-kill' : ''}`}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30, filter: 'blur(6px)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
      >
        {/* Spotlight effect */}
        <div
          className="proj-modal-spotlight"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.06), transparent 40%)`,
          }}
        />

        {/* Force kill overlay */}
        <AnimatePresence>
          {forceKill && (
            <motion.div
              className="proj-modal-force-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="proj-modal-force-text">
                <span style={{ color: '#ff5f57' }}>$</span> kill -9 {Math.floor(Math.random() * 90000 + 10000)}
              </div>
              <div className="proj-modal-force-sub">Process terminated with SIGKILL</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal bar */}
        <div className="proj-modal-bar">
          <div className="terminal-dots">
            <span
              className="terminal-dot"
              style={{ background: '#ff5f57', cursor: 'pointer' }}
              onClick={handleRedDotClick}
            />
            <span className="terminal-dot" style={{ background: '#febc2e' }} />
            <span className="terminal-dot" style={{ background: '#28c840' }} />
          </div>
          <span className="terminal-filename proj-modal-typed-cmd">
            {typedCmd}
            {(phase === PHASE_TYPING || phase === PHASE_DELETING) && (
              <span className="proj-modal-cursor">|</span>
            )}
          </span>
          <div className="proj-modal-nav-arrows">
            {navIdx > 0 && (
              <button
                className="proj-modal-nav-btn"
                onClick={() => !isTransitioning && onNavigate(navigableProjects[navIdx - 1])}
                title="Previous project (←)"
                style={{ opacity: isTransitioning ? 0.3 : 1 }}
              >
                &#9664;
              </button>
            )}
            {navIdx < navigableProjects.length - 1 && (
              <button
                className="proj-modal-nav-btn"
                onClick={() => !isTransitioning && onNavigate(navigableProjects[navIdx + 1])}
                title="Next project (→)"
                style={{ opacity: isTransitioning ? 0.3 : 1 }}
              >
                &#9654;
              </button>
            )}
          </div>
          <button className="proj-modal-close" onClick={onClose}>
            ESC
          </button>
        </div>

        <div className="proj-modal-scanline" />

        {/* Scrollable content with line numbers */}
        <div className="proj-modal-body">
          <div className="proj-modal-content" ref={contentRef} onScroll={handleScroll}>
            {/* Project image / screenshots */}
            <motion.div
              className={`proj-modal-image${imageGlitch ? ' proj-modal-image-glitch' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: typedLines >= 1 ? 1 : 0,
                y: typedLines >= 1 ? 0 : 20,
              }}
              transition={{
                duration: phase === PHASE_DELETING ? 0.15 : 0.5,
                delay: phase === PHASE_DELETING ? 0 : 0.1,
              }}
              onClick={handleImageClick}
            >
              <img
                src={screenshots[activeScreenshot]}
                alt={p.title}
                key={activeScreenshot}
              />
              <div className="proj-modal-image-overlay" />
              {screenshots.length > 1 && (
                <div className="proj-modal-screenshot-dots">
                  {screenshots.map((_, i) => (
                    <button
                      key={i}
                      className={`proj-modal-ss-dot${i === activeScreenshot ? ' active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setActiveScreenshot(i); }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* @Author annotation */}
            <motion.div
              className="proj-modal-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLines >= 1 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="proj-modal-line-num">{getLineNum()}</div>
              <div className="proj-modal-annotation proj-modal-author">
                <span className="proj-modal-at">@</span>
                <span className="proj-modal-anno-name">Author</span>
                <span className="proj-modal-anno-paren">(</span>
                <div className="proj-modal-author-avatar">AB</div>
                <span className="proj-modal-anno-str">"Amir Belaifa"</span>
                <span className="proj-modal-anno-paren">)</span>
              </div>
            </motion.div>

            {/* Annotations header */}
            <motion.div
              className="proj-modal-annotations"
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLines >= 1 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="proj-modal-anno-line">
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-annotation">
                  <span className="proj-modal-at">@</span>
                  <span className="proj-modal-anno-name">Project</span>
                  <span className="proj-modal-anno-paren">(</span>
                  <span className="proj-modal-anno-str">"{p.title}"</span>
                  <span className="proj-modal-anno-paren">)</span>
                </div>
              </div>
              <div className="proj-modal-anno-line">
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-annotation">
                  <span className="proj-modal-at">@</span>
                  <span className="proj-modal-anno-name">Version</span>
                  <span className="proj-modal-anno-paren">(</span>
                  <span className="proj-modal-anno-str">"{p.year}"</span>
                  <span className="proj-modal-anno-paren">)</span>
                </div>
              </div>
              <div className="proj-modal-anno-line">
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-annotation">
                  <span className="proj-modal-at">@</span>
                  <span className="proj-modal-anno-name">Status</span>
                  <span className="proj-modal-anno-paren">(</span>
                  <span className="proj-modal-anno-status" style={{ color: statusColor }}>
                    {statusText}
                  </span>
                  <span className="proj-modal-anno-paren">)</span>
                  <span
                    className="proj-modal-status-dot"
                    style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}80` }}
                  />
                </div>
              </div>
              <div className="proj-modal-anno-line">
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-annotation">
                  <span className="proj-modal-at">@</span>
                  <span className="proj-modal-anno-name">Category</span>
                  <span className="proj-modal-anno-paren">(</span>
                  <span className="proj-modal-anno-str">"{p.category}"</span>
                  <span className="proj-modal-anno-paren">)</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="proj-modal-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLines >= 2 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="proj-modal-line-num">{getLineNum()}</div>
              <div className="proj-modal-comment">// ── Description ──</div>
            </motion.div>
            <motion.div
              className="proj-modal-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLines >= 2 ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="proj-modal-line-num">{getLineNum()}</div>
              <p className="proj-modal-desc">
                {p.longDesc || p.desc}
              </p>
            </motion.div>

            {/* Metrics */}
            {p.metrics && (
              <motion.div
                className="proj-modal-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: typedLines >= 3 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-comment">// ── Metrics ──</div>
                <div className="proj-modal-metrics">
                  <div className="proj-modal-metric">
                    <span className="proj-modal-metric-value">{p.metrics.loc}</span>
                    <span className="proj-modal-metric-label">lines of code</span>
                  </div>
                  <div className="proj-modal-metric-sep" />
                  <div className="proj-modal-metric">
                    <span className="proj-modal-metric-value">{p.metrics.commits}</span>
                    <span className="proj-modal-metric-label">commits</span>
                  </div>
                  <div className="proj-modal-metric-sep" />
                  <div className="proj-modal-metric">
                    <span className="proj-modal-metric-value">{p.metrics.files}</span>
                    <span className="proj-modal-metric-label">files</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tech Stack */}
            <motion.div
              className="proj-modal-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLines >= 4 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="proj-modal-line-num">{getLineNum()}</div>
              <div className="proj-modal-comment">// ── Dependencies ──</div>
              <div className="proj-modal-tree">
                {p.tech.map((t, i) => {
                  const isLast = i === p.tech.length - 1;
                  return (
                    <motion.div
                      key={t}
                      className="proj-modal-tree-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      <span className="proj-tree-marker">{isLast ? '└──' : '├──'}</span>
                      {techLogos[t] && (
                        <img src={techLogos[t]} alt={t} className="proj-modal-tech-icon" />
                      )}
                      <span className="proj-modal-tech-name">{t}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Features */}
            {p.features && p.features.length > 0 && (
              <motion.div
                className="proj-modal-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: typedLines >= 5 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-comment">// ── Features ──</div>
                <div className="proj-modal-tree">
                  {p.features.map((f, i) => {
                    const isLast = i === p.features.length - 1;
                    return (
                      <motion.div
                        key={i}
                        className="proj-modal-tree-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                      >
                        <span className="proj-tree-marker">{isLast ? '└──' : '├──'}</span>
                        <span className="proj-modal-feature-check">&#10004;</span>
                        <span className="proj-modal-feature-text">{f}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Progress (if in-progress) */}
            {p.progress !== undefined && (
              <motion.div
                className="proj-modal-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: typedLines >= 6 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-comment">// ── Progress ──</div>
                <div className="proj-modal-progress">
                  <div className="proj-modal-progress-track">
                    <motion.div
                      className="proj-modal-progress-fill"
                      initial={{ width: '0%' }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                  <span className="proj-modal-progress-pct">{p.progress}%</span>
                </div>
              </motion.div>
            )}

            {/* Links */}
            {(p.github || p.demo) && (
              <motion.div
                className="proj-modal-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: typedLines >= 6 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="proj-modal-line-num">{getLineNum()}</div>
                <div className="proj-modal-comment">// ── Links ──</div>
                <div className="proj-modal-links">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-modal-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-modal-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              className="proj-modal-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLines >= 7 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="proj-modal-line-num">{getLineNum()}</div>
              <div className="proj-modal-separator" />
              <span className="proj-modal-exit-code">
                Process exited with code <span style={{ color: '#28c840' }}>0</span>
              </span>
            </motion.div>

            {/* Hidden comment easter egg — appears when scrolled to bottom */}
            <motion.div
              className="proj-modal-hidden-comment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showHiddenComment ? 1 : 0, y: showHiddenComment ? 0 : 10 }}
              transition={{ duration: 0.6 }}
            >
              <span className="proj-modal-line-num" style={{ opacity: 0.3 }}>{getLineNum()}</span>
              <span className="proj-modal-hidden-text">// TODO: add more features here</span>
            </motion.div>

            {/* Navigation hint */}
            <motion.div
              className="proj-modal-nav-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: typedLines >= 7 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span>&#9664; &#9654;</span> arrow keys to navigate
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ---- 3D Tilt Project Card ----
const ProjectCard = ({ project, index, onSelect }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 25 });

  const isClickable = project.category !== 'Professionnel';

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

  const handleClick = () => {
    if (isClickable) onSelect(project);
  };

  const isInProgress = project.status === 'in-progress';
  const statusColor = isInProgress ? '#febc2e' : '#28c840';
  const statusText = isInProgress ? 'en cours' : 'deployed';

  return (
    <motion.div
      style={{ perspective: 1000 }}
      layout
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
    >
      <motion.div
        ref={cardRef}
        className={`skill-card-3d${isHovered ? ' hovered' : ''}${isClickable ? ' proj-clickable' : ''}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="skill-card-inner terminal-body">
          {/* Spotlight */}
          <div
            className="skill-card-spotlight"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
            }}
          />
          <div className="terminal-scanline" />

          {/* Terminal bar */}
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span className="terminal-dot" style={{ background: '#ff5f57' }} />
              <span className="terminal-dot" style={{ background: '#febc2e' }} />
              <span className="terminal-dot" style={{ background: '#28c840' }} />
            </div>
            <span className="terminal-filename">{`com.amir.projects.${project.id}`}</span>
          </div>

          {/* Project header — thumbnail + info */}
          <div className="proj-header">
            <div className="proj-thumb">
              <img src={project.img} alt={project.title} loading="lazy" />
            </div>
            <div className="proj-info">
              <h3 className="proj-title">
                <EncryptedText
                  text={project.title}
                  charset={HACKER_CHARSET}
                  animateOn="view"
                  maxDuration={800}
                  flipDelayMs={25}
                  encryptedStyle={{ color: '#818cf8', opacity: 0.7 }}
                  revealedStyle={{ color: '#fff' }}
                />
              </h3>
              <span className="proj-subtitle">{project.subtitle}</span>
              <div className="proj-meta-tree">
                <div className="proj-meta-line">
                  <span className="proj-tree-marker">├──</span>
                  <span className="proj-category-badge">{project.category}</span>
                </div>
                {project.client && (
                  <div className="proj-meta-line">
                    <span className="proj-tree-marker">├──</span>
                    <span className="proj-meta-value">{project.client}</span>
                  </div>
                )}
                <div className="proj-meta-line">
                  <span className="proj-tree-marker">└──</span>
                  <span className="proj-meta-value">{project.year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={`proj-desc-block${project.category === 'Professionnel' ? ' proj-desc-redacted' : ''}`}>
            <p>{project.desc}</p>
            {project.category === 'Professionnel' && (
              <div className="proj-redacted-overlay">
                <span className="proj-redacted-label">REDACTED</span>
              </div>
            )}
          </div>

          {/* Tech dependencies */}
          <div className="proj-deps">
            {project.tech.map((t) => (
              <motion.span
                key={t}
                className="proj-dep-chip"
                whileHover={{ scale: 1.08, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {techLogos[t] && (
                  <img src={techLogos[t]} alt={t} className="proj-dep-icon" />
                )}
                <span>{t}</span>
              </motion.span>
            ))}
          </div>

          {/* Progress / Status */}
          <div className="proj-status-bar">
            {project.progress !== undefined ? (
              <div className="proj-progress-row">
                <div className="terminal-progress-track">
                  <motion.div
                    className="terminal-progress-fill"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${project.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
                <span className="proj-progress-pct">{project.progress}%</span>
              </div>
            ) : (
              <div className="proj-deployed-line" />
            )}
            <div className="proj-status-indicator">
              <span
                className="proj-status-dot"
                style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}80` }}
              />
              <span className="proj-status-text">{statusText}</span>
            </div>
          </div>

          {/* Click hint for non-professional projects */}
          {isClickable && (
            <div className="proj-click-hint">
              <span className="proj-click-hint-text">
                <span style={{ color: '#818cf8' }}>~$</span> click to inspect
              </span>
              <span className="proj-click-hint-cursor">_</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ---- Main Section ----
const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState(null);

  // Easter egg: track unique modals opened for "Inspector" achievement
  const openedModalsRef = useRef(new Set());
  const modalOpenTimesRef = useRef([]);

  // Easter egg: rapid open/close detection for StackOverflow
  const [showStackOverflow, setShowStackOverflow] = useState(false);

  const filteredProjects = useMemo(
    () =>
      activeFilter === 'Tous'
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter]
  );

  const resultCount = filteredProjects.length;

  // Track modal opens for easter eggs
  const handleSelectProject = useCallback((project) => {
    const now = Date.now();
    modalOpenTimesRef.current.push(now);

    // Rapid open/close detection: 3 opens within 2 seconds
    const recent = modalOpenTimesRef.current.filter((t) => now - t < 2000);
    modalOpenTimesRef.current = recent;
    if (recent.length >= 3) {
      modalOpenTimesRef.current = [];
      setShowStackOverflow(true);
      setTimeout(() => setShowStackOverflow(false), 4000);
      // Unlock achievement via event
      window.dispatchEvent(new CustomEvent('ee-unlock', { detail: 'stackoverflow' }));
      return;
    }

    // Track unique modals opened
    openedModalsRef.current.add(project.id);
    if (openedModalsRef.current.size >= 3) {
      window.dispatchEvent(new CustomEvent('ee-unlock', { detail: 'inspector' }));
    }

    setSelectedProject(project);
  }, []);

  const handleNavigate = useCallback((project) => {
    openedModalsRef.current.add(project.id);
    if (openedModalsRef.current.size >= 3) {
      window.dispatchEvent(new CustomEvent('ee-unlock', { detail: 'inspector' }));
    }
    setSelectedProject(project);
  }, []);

  const handleImageEasterEgg = useCallback(() => {
    window.dispatchEvent(new CustomEvent('ee-unlock', { detail: 'imageglitch' }));
  }, []);

  const handleRedDotEasterEgg = useCallback(() => {
    window.dispatchEvent(new CustomEvent('ee-unlock', { detail: 'forcekill' }));
  }, []);

  return (
    <section className="projects-section">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          title="Projets &amp; R&eacute;alisations"
          subtitle="D&eacute;couvrez mes derniers projets et cr&eacute;ations"
          subtitleDuration={2500}
        />

        {/* Terminal-style filter bar */}
        <motion.div
          className="proj-filter-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="proj-filter-prompt">
            <span className="terminal-prompt" style={{ color: '#818cf8' }}>~$</span>{' '}
            <EncryptedText
              text="ls projects/ --type="
              charset={HACKER_CHARSET}
              animateOn="view"
              maxDuration={1000}
              flipDelayMs={30}
              className="terminal-cmd-text"
              encryptedStyle={{ color: '#818cf8', opacity: 0.6 }}
              revealedStyle={{ color: '#6b6b80' }}
            />
          </div>
          <div className="proj-filter-options">
            {filterCategories.map((cat) => (
              <motion.button
                key={cat}
                className={`proj-filter-btn${activeFilter === cat ? ' active' : ''}`}
                onClick={() => setActiveFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Result count */}
        <motion.div
          className="proj-result-count"
          key={activeFilter}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="terminal-prompt" style={{ color: '#28c840' }}>&gt;</span>{' '}
          Found {resultCount} matching {resultCount === 1 ? 'entry' : 'entries'}
        </motion.div>

        {/* Project grid */}
        <div className="proj-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={handleSelectProject}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNavigate={handleNavigate}
            onImageEasterEgg={handleImageEasterEgg}
            onRedDotEasterEgg={handleRedDotEasterEgg}
          />
        )}
      </AnimatePresence>

      {/* StackOverflow Easter Egg Toast */}
      <AnimatePresence>
        {showStackOverflow && (
          <motion.div
            className="proj-stackoverflow-toast"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="proj-stackoverflow-header">
              <span style={{ color: '#ff5f57' }}>java.lang.StackOverflowError</span>
            </div>
            <div className="proj-stackoverflow-trace">
              <div>at com.amir.projects.Modal.open(Modal.java:42)</div>
              <div>at com.amir.projects.Modal.close(Modal.java:43)</div>
              <div>at com.amir.projects.Modal.open(Modal.java:42)</div>
              <div style={{ color: '#555' }}>... 2048 more</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;
