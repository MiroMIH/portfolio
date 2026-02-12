import React from 'react';
import { motion } from 'framer-motion';
import { Spotlight } from '../ui/spotlight';
import { FlipWords } from '../ui/flip-words';
import { TextGenerateEffect } from '../ui/text-generate-effect';
import { Meteors } from '../ui/meteors';
import { hero } from '../../data/hero';

const HeroSection = () => {
  return (
    <section className="hero-section-new">
      {/* Grid background */}
      <div className="hero-grid-bg" />
      {/* Radial fade mask */}
      <div className="hero-grid-mask" />

      {/* Meteors */}
      <Meteors number={12} />

      {/* Spotlights */}
      <Spotlight fill="#6366f1" style={{ top: '-40%', left: '0' }} />
      <Spotlight fill="#a855f7" style={{ top: '-30%', right: '0', left: 'auto' }} />

      {/* Floating tech icons */}
      {hero.floatingIcons.map((item, i) => (
        <motion.img
          key={i}
          src={item.icon}
          alt=""
          className="hero-floating-icon"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 1.5 + item.delay, duration: 2 }}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            animationDelay: `${item.delay}s`,
          }}
        />
      ))}

      {/* Hero Content */}
      <div className="hero-content-new">
        {/* Avatar with spinning gradient border */}
        <motion.div
          className="hero-avatar-wrapper"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
        >
          <div className="hero-avatar-glow" />
          <div className="hero-avatar-ring" />
          <div className="hero-avatar-inner">
            <span className="hero-avatar-text">{hero.initials}</span>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="hero-name-new"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {hero.name}
        </motion.h1>

        {/* FlipWords role line */}
        <motion.div
          className="hero-role-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="hero-role-prefix">I am a</span>
          <FlipWords
            words={hero.roles}
            duration={3000}
            style={{
              color: '#a78bfa',
              fontWeight: 700,
            }}
          />
        </motion.div>

        {/* Bio with text generate effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <TextGenerateEffect
            words={hero.bio}
            style={{ maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.8 }}
            duration={0.4}
          />
        </motion.div>

        {/* CTA Button with shimmer */}
        <motion.a
          href={hero.cvUrl}
          download="CV_Amir_Belaifa.pdf"
          className="hero-shimmer-btn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          T&eacute;l&eacute;charger mon CV
        </motion.a>

        {/* Secondary links */}
        <motion.div
          className="hero-secondary-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <a href={`mailto:${hero.email}`}>{hero.email}</a>
          <div className="hero-secondary-dot" />
          <span>{hero.location}</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-new"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg style={{ width: 20, height: 20, color: '#444' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
