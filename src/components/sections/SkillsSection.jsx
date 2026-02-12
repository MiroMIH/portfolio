import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader';
import { containerVariants, itemVariants } from '../../constants/animations';
import { skillCategories } from '../../data/skills';
import techLogos from '../../data/techLogos';

const SkillsSection = () => {
  return (
    <section className="skills-section">
      <div className="container">
        <SectionHeader
          title="Comp&eacute;tences &amp; Technologies"
          subtitle="Ma&icirc;trise des technologies modernes pour cr&eacute;er des exp&eacute;riences exceptionnelles"
          subtitleDuration={3500}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="skills-grid">
            {skillCategories.map((category) => (
              <motion.div key={category.title} className="skill-category" variants={itemVariants}>
                <h3 className="skill-category-title">{category.title}</h3>
                <div className="tech-logos">
                  {category.techs.map((tech) => (
                    <div key={tech} className="tech-logo-item">
                      <img src={techLogos[tech]} alt={tech} className="tech-logo" />
                      <span className="tech-name">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
