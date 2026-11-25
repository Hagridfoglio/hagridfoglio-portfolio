import type { ExperienceItem, SkillGroup } from '@/features/profile/types/profile.types';

export const PROFILE = {
  name: 'Gennaro Pianese',
  role: 'Front End Developer',
  tagline: 'Web App, Desktop Electron, Mappe Interattive & Interfacce Touch.',
  bio: 'Sono un Frontend Developer con esperienza nello sviluppo di applicazioni web e desktop. Nel corso della mia esperienza ho lavorato con React, Vue e Angular per la parte web ed Electron per lo sviluppo desktop. Ho lavorato su interfacce web e desktop per la gestione di accessi e credenziali, oltre che su mappe interattive, dashboard real-time e interfacce touch-oriented per Raspberry Pi. Ho inoltre conoscenze di base di Node.js e PostgreSQL.',
  location: 'Giugliano in Campania (NA), Italia',
  email: 'gennaro.pianese1998@gmail.com',
  github: 'https://github.com/Hagridfoglio',
  githubHandle: '@Hagridfoglio',
  languages: [
    { name: 'Italiano', level: 'Madrelingua' },
    { name: 'Inglese', level: 'B1' },
  ],
  education: {
    degree: 'Diploma di Tecnico Elettrotecnico',
    school: 'I.T.S. L. Galvani',
    period: '2012 – 2017',
  },
  stats: [
    { label: 'Esperienza Frontend', value: '4+ anni' },
    { label: 'Ambienti', value: 'Web · Desktop · Touch · GIS' },
    { label: 'Focus', value: 'GIS & Real-Time' },
  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Linguaggi',
    items: ['JavaScript', 'TypeScript'],
  },
  {
    id: 'frameworks',
    label: 'Framework & Desktop',
    items: ['React', 'Vue', 'Angular', 'Tailwind CSS', 'Electron'],
  },
  {
    id: 'state',
    label: 'State Management & Data',
    items: ['Redux Toolkit', 'RTK Query', 'React Query', 'Pinia', 'NgRx'],
  },
  {
    id: 'ui',
    label: 'UI Libraries',
    items: ['shadcn/ui', 'Material UI', 'Ant Design', 'Vuetify', 'Daisy UI'],
  },
  {
    id: 'geo-canvas',
    label: 'Mappe & Canvas',
    items: ['OpenLayers', 'rlayers', 'Konva'],
  },
  {
    id: 'realtime',
    label: 'Real-Time',
    items: ['WebSocket', 'SSE (Server-Sent Events)'],
  },
  {
    id: 'auth',
    label: 'Integrazioni & Accessi',
    items: ['Keycloak', 'Smart Card', 'Passwordless', 'Active Directory'],
  },
  {
    id: 'backend-ai',
    label: 'Backend, DB & AI Tools',
    items: ['Node.js', 'PostgreSQL', 'GitHub Copilot', 'Claude Code'],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'namirial',
    company: 'Namirial / Bit4ID',
    role: 'Front End Developer',
    period: 'Q4 2024 – Presente',
    scope: 'Electron & Gestione Accessi',
    highlights: [
      'App desktop per interfacciarsi con Active Directory e gestire le credenziali di accesso degli utenti.',
      'Unificazione di tre applicazioni separate in un’unica app desktop con navigazione a drawer: Password Manager, Card Manager e Token Manager.',
      'Applicazione web per la gestione di utenti e permessi sulle feature delle applicazioni connesse.',
    ],
    tags: ['React', 'TypeScript', 'Electron', 'Active Directory'],
  },
  {
    id: 'raspberry',
    company: 'Progetto Indipendente',
    role: 'Front End Developer',
    period: '2026',
    scope: 'Touch UI & Real-Time',
    highlights: [
      'Applicazione touch per monitor da 7" su Raspberry Pi realizzata con React ed Electron.',
      'Interfaccia progettata per utilizzo diretto a schermo touch con controlli immediati.',
      'Integrazione connessione SSE per aggiornamenti real-time e monitoraggio continuo del sistema.',
    ],
    tags: ['React', 'Electron', 'Raspberry Pi', 'SSE'],
  },
  {
    id: 'sigeo',
    company: 'Sigeo Srl',
    role: 'Front End Developer',
    period: 'Q1 2022 – Q4 2024',
    scope: 'GIS, Mappe & Missioni Droni',
    highlights: [
      'Gestione, configurazione e monitoraggio real-time di missioni con droni su mappe interattive con controllo remoto.',
      'Acquisizione rilievi in campo per parcelle agricole e particelle catastali con strumenti di disegno e modifica geometrie su mappa.',
      'Monitoraggio e segnalazione di zone ad alto rischio con layer su mappa, gestione utenti e task workflow.',
      'Gestione antenne e copertura territoriale; verifica requisiti per domande di incentivi agricoli.',
    ],
    tags: ['OpenLayers', 'Keycloak', 'Vue', 'Angular', 'React', 'WebSocket'],
    hasGisDemo: true,
  },
];
