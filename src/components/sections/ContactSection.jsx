import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import Footer from '../common/Footer';
import { containerVariants, itemVariants } from '../../constants/animations';
import { contactInfo } from '../../data/contact';

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <SectionHeader
            title="Restons en Contact"
            subtitle="N'h&eacute;sitez pas &agrave; me contacter pour vos projets"
            variants={itemVariants}
          />

          <div className="contact-grid">
            {contactInfo.map((info) => (
              <motion.div key={info.label} className="contact-card" variants={itemVariants}>
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {info.iconPaths
                      ? info.iconPaths.map((d, i) => <path key={i} d={d} />)
                      : <path d={info.iconPath} />
                    }
                  </svg>
                </div>
                <p className="contact-label">{info.label}</p>
                <p className="contact-value">{info.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </section>
  );
};

export default ContactSection;
