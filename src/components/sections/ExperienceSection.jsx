import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { containerVariants, itemVariants } from '../../constants/animations';
import { experience } from '../../data/experience';

const ExperienceSection = () => {
  return (
    <section className="experience-section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <SectionHeader
            title="Exp&eacute;rience Professionnelle"
            subtitle="Mon parcours dans le d&eacute;veloppement logiciel"
            variants={itemVariants}
          />

          <motion.div className="experience-card" variants={itemVariants}>
            <div className="experience-header">
              <h3 className="experience-company">{experience.company}</h3>
              <span className="experience-period">{experience.period}</span>
            </div>
            <p className="experience-role">{experience.role}</p>
            <div className="experience-desc text-gray-700 leading-relaxed">
              <p style={{ marginBottom: '1.5rem' }}>{experience.intro}</p>
              <ul className="list-disc list-inside space-y-4">
                {experience.bullets.map((bullet, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: bullet }} />
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
