import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardSpotlight } from '../ui/card-spotlight';
import SectionHeader from '../common/SectionHeader';
import { containerVariants, itemVariants } from '../../constants/animations';
import { completedProjects, inProgressProjects } from '../../data/projects';

const ProjectsSection = () => {
  const allProjects = [...completedProjects, ...inProgressProjects];
  const [filteredProjects] = useState(allProjects);

  return (
    <section className="projects-section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <SectionHeader
            title="Projets &amp; R&eacute;alisations"
            subtitle="D&eacute;couvrez mes derniers projets et cr&eacute;ations"
            variants={itemVariants}
          />

          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <CardSpotlight
                key={project.id}
                className="project-card"
                style={{ cursor: 'pointer' }}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  style={{ height: '100%' }}
                >
                  <div className="project-image-wrapper">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="project-image"
                      loading="lazy"
                    />
                    {project.status === 'in-progress' && (
                      <div className="project-status-badge">
                        <span className="status-dot"></span>
                        En cours
                      </div>
                    )}
                  </div>

                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.desc}</p>

                    {project.progress !== undefined && (
                      <div className="progress-bar-container">
                        <div className="progress-label">
                          <span>Progression</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${project.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="project-tech">
                      {project.tech.map((t) => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </CardSpotlight>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
