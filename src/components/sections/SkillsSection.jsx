import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { skillCategories } from '../../data/skills';
import techLogos from '../../data/techLogos';
import { IconCode, IconServer, IconDatabase } from '@tabler/icons-react';

const categoryMeta = {
  'Frontend': {
    Icon: IconCode,
    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
    glow: 'rgba(99, 102, 241, 0.12)',
    shadow: 'rgba(99, 102, 241, 0.35)',
  },
  'Backend': {
    Icon: IconServer,
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    glow: 'rgba(59, 130, 246, 0.12)',
    shadow: 'rgba(6, 182, 212, 0.35)',
  },
  'Bases de données': {
    Icon: IconDatabase,
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    glow: 'rgba(16, 185, 129, 0.12)',
    shadow: 'rgba(16, 185, 129, 0.35)',
  },
};

const SkillCard = ({ category, index }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), {
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

  const meta = categoryMeta[category.title] || categoryMeta['Frontend'];

  return (
    <motion.div
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 80, rotateX: 12, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.18,
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
        <div className="skill-card-inner">
          {/* Mouse-following spotlight */}
          <div
            className="skill-card-spotlight"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${meta.glow}, transparent 40%)`,
            }}
          />

          {/* Header */}
          <div className="skill-card-header">
            <div
              className="skill-card-icon-box"
              style={{ background: meta.gradient, boxShadow: `0 8px 30px ${meta.shadow}` }}
            >
              <meta.Icon size={22} stroke={1.5} color="#fff" />
            </div>
            <div>
              <h3 className="skill-card-title">{category.title}</h3>
              <p className="skill-card-count">{category.techs.length} technologies</p>
            </div>
          </div>

          {/* Gradient divider */}
          <div className="skill-card-divider">
            <div className="skill-card-divider-line" style={{ background: meta.gradient }} />
          </div>

          {/* Tech chips */}
          <div className="skill-card-techs">
            {category.techs.map((tech, i) => (
              <motion.div
                key={tech}
                className="skill-tech-chip"
                initial={{ opacity: 0, scale: 0.4, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.18 + i * 0.055 + 0.35,
                  duration: 0.55,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                whileHover={{
                  scale: 1.12,
                  y: -6,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
              >
                <img src={techLogos[tech]} alt={tech} className="skill-tech-logo-new" />
                <span className="skill-tech-label">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SkillsSection = () => {
  return (
    <section className="skills-section">
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
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
