const projectImages = {
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
  'default': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
};

export const getBankingImage = (id) => projectImages[id] || projectImages['default'];

export const completedProjects = [
  {
    id: 'prof1',
    title: 'SGA POS - Point of Sale System',
    desc: 'D\u00e9veloppement d\u2019une application web POS bancaire pour Soci\u00e9t\u00e9 G\u00e9n\u00e9rale Alg\u00e9rie (SGA), d\u00e9di\u00e9e \u00e0 la gestion et \u00e0 l\u2019instruction des demandes de cr\u00e9dits bancaires (cr\u00e9dit consommation, auto, immobilier) en agence. Le syst\u00e8me permet la simulation des cr\u00e9dits, la cr\u00e9ation et le suivi des dossiers clients, l\u2019int\u00e9gration avec les services bancaires internes, et l\u2019optimisation des parcours conseillers afin de r\u00e9duire le temps de traitement et am\u00e9liorer l\u2019exp\u00e9rience utilisateur en agence.',
    img: getBankingImage('SGA POS'),
    tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
    status: 'completed',
  },
  {
    id: 'prof2',
    title: 'SGA SELA',
    desc: 'D\u00e9veloppement d\u2019une plateforme back-office pour SGA visant \u00e0 centraliser et automatiser le traitement des flux financiers complexes (comptes, virements, paiements, op\u00e9rations inter-comptes) ainsi que le suivi des op\u00e9rations de tr\u00e9sorerie et des r\u00e8glements interbancaires. La plateforme facilite la gestion des transactions en lot, l\'audit de chaque op\u00e9ration, la g\u00e9n\u00e9ration de rapports pour la conformit\u00e9 r\u00e9glementaire, et offre un tableau de bord pour le suivi des liquidit\u00e9s, des comptes clients, et des \u00e9critures comptables internes.',
    img: getBankingImage('SGA SELA'),
    tech: ['Spring Boot', 'Angular', 'PostgreSQL'],
    status: 'completed',
  },
  {
    id: 'prof3',
    title: 'AGB - Syst\u00e8me de Banking Digital',
    desc: 'Participation au d\u00e9veloppement d\u2019une plateforme de banking digital destin\u00e9e aux clients d\u2019AGB, permettant la consultation des comptes, les virements bancaires, le suivi des op\u00e9rations et la gestion s\u00e9curis\u00e9e des acc\u00e8s. L\u2019application met l\u2019accent sur la fiabilit\u00e9, la performance et la s\u00e9curit\u00e9 des donn\u00e9es, avec une exp\u00e9rience utilisateur fluide sur les canaux web pour les clients particuliers et professionnels.',
    img: getBankingImage('AGB'),
    tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
    status: 'completed',
  },
  {
    id: 'pfe2',
    title: 'E-Government NLP Classifier',
    desc: 'D\u00e9veloppement d\u2019un syst\u00e8me NLP gouvernemental nomm\u00e9 eGovHub, destin\u00e9 \u00e0 la collecte, la classification et l\u2019analyse des opinions citoyennes publi\u00e9es en ligne. La plateforme permet l\u2019analyse des sentiments, l\u2019identification automatique des th\u00e9matiques cl\u00e9s et la structuration des retours citoyens pour aider \u00e0 la prise de d\u00e9cision publique. Le projet combine des mod\u00e8les NLP en Python avec une application web compl\u00e8te bas\u00e9e sur le stack MERN pour la visualisation des r\u00e9sultats et la gestion des donn\u00e9es.',
    img: getBankingImage('egov'),
    tech: ['Python', 'NLP', 'MongoDB', 'ExpressJS', 'React', 'NodeJS'],
    status: 'completed',
  },
];

export const inProgressProjects = [
  {
    id: 'wip3',
    title: 'BEAI - Back-Office Mon\u00e9tique',
    desc: 'D\u00e9veloppement d\u2019une application de front-office et back-office mon\u00e9tique destin\u00e9e \u00e0 la supervision et \u00e0 l\u2019administration des cartes bancaires et des transactions interbancaires. La plateforme permet le suivi des op\u00e9rations mon\u00e9tiques, la gestion des param\u00e8tres cartes, la consultation des historiques de transactions et le contr\u00f4le des flux, avec un fort accent sur la s\u00e9curit\u00e9, la tra\u00e7abilit\u00e9 et la fiabilit\u00e9 des traitements.',
    img: getBankingImage('BEAI'),
    progress: 40,
    tech: ['Angular', 'Spring Boot', 'PostgreSQL'],
    status: 'in-progress',
  },
  {
    id: 'wip4',
    title: 'SV-EDU E-Learning Platform',
    desc: 'Plateforme e-\u00e9ducation visant \u00e0 centraliser les ressources, suivre les progr\u00e8s des \u00e9l\u00e8ves et offrir des outils analytiques aux enseignants.',
    img: getBankingImage('sv'),
    progress: 30,
    tech: ['NextJS', 'React', 'TailwindCSS', 'PostgreSQL'],
    status: 'in-progress',
  },
  {
    id: 'wip5',
    title: 'i18n Hardcode Detector (VSCode Extension)',
    desc: 'Extension VS Code pour les projets Angular. D\u00e9tecte les cha\u00eenes de caract\u00e8res hardcod\u00e9es et les externalise/internationalise automatiquement pour faciliter la traduction.',
    img: getBankingImage('vsc'),
    progress: 55,
    tech: ['TypeScript', 'Angular', 'VSCode API'],
    status: 'in-progress',
  },
];
