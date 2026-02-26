import React, { useState } from 'react';
import HeroSection from '../sections/HeroSection';
import SkillsSection from '../sections/SkillsSection';
import ProjectsSection from '../sections/ProjectsSection';
import ExperienceSection from '../sections/ExperienceSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../common/Footer';
import Terminal from '../ui/Terminal';
import EasterEgg from '../ui/easter-egg';
import CustomCursor from '../ui/CustomCursor';
import ScrollProgress from '../ui/ScrollProgress';
import PhysicsExplosion from '../ui/PhysicsExplosion';
import VHSGlitch from '../ui/VHSGlitch';
import '../../styles/portfolio.css';

const PortfolioLayout = () => {
  const [isTerminalVisible, setTerminalVisible] = useState(false);

  const openTerminal = () => setTerminalVisible(true);
  const closeTerminal = () => setTerminalVisible(false);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <PhysicsExplosion />
      <VHSGlitch />
      <EasterEgg />
      <div className="portfolio-wrapper">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
        {/* <ActivitySection /> */}
      </div>
      <Footer onOpenTerminal={openTerminal} />
      <Terminal isVisible={isTerminalVisible} onClose={closeTerminal} />
    </>
  );
};

export default PortfolioLayout;
