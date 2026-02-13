import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { EncryptedText } from '../ui/encrypted-text';
import { projects, filterCategories } from '../../data/projects';
import techLogos from '../../data/techLogos';

const HACKER_CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

// ---- 3D Tilt Project Card ----
const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 25 });

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
        className={`skill-card-3d${isHovered ? ' hovered' : ''}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
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
          <div className="proj-desc-block">
            <p>{project.desc}</p>
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
        </div>
      </motion.div>
    </motion.div>
  );
};

// ---- Main Section ----
const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filteredProjects = useMemo(
    () =>
      activeFilter === 'Tous'
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter]
  );

  const resultCount = filteredProjects.length;

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
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
