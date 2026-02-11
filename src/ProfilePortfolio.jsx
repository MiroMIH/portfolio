// ProfilePortfolio.jsx - Ultra-modern developer portfolio with tech logos and stunning design
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #0a0a0a;
}

.portfolio-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%);
  position: relative;
  overflow: hidden;
}

.hero-gradient {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.hero-gradient-2 {
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  z-index: 1;
  text-align: center;
}

.hero-avatar {
  width: 160px;
  height: 160px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4);
  border: 4px solid rgba(99, 102, 241, 0.2);
}

.hero-initials {
  color: white;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.hero-name {
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #fff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-title {
  font-size: 1.8rem;
  color: #a0a0b0;
  font-weight: 400;
  margin-bottom: 2rem;
}

.hero-bio {
  max-width: 700px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #8a8a9e;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.2rem 2.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(99, 102, 241, 0.5);
}

.scroll-indicator {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

.skills-section {
  padding: 8rem 2rem;
  background: #0f0f1e;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  text-align: center;
  color: #8a8a9e;
  font-size: 1.2rem;
  margin-bottom: 4rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.skill-category {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.skill-category:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-5px);
}

.skill-category-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #fff;
}

.tech-logos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tech-logo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 80px;
}

.tech-logo-item:hover {
  background: rgba(99, 102, 241, 0.1);
  transform: scale(1.05);
}

.tech-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.tech-name {
  font-size: 0.75rem;
  color: #a0a0b0;
  font-weight: 500;
  text-align: center;
}

.projects-section {
  padding: 8rem 2rem;
  background: #0a0a0a;
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.8rem 1.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: #a0a0b0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.filter-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border-color: transparent;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2.5rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-10px);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2);
}

.project-image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-card:hover .project-image {
  transform: scale(1.1);
}

.project-status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.project-content {
  padding: 2rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
}

.project-desc {
  color: #8a8a9e;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.progress-bar-container {
  margin-bottom: 1rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #8a8a9e;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
  border-radius: 10px;
  transition: width 1s ease-out;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #a5b4fc;
  font-weight: 600;
  text-decoration: none;
  transition: gap 0.3s ease;
}

.project-link:hover {
  gap: 0.75rem;
  color: #c7d2fe;
}

.link-icon {
  width: 18px;
  height: 18px;
}

.experience-section {
  padding: 8rem 2rem;
  background: #0f0f1e;
}

.experience-card {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 3rem;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.experience-company {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.experience-period {
  padding: 0.6rem 1.5rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
}

.experience-role {
  font-size: 1.3rem;
  color: #a855f7;
  font-weight: 600;
  margin-bottom: 1rem;
}

.experience-desc {
  color: #8a8a9e;
  line-height: 1.8;
  font-size: 1.05rem;
}

.contact-section {
  padding: 8rem 2rem 6rem;
  background: #0a0a0a;
  text-align: center;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto 3rem;
}

.contact-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.contact-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-5px);
}

.contact-icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-icon {
  width: 28px;
  height: 28px;
  color: white;
}

.contact-label {
  font-size: 0.9rem;
  color: #8a8a9e;
  margin-bottom: 0.5rem;
}

.contact-value {
  font-size: 1.1rem;
  color: white;
  font-weight: 600;
}

.footer {
  text-align: center;
  padding: 3rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #666;
}

