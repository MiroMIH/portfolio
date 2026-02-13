import React from 'react';
import { motion } from 'framer-motion';
import { socialLinks } from '../../data/contact';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      {/* Main footer content */}
      <motion.div
        className="footer-main"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      >
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-bracket">{'{'}</span>
              <span className="footer-logo-text">AB</span>
              <span className="footer-logo-bracket">{'}'}</span>
            </div>
            <h3 className="footer-brand-name">BELAIFA Amir</h3>
            <p className="footer-brand-role">
              <span className="footer-role-tag">class:</span> Full Stack Developer
            </p>
            <p className="footer-brand-desc">
              Passionné par la création d'expériences web modernes, performantes et innovantes.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              <span className="footer-col-marker">$</span> sitemap
            </h4>
            <nav className="footer-nav-links">
              {['Accueil', 'Compétences', 'Projets', 'Expérience', 'Contact'].map(
                (label, i) => (
                  <motion.span
                    key={label}
                    className="footer-nav-link"
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <span className="footer-tree-char">
                      {i === 4 ? '└──' : '├──'}
                    </span>
                    {label}
                  </motion.span>
                )
              )}
            </nav>
          </div>

          {/* Connect column */}
          <div className="footer-col">
            <h4 className="footer-col-title">
              <span className="footer-col-marker">$</span> connections
            </h4>
            <div className="footer-connect-links">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-connect-link"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="footer-connect-icon"
                  >
                    <path d={link.iconPath} />
                  </svg>
                  <span className="footer-connect-name">{link.label}</span>
                  <span className="footer-connect-user">{link.username}</span>
                </motion.a>
              ))}
              <motion.a
                href="mailto:amirbelaifa2001@gmail.com"
                className="footer-connect-link"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="footer-connect-icon"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="footer-connect-name">Email</span>
                <span className="footer-connect-user">amirbelaifa2001@gmail.com</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-status">
            <span className="footer-status-dot" />
            <span>ONLINE</span>
          </div>

          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} BELAIFA Amir — Tous droits réservés
          </p>

          <motion.button
            className="footer-top-btn"
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="footer-top-cmd">cd ~</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
