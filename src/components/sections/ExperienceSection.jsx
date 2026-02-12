import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { EncryptedText } from '../ui/encrypted-text';
import { experience } from '../../data/experience';
import techLogos from '../../data/techLogos';

const HACKER_CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

const ExperienceSection = () => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-4, 4]), { stiffness: 150, damping: 25 });

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
    <section className="experience-section">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          title="Exp&eacute;rience Professionnelle"
          subtitle="Mon parcours dans le d&eacute;veloppement logiciel"
          subtitleDuration={2500}
        />

        <motion.div
          style={{ perspective: 800 }}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <motion.div
            ref={cardRef}
            className={`skill-card-3d exp-card${isHovered ? ' hovered' : ''}`}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="skill-card-inner terminal-body">
              {/* Spotlight + scanline */}
              <div
                className="skill-card-spotlight"
                style={{
                  opacity: isHovered ? 1 : 0,
                  background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
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
                <span className="terminal-filename">career.log</span>
              </div>

              {/* Git log header */}
              <div className="exp-git-header">
                <div className="exp-git-line">
                  <span className="exp-git-keyword">commit</span>
                  <span className="exp-git-hash">a3f7b2e</span>
                  <span className="exp-git-head">(HEAD -&gt; main)</span>
                </div>
                <div className="exp-git-line">
                  <span className="exp-git-keyword">Author:</span>
                  <span className="exp-git-value">
                    developer@{experience.company.toLowerCase().replace(/\s/g, '')}.dz
                  </span>
                </div>
                <div className="exp-git-line">
                  <span className="exp-git-keyword">Date:</span>
                  <span className="exp-git-value">{experience.period}</span>
                </div>
              </div>

              {/* Commit message — role + company */}
              <div className="exp-commit-msg">
                <h3 className="exp-role">
                  <EncryptedText
                    text={`${experience.role} @ ${experience.company}`}
                    charset={HACKER_CHARSET}
                    animateOn="view"
                    maxDuration={1200}
                    flipDelayMs={30}
                    encryptedStyle={{ color: '#818cf8', opacity: 0.7 }}
                    revealedStyle={{ color: '#fff' }}
                  />
                </h3>
                {experience.companyNote && (
                  <span className="exp-company-note">({experience.companyNote})</span>
                )}
                <p className="exp-intro">{experience.intro}</p>
              </div>

              {/* Command: list responsibilities */}
              <div className="terminal-command-line" style={{ paddingBottom: '0.5rem' }}>
                <span className="terminal-prompt" style={{ color: '#818cf8' }}>~$</span>{' '}
                <EncryptedText
                  text="git log --oneline responsibilities"
                  charset={HACKER_CHARSET}
                  animateOn="view"
                  maxDuration={1000}
                  flipDelayMs={30}
                  className="terminal-cmd-text"
                  encryptedStyle={{ color: '#818cf8', opacity: 0.6 }}
                  revealedStyle={{ color: '#e2e8f0' }}
                />
                <span className="terminal-cursor">_</span>
              </div>

              {/* Responsibilities */}
              <div className="exp-responsibilities">
                {experience.responsibilities.map((item, i) => (
                  <motion.div
                    key={i}
                    className="exp-resp-item"
                    initial={{ opacity: 0, x: -15, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.07 + 0.3,
                      duration: 0.45,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                  >
                    <motion.span
                      className="exp-resp-check"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.07 + 0.5,
                        type: 'spring',
                        stiffness: 500,
                        damping: 15,
                      }}
                    >
                      ✓
                    </motion.span>
                    <span className="exp-resp-text">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* Tech stack */}
              <div className="exp-tech-row">
                <span className="exp-tech-label">stack:</span>
                <div className="exp-tech-chips">
                  {experience.tech.map((t) => (
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
              </div>

              {/* Status line */}
              <div className="terminal-status-line">
                <span className="terminal-status-dot" />
                <span>active — {experience.period}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
