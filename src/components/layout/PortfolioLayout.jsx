import React from 'react';
import { TracingBeam } from '../ui/tracing-beam';
import HeroSection from '../sections/HeroSection';
import SkillsSection from '../sections/SkillsSection';
import ProjectsSection from '../sections/ProjectsSection';
import ExperienceSection from '../sections/ExperienceSection';
import ContactSection from '../sections/ContactSection';
import EasterEgg from '../ui/easter-egg';
import '../../styles/portfolio.css';

const PortfolioLayout = () => {
  return (
    <>
      <EasterEgg />
      <div className="portfolio-wrapper">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </div>
    </>
  );
};

export default PortfolioLayout;