@media (max-width: 768px) {
  .hero-name {
    font-size: 3rem;
  }

  .hero-title {
    font-size: 1.3rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .experience-card {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-name {
    font-size: 2.5rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const ProfilePortfolio = ({ projects, inProgress }) => {
  // Helper function to provide a better default image if a custom one isn't provided
  const getBankingImage = (id) => {
    const images = {
      'SGA POS': 'https://MiroMIH.github.io/portfolio/SGA-LOGO.jpg',
      'SGA SELA': 'https://MiroMIH.github.io/portfolio/SGA-LOGO.jpg',
      'AGB': 'https://MiroMIH.github.io/portfolio/AGB-LOGO.jpg',
      'BEAI': 'https://MiroMIH.github.io/portfolio/BEA-LOGO.jpg',
      'eGov-NLP': 'https://images.unsplash.com/photo-1531746790731-6e3e55c570f7?w=800&h=600&fit=crop',
      'eGov-Mobile': 'https://images.unsplash.com/photo-1588702331599-ced7b134d173?w=800&h=600&fit=crop',
      'RecSys': 'https://images.unsplash.com/photo-1522036495349-43c3f918e7e1?w=800&h=600&fit=crop',
      'vsc': 'https://MiroMIH.github.io/portfolio/VSC-LOGO.jpg',
      'sv': 'https://MiroMIH.github.io/portfolio/SV-EDU.jpg',
      'egov': 'https://MiroMIH.github.io/portfolio/EGOVHUB-WEB.jpg',
      'default': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
    };

    return images[id] || images['default'];
  };

  const sampleProjects = projects || [
    // --- Professional Completed Projects (New) ---
    {
      id: 'prof1',
      title: 'SGA POS - Point of Sale System',
      desc: 'Développement d’une application web POS bancaire pour Société Générale Algérie (SGA), dédiée à la gestion et à l’instruction des demandes de crédits bancaires (crédit consommation, auto, immobilier) en agence. Le système permet la simulation des crédits, la création et le suivi des dossiers clients, l’intégration avec les services bancaires internes, et l’optimisation des parcours conseillers afin de réduire le temps de traitement et améliorer l’expérience utilisateur en agence.',
      img: getBankingImage('SGA POS'),
      tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
      status: 'completed'
    }
    ,
    {
      id: 'prof2',
      title: 'SGA SELA',
      desc: 'Développement d’une plateforme back-office pour SGA visant à centraliser et automatiser le traitement des flux financiers complexes (comptes, virements, paiements, opérations inter-comptes) ainsi que le suivi des opérations de trésorerie et des règlements interbancaires. La plateforme facilite la gestion des transactions en lot, l\'audit de chaque opération, la génération de rapports pour la conformité réglementaire, et offre un tableau de bord pour le suivi des liquidités, des comptes clients, et des écritures comptables internes.',
      img: getBankingImage('SGA SELA'),
      tech: ['Spring Boot', 'Angular', 'PostgreSQL'],
      status: 'completed'
    },
    {
      id: 'prof3',
      title: 'AGB - Système de Banking Digital',
      desc: 'Participation au développement d’une plateforme de banking digital destinée aux clients d’AGB, permettant la consultation des comptes, les virements bancaires, le suivi des opérations et la gestion sécurisée des accès. L’application met l’accent sur la fiabilité, la performance et la sécurité des données, avec une expérience utilisateur fluide sur les canaux web pour les clients particuliers et professionnels.',
      img: getBankingImage('AGB'),
      tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
      status: 'completed'
    },
    // --- Academic/Personal Completed Projects (New) ---
    // {
    //   id: 'pfe1',
    //   title: 'Recommendation System (PFE)',
    //   desc: 'Développement d’un système de recommandation de films basé sur l’analyse de données et le Machine Learning, utilisant des techniques de filtrage collaboratif et de modèles TensorFlow afin de proposer des recommandations personnalisées. Le projet inclut le traitement et l’analyse des données avec Pandas, ainsi qu’une application web complète construite avec le stack MERN pour l’affichage des recommandations, la gestion des utilisateurs et l’interaction en temps réel.',
    //   img: getBankingImage('RecSys'),
    //   tech: ['Python', 'Pandas', 'TensorFlow', 'MongoDB', 'ExpressJS', 'React', 'NodeJS'],
    //   status: 'completed'
    // },
    {
      id: 'pfe2',
      title: 'E-Government NLP Classifier',
      desc: 'Développement d’un système NLP gouvernemental nommé eGovHub, destiné à la collecte, la classification et l’analyse des opinions citoyennes publiées en ligne. La plateforme permet l’analyse des sentiments, l’identification automatique des thématiques clés et la structuration des retours citoyens pour aider à la prise de décision publique. Le projet combine des modèles NLP en Python avec une application web complète basée sur le stack MERN pour la visualisation des résultats et la gestion des données.',
      img: getBankingImage('egov'),
      tech: ['Python', 'NLP', 'MongoDB', 'ExpressJS', 'React', 'NodeJS'],
      status: 'completed'
    }
    ,
    // --- Existing Projects (Kept for continuity) ---
    // {
    //   id: 'p1',
    //   title: 'Dashboard Bancaire',
    //   desc: 'Dashboard admin pour services bancaires numériques avec analytics en temps réel.',
    //   img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    //   tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
    //   status: 'completed'
    // },
    // {
    //   id: 'p2',
    //   title: 'SV-ECO Analytics',
    //   desc: 'Application de suivi et visualisation des données environnementales.',
    //   img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    //   tech: ['React', 'D3', 'MongoDB'],
    //   status: 'completed'
    // },
    // {
    //   id: 'p3',
    //   title: 'Site Vitrine Hôtel',
    //   desc: 'Site responsive pour réservations et présentation avec système de booking.',
    //   img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=600&fit=crop',
    //   tech: ['NextJS', 'TailwindCSS'],
    //   status: 'completed'
    // }
  ];

  const sampleInProgress = inProgress || [
    // --- Professional In Progress (New) ---
    {
      id: 'wip3',
      title: 'BEAI - Back-Office Monétique',
      desc: 'Développement d’une application de front-office et back-office monétique destinée à la supervision et à l’administration des cartes bancaires et des transactions interbancaires. La plateforme permet le suivi des opérations monétiques, la gestion des paramètres cartes, la consultation des historiques de transactions et le contrôle des flux, avec un fort accent sur la sécurité, la traçabilité et la fiabilité des traitements.',
      img: getBankingImage('BEAI'),
      progress: 40,
      tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
      status: 'in-progress'
    }
    ,
    // --- Personal In Progress (New) ---
    {
      id: 'wip4',
      title: 'SV-EDU E-Learning Platform',
      desc: 'Plateforme e-éducation visant à centraliser les ressources, suivre les progrès des élèves et offrir des outils analytiques aux enseignants.',
      img: getBankingImage('sv'),
      progress: 30,
      tech: ['NextJS', 'React', 'TailwindCSS', 'PostgreSQL'],
      status: 'in-progress'
    },
    {
      id: 'wip5',
      title: 'i18n Hardcode Detector (VSCode Extension)',
      desc: 'Extension VS Code pour les projets Angular. Détecte les chaînes de caractères hardcodées et les externalise/internationalise automatiquement pour faciliter la traduction.',
      img: getBankingImage('vsc'),
      progress: 55,
      tech: ['TypeScript', 'Angular', 'VSCode API'],
      status: 'in-progress'
    },
    // {
    //   id: 'wip6',
    //   title: 'eGovHub - Mobile Application',
    //   desc: 'Application mobile complémentaire au projet E-Government (NLP), offrant une interface conviviale pour la soumission d\'opinions et la consultation des services publics.',
    //   img: getBankingImage('eGov-Mobile'),
    //   progress: 100,
    //   tech: ['Flutter', 'ExpressJS', 'MongoDB'],
    //   status: 'in-progress'
    // },
    // --- Existing Projects (Kept for continuity) ---
  ];

  const allProjects = [...sampleProjects, ...sampleInProgress];
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  const allTechs = ['Tous', ...new Set(allProjects.flatMap(p => p.tech))];

  const handleFilter = (tech) => {
    setSelectedFilter(tech);
    if (tech === 'Tous') {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(allProjects.filter(p => p.tech.includes(tech)));
    }
  };
  const techLogos = {
    'Angular': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/angular/angular-original.svg',
    'React': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
    'NextJS': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-line.svg',
    'HTML': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg',
    'CSS': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg',
    'JavaScript': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
    'TypeScript': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
    'TailwindCSS': 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg',
    'Spring Boot': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg',
    'Django': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/django/django-plain.svg',
    'Java': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg',
    'NodeJS': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg',
    'ExpressJS': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg',
    'MongoDB': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg',
    'MySQL': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg',
    'PostgreSQL': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg',
    'D3': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/d3js/d3js-original.svg',
    'AI': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    'Flutter': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg',
    'PHP': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg',
    'Python': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
    'VSCode': 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg' // NEW VS CODE LOGO
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className="portfolio-wrapper">
      <section className="hero-section">
        <div className="hero-gradient"></div>
        <div className="hero-gradient-2"></div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <span className="hero-initials">AB</span>
          </motion.div>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            BELAIFA Amir
          </motion.h1>

          <motion.p
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Ingénieur Logiciel Full-Stack
          </motion.p>

          <motion.p
            className="hero-bio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Passionné par la création d'applications web modernes et performantes.
            Plus d'un an d'expérience dans le développement frontend et backend,
            avec une expertise en Angular, React, Spring Boot et bien plus encore.
          </motion.p>

          <motion.a
            href="https://MiroMIH.github.io/portfolio/CV_Amir_Belaifa.pdf" // 1. Path to file in public folder
            download="CV_Amir_Belaifa.pdf" // 2. Forces the browser to download instead of open
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Télécharger mon CV
          </motion.a>
        </motion.div>

        <div className="scroll-indicator">
          <span>Scroll</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <section className="skills-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Compétences & Technologies
            </motion.h2>
            <motion.p className="section-subtitle" variants={itemVariants}>
              Maîtrise des technologies modernes pour créer des expériences exceptionnelles
            </motion.p>

            <div className="skills-grid">
              <motion.div className="skill-category" variants={itemVariants}>
                <h3 className="skill-category-title">Frontend</h3>
                <div className="tech-logos">
                  {['Angular', 'React', 'NextJS', 'JavaScript', 'HTML', 'CSS', 'TailwindCSS', 'Flutter', 'TypeScript'].map(tech => (
                    <div key={tech} className="tech-logo-item">
                      <img src={techLogos[tech]} alt={tech} className="tech-logo" />
                      <span className="tech-name">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="skill-category" variants={itemVariants}>
                <h3 className="skill-category-title">Backend</h3>
                <div className="tech-logos">
                  {['Spring Boot', 'Django', 'Java', 'NodeJS', 'PHP', 'Python'].map(tech => (
                    <div key={tech} className="tech-logo-item">
                      <img src={techLogos[tech]} alt={tech} className="tech-logo" />
                      <span className="tech-name">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="skill-category" variants={itemVariants}>
                <h3 className="skill-category-title">Bases de données</h3>
                <div className="tech-logos">
                  {['MongoDB', 'MySQL', 'PostgreSQL'].map(tech => (
                    <div key={tech} className="tech-logo-item">
                      <img src={techLogos[tech]} alt={tech} className="tech-logo" />
                      <span className="tech-name">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="projects-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Projets & Réalisations
            </motion.h2>
            <motion.p className="section-subtitle" variants={itemVariants}>
              Découvrez mes derniers projets et créations
            </motion.p>
            {/* 
                        <motion.div className="filter-bar" variants={itemVariants}>
                            {allTechs.map(tech => (
                                <button
                                    key={tech}
                                    className={`filter-btn ${selectedFilter === tech ? 'active' : ''}`}
                                    onClick={() => handleFilter(tech)}
                                >
                                    {tech}
                                </button>
                            ))}
                        </motion.div> */}

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.id}
                  className="project-card"
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
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
                      {project.tech.map(t => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>

                    {/* <a href="#" className="project-link">
                                            Voir le projet
                                            <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </a> */}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="experience-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Expérience Professionnelle
            </motion.h2>
            <motion.p className="section-subtitle" variants={itemVariants}>
              Mon parcours dans le développement logiciel
            </motion.p>

            <motion.div className="experience-card" variants={itemVariants}>
              <div className="experience-header">
                <h3 className="experience-company">BEYN (ex : AeBS)</h3>
                <span className="experience-period">Mai 2024 - Présent</span>
              </div>
              <p className="experience-role">Full-stack Developer</p>
              <div className="experience-desc text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Développement de solutions numériques pour la transformation digitale des institutions financières :
                </p>
                <ul className="list-disc list-inside space-y-4">
                  <li>Participation active à la conception, au développement et à l’optimisation d’applications web modernes pour les services bancaires numériques.</li>
                  <li>Développement de la logique serveur avec <strong>Spring Boot</strong>, incluant la création de services <strong>RESTful</strong> robustes et sécurisés, gestion des transactions et intégration des workflows métiers.</li>
                  <li>Gestion des bases de données <strong>PostgreSQL</strong> : conception de schémas relationnels efficaces, optimisation des requêtes et implémentation de procédures stockées pour améliorer les performances.</li>
                  <li>Conception et optimisation d’interfaces utilisateurs responsives avec <strong>Angular</strong>, garantissant fluidité, ergonomie et accessibilité sur tous les appareils (desktop et mobile).</li>
                  <li>Intégration et consommation d’API RESTful, optimisation des échanges client-serveur et sécurisation des flux de données sensibles.</li>
                  <li>Conversion des maquettes <strong>UI/UX</strong> en interfaces dynamiques, avec mise en œuvre de composants réutilisables et respect des standards design.</li>
                  <li>Collaboration avec les équipes frontend et backend pour résoudre les problèmes techniques, améliorer les performances et maintenir une architecture solide et maintenable.</li>
                  <li>Adaptation des interfaces selon les besoins projet et contribution à la conception UI/UX, incluant tests utilisateurs et feedbacks itératifs.</li>
                  <li>Travail en méthodologie <strong>Agile (Scrum)</strong> : participation aux rituels (daily stand-ups, sprint planning, sprint review et rétrospectives), reporting et suivi d’avancement.</li>
                  <li>Contribution à la mise en place d’un codebase propre, structuré et maintenable, respectant les bonnes pratiques (SOLID, design patterns, tests unitaires et intégration continue).</li>
                </ul>
              </div>


            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Restons en Contact
            </motion.h2>
            <motion.p className="section-subtitle" variants={itemVariants}>
              N'hésitez pas à me contacter pour vos projets
            </motion.p>

            <div className="contact-grid">
              <motion.div className="contact-card" variants={itemVariants}>
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="contact-label">Email</p>
                <p className="contact-value">amirbelaifa2001@gmail.com</p>
              </motion.div>

              <motion.div className="contact-card" variants={itemVariants}>
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="contact-label">Téléphone</p>
                <p className="contact-value">0792 76 70 87</p>
              </motion.div>

              <motion.div className="contact-card" variants={itemVariants}>
                <div className="contact-icon-wrapper">
                  <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="contact-label">Localisation</p>
                <p className="contact-value">Boudouaou, Boumerdès</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="footer">
          <p>© 2024 BELAIFA Amir. Tous droits réservés.</p>
        </div>
      </section>
    </div>
  );
};

export default ProfilePortfolio;