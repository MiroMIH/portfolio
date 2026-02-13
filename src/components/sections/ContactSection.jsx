import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import Footer from '../common/Footer';
import { EncryptedText } from '../ui/encrypted-text';
import { contactInfo, socialLinks } from '../../data/contact';

const HACKER_CHARSET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

// ---- Reusable 3D Tilt Card ----
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

// ---- Contact Section ----
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      formData.subject || 'Contact depuis le Portfolio'
    );
    const body = encodeURIComponent(
      `De: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:amirbelaifa2001@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section">
      {/* Background effects */}
      <div className="contact-bg-grid" />
      <div className="contact-bg-mask" />
      <div className="contact-glow-orb contact-glow-1" />
      <div className="contact-glow-orb contact-glow-2" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          title="Restons en Contact"
          subtitle="N'hésitez pas à me contacter pour vos projets"
          subtitleDuration={2500}
        />

        {/* Connection signal bar */}
        <motion.div
          className="contact-signal-bar"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="contact-signal-line" />
          <div className="contact-signal-badge">
            <span className="contact-signal-dot" />
            <span className="contact-signal-text">CONNEXION ACTIVE</span>
          </div>
          <div className="contact-signal-line" />
        </motion.div>

        {/* Two-column layout */}
        <div className="contact-layout">
          {/* ======= Left: Network Info ======= */}
          <TiltCard className="contact-card-left" delay={0}>
            {/* Terminal bar */}
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="terminal-filename">network.scan</span>
            </div>

            {/* Scan command */}
            <div className="terminal-command-line">
              <span className="terminal-prompt" style={{ color: '#818cf8' }}>
                ~$
              </span>{' '}
              <EncryptedText
                text="nmap --scan-ports @amir.dev"
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

            {/* Scan results header */}
            <motion.div
              className="contact-scan-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <span>PORT</span>
              <span>SERVICE</span>
              <span>STATE</span>
            </motion.div>

            {/* Contact items as scan results */}
            {contactInfo.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.href || '#'}
                className="contact-net-item"
                initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1 + 0.8,
                  duration: 0.5,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                whileHover={{
                  scale: 1.02,
                  x: 4,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
              >
                <span className="contact-net-port">:{info.port}</span>
                <div className="contact-net-info">
                  <span className="contact-net-label">{info.protocol}</span>
                  <span className="contact-net-value">{info.value}</span>
                </div>
                <motion.span
                  className="contact-net-status"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1 + 1.2,
                    type: 'spring',
                    stiffness: 500,
                    damping: 15,
                  }}
                >
                  <span className="contact-status-dot-green" />
                  open
                </motion.span>
              </motion.a>
            ))}

            <div className="contact-divider" />

            {/* Social connections */}
            <div className="terminal-command-line" style={{ marginTop: '0.25rem' }}>
              <span className="terminal-prompt" style={{ color: '#38bdf8' }}>
                ~$
              </span>{' '}
              <EncryptedText
                text="ls --connections --active"
                charset={HACKER_CHARSET}
                animateOn="view"
                maxDuration={1000}
                flipDelayMs={30}
                className="terminal-cmd-text"
                encryptedStyle={{ color: '#38bdf8', opacity: 0.6 }}
                revealedStyle={{ color: '#e2e8f0' }}
              />
              <span className="terminal-cursor">_</span>
            </div>

            {socialLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-item"
                initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1 + 1.5,
                  duration: 0.5,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                whileHover={{
                  scale: 1.04,
                  x: 6,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
              >
                <svg
                  className="contact-social-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d={link.iconPath} />
                </svg>
                <span className="contact-social-name">{link.label}</span>
                <span className="contact-social-user">{link.username}</span>
                <span className="contact-social-arrow">&rarr;</span>
              </motion.a>
            ))}

            {/* Status line */}
            <motion.div
              className="terminal-status-line"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2.0 }}
            >
              <span className="terminal-status-dot" />
              <span>all ports responding — latency 12ms</span>
            </motion.div>
          </TiltCard>

          {/* ======= Right: Message Form ======= */}
          <TiltCard className="contact-card-right" delay={0.15}>
            {/* Terminal bar */}
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="terminal-filename">compose.msg</span>
            </div>

            {/* Compose command */}
            <div className="terminal-command-line">
              <span className="terminal-prompt" style={{ color: '#a855f7' }}>
                ~$
              </span>{' '}
              <EncryptedText
                text="mail --compose --to=amir"
                charset={HACKER_CHARSET}
                animateOn="view"
                maxDuration={1200}
                flipDelayMs={30}
                className="terminal-cmd-text"
                encryptedStyle={{ color: '#a855f7', opacity: 0.7 }}
                revealedStyle={{ color: '#e2e8f0' }}
              />
              <span className="terminal-cursor">_</span>
            </div>

            {/* Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              {[
                { key: 'name', label: 'nom', type: 'text', placeholder: 'Votre nom...' },
                { key: 'email', label: 'email', type: 'email', placeholder: 'votre@email.com' },
                {
                  key: 'subject',
                  label: 'sujet',
                  type: 'text',
                  placeholder: 'Sujet du message...',
                },
              ].map((field, i) => (
                <motion.div
                  key={field.key}
                  className={`contact-input-row${
                    focusedField === field.key ? ' focused' : ''
                  }`}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.5, duration: 0.4 }}
                >
                  <label className="contact-input-label">
                    <span className="contact-input-arrow">&gt;</span> {field.label}:
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    onChange={handleChange(field.key)}
                    onFocus={() => setFocusedField(field.key)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={field.placeholder}
                    className="contact-input"
                    required
                  />
                </motion.div>
              ))}

              {/* Textarea */}
              <motion.div
                className={`contact-input-row contact-textarea-row${
                  focusedField === 'message' ? ' focused' : ''
                }`}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.74, duration: 0.4 }}
              >
                <label className="contact-input-label">
                  <span className="contact-input-arrow">&gt;</span> message:
                </label>
                <textarea
                  value={formData.message}
                  onChange={handleChange('message')}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Votre message..."
                  className="contact-input contact-textarea"
                  rows={5}
                  required
                />
              </motion.div>

              {/* Encryption bar */}
              <div className="contact-encrypt-bar">
                <div className="terminal-progress-track">
                  <motion.div
                    className="terminal-progress-fill"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    }}
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.8,
                      delay: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                </div>
                <span className="contact-encrypt-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  chiffré
                </span>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                className="contact-submit-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="contact-submit-text">TRANSMETTRE</span>
                <span className="contact-submit-arrows">&gt;&gt;</span>
              </motion.button>
            </form>

            {/* Status line */}
            <motion.div
              className="terminal-status-line"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 2.0 }}
            >
              <span className="terminal-status-dot" />
              <span>canal sécurisé — chiffrement activé</span>
            </motion.div>
          </TiltCard>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default ContactSection;
