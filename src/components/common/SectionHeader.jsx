import React from 'react';
import { motion } from 'framer-motion';
import { EncryptedText } from '../ui/encrypted-text';

const SectionHeader = ({ title, subtitle, subtitleDuration = 1800, variants }) => {
  return (
    <>
      <motion.h2
        className="section-title"
        {...(variants
          ? { variants }
          : {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, ease: 'easeOut' },
            })}
      >
        {title}
      </motion.h2>
      <p className="section-subtitle">
        <EncryptedText text={subtitle} maxDuration={subtitleDuration} />
      </p>
    </>
  );
};

export default SectionHeader;
