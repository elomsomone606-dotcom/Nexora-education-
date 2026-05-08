/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Instructor } from '../types';

const INSTRUCTORS: Record<string, Instructor> = {
  sarah_kone: {
    id: 'i1',
    name: 'Dr. Sarah Kone',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'PhD in AI & Machine Learning. 10+ years experience in major tech companies.',
    specialty: 'Intelligence Artificielle',
    socials: { linkedin: '#', twitter: '#' }
  },
  yannick_noah: {
    id: 'i2',
    name: 'Yannick Noah',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Expert UI/UX Designer specialized in African digital ecosystems.',
    specialty: 'Product Design',
    socials: { linkedin: '#', github: '#' }
  },
  amadou_diallo: {
    id: 'i3',
    name: 'Amadou Diallo',
    photo: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop',
    bio: 'Ingénieur DevOps Senior, expert en cloud computing et infrastructure.',
    specialty: 'DevOps & Cloud',
    socials: { linkedin: '#' }
  }
};

export const CAMPUS_PRO_INSTRUCTORS = {
  dr_diallo: {
    id: 'dr_diallo',
    name: 'Dr. Amadou Diallo',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Expert en systèmes distribués et réseaux neuronaux, 15 ans de recherche académique.',
    specialty: 'Professeur Titulaire en Intelligence Artificielle'
  },
  prof_kone: {
    id: 'prof_kone',
    name: 'Pr. Sarah Koné',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Spécialiste en économie numérique et stratégies de croissance en pays émergents.',
    specialty: 'Doyenne de la Faculté de Business & Innovation'
  }
};

export const CAMPUS_PRO_COURSES: Course[] = [
  {
    id: 'cp_info',
    title: 'Informatique Pro (Université)',
    description: 'Cursus complet de 15 modules pour devenir ingénieur logiciel expert.',
    category: 'Campus Pro',
    price_credits: 0,
    xp_reward: 10000,
    content: '...',
    instructors: [CAMPUS_PRO_INSTRUCTORS.dr_diallo],
    level: 'Universitaire',
    duration: '150h 00m',
    lessons_count: 15,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    modules: [
      { 
        id: 'cp_info_m1', 
        title: '1. Introduction & Architecture', 
        lessons: [{ 
          id: 'cp_info_m1_l1', 
          title: 'Fondements des Systèmes', 
          type: 'text', 
          duration: '60:00', 
          content: `# 📘 Module 1: Architecture des Systèmes Modernes\n\n## 🎯 Objectif\nComprendre l'architecture CPU/RAM et l'influence du matériel sur les performances logicielles au niveau universitaire.\n\n## 📖 Cours principal\nL'architecture de Von Neumann reste le pilier central de l'informatique moderne. Elle sépare le traitement (CPU) du stockage (Mémoire). Cette séparation crée ce qu'on appelle le "Goulot d'étranglement de Von Neumann".\n\n## 🧠 Analyse\n### Causes\nL'augmentation de la fréquence des processeurs a largement dépassé la vitesse d'accès à la mémoire vive, créant une disparité technologique.\n\n### Conséquences\nCela force le logiciel à être optimisé pour le "cache locality" afin d'éviter les attentes prolongées du processeur.\n\n## 💡 Conseil de l'Enseignant\n"Pensez toujours à la disposition de vos données en mémoire. Un code propre mais mal agencé au niveau des adresses peut être 10 fois plus lent."\n\n## ❓ Pourquoi cette notion ?\nParce que la puissance brute ne suffit plus ; l'intelligence de l'ingénieur réside dans sa capacité à minimiser les transferts de données.\n\n## 📝 Exercices\n1. Calculez la latence théorique d'un accès RAM par rapport à un cycle CPU de 4GHz.\n2. Expliquez le rôle du Cache L1 dans la réduction du goulot d'étranglement.\n\n## 🏁 Conclusion\nL'architecture n'est pas qu'une affaire de matériel ; elle définit les limites et les opportunités du développement logiciel expert.`
        }] 
      },
      { 
        id: 'cp_info_m2', 
        title: '2. Algorithmique Avancée', 
        lessons: [{ 
          id: 'cp_info_m2_l2', 
          title: 'Complexité et Tris', 
          type: 'text', 
          duration: '60:00', 
          content: `# 📘 Module 2: Algorithmique et Complexité\n\n## 🎯 Objectif\nMaîtriser l'analyse de complexité (Big O notation) pour des algorithmes de tri massifs.\n\n## 📖 Cours principal\nL'algorithmique ne consiste pas à résoudre un problème, mais à le résoudre avec le moins de ressources possible. Nous étudions ici les tris complexes (QuickSort, MergeSort).\n\n## 🧠 Analyse\n### Causes\nLe volume de données "Big Data" rend les algorithmes en O(n²) inutilisables en production.\n\n### Conséquences\nL'utilisation obligatoire d'algorithmes divise-pour-régner pour maintenir des temps de réponse acceptables.\n\n## 💡 Conseil de l'Enseignant\n"Ne cherchez pas l'astuce, cherchez l'efficacité prouvée mathématiquement."\n\n## ❓ Pourquoi cette notion ?\nC'est la différence entre un développeur qui bricole et un ingénieur qui bâtit des systèmes scalables.\n\n## 🏁 Conclusion\nLa complexité est l'ennemi invisible de la montée en charge.`
        }] 
      },
      { id: 'cp_info_m3', title: '3. Web Sémantique (HTML/CSS)', lessons: [{ id: 'cp_info_m3_l3', title: 'Standard W3C', type: 'text', duration: '60:00', content: '# 📘 Module 3: Web' }] },
      { id: 'cp_info_m4', title: '4. Programmation JavaScript', lessons: [{ id: 'cp_info_m4_l4', title: 'Moteur V8 et Event Loop', type: 'text', duration: '60:00', content: '# 📘 Module 4: JS' }] },
      { id: 'cp_info_m5', title: '5. Python pour Chercheurs', lessons: [{ id: 'cp_info_m5_l5', title: 'Calcul Scientifique', type: 'text', duration: '60:00', content: '# 📘 Module 5: Python' }] },
      { id: 'cp_info_m7', title: '7. Bases de données (SQL)', lessons: [{ id: 'cp_info_m7_l7', title: 'Modélisation', type: 'text', duration: '60:00', content: '# Module 7' }] },
      { id: 'cp_info_m12', title: '12. Intelligence Artificielle', lessons: [{ id: 'l12_ex', title: 'Exercice : Modèle de Classification', type: 'exercise', duration: '60:00', content: '### Mission\nExpliquez comment fonctionne la descente de gradient.' }] },
      { id: 'cp_info_m15', title: '15. Projet Final Informatique', lessons: [{ id: 'l15_fin', title: 'Examen Final Ingénieur', type: 'quiz', duration: '180:00', quiz: { id: 'q_info_fin', title: 'Examen Final', minScore: 75, questions: [] } }] }
    ]
  },
  {
    id: 'cp_english',
    title: 'English Academic Excellence',
    description: '7 modules for professional fluency and academic writing.',
    category: 'Campus Pro',
    price_credits: 0,
    xp_reward: 5000,
    content: '...',
    instructors: [CAMPUS_PRO_INSTRUCTORS.prof_kone],
    level: 'Universitaire',
    duration: '70h 00m',
    lessons_count: 7,
    image: 'https://images.unsplash.com/photo-1543167664-40d699bc4310?w=800&h=400&fit=crop',
    modules: [
      { 
        id: 'cp_en_m1', 
        title: '1. Academic English Foundations', 
        lessons: [{ 
          id: 'en_l1', 
          title: 'University Phonetics', 
          type: 'text', 
          duration: '60:00', 
          content: `# 📘 Module 1: Academic English Foundations\n\n## 🎯 Objectif\nAcquérir les bases de l'articulation et de la phonétique pour les présentations universitaires.\n\n## 📖 Cours principal\nLa phonétique anglaise repose sur des sons qui n'existent pas en français (comme le 'th'). Maîtriser l'IPA (International Phonetic Alphabet) est crucial.\n\n## 🧠 Analyse\n### Causes\nL'influence de la langue maternelle crée des barrières de compréhension lors des échanges internationaux.\n\n### Conséquences\nUne mauvaise prononciation peut invalider la clarté d'un argumentaire scientifique brillant.\n\n## 💡 Conseil de l'Enseignant\n"Écoutez toujours des enregistrements natifs en ralentissant la vitesse à 0.75x."\n\n## ❓ Pourquoi cette notion ?\nPour être crédible et audible dans n'importe quelle conférence mondiale.\n\n## 🏁 Conclusion\nLa forme (phonétique) sert le fond (connaissance).` 
        }] 
      },
      { id: 'cp_en_m7', title: '7. Final Proficiency Exam', lessons: [{ id: 'en_l7', title: 'University Board Exam', type: 'quiz', duration: '120:00', quiz: { id: 'q_en_fin', title: 'Final Board', minScore: 75, questions: [] } }] }
    ]
  },
  {
    id: 'cp_mkt',
    title: 'Marketing Digital Strategist',
    description: 'Master audience acquisition and data-driven marketing in 7 university modules.',
    category: 'Campus Pro',
    price_credits: 0,
    xp_reward: 5500,
    content: '...',
    instructors: [CAMPUS_PRO_INSTRUCTORS.prof_kone],
    level: 'Universitaire',
    duration: '65h',
    lessons_count: 7,
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fce?w=800&h=400&fit=crop',
    modules: [
      { 
        id: 'cp_mkt_m1', 
        title: '1. Modern Strategic Marketing', 
        lessons: [{ 
          id: 'mkt_l1', 
          title: 'Consumer Psychology & Data', 
          duration: '60:00', 
          type: 'text', 
          content: `# 📘 Module 1: Psychologie du Consommateur et Data\n\n## 🎯 Objectif\nComprendre les leviers psychologiques qui poussent à l'achat dans l'économie numérique.\n\n## 📖 Cours principal\nLe marketing moderne ne vend plus un produit, il résout une angoisse ou satisfait une aspiration. L'IA permet aujourd'hui de prédire ces besoins.\n\n## 🧠 Analyse\n### Causes\nL'hyper-connectivité a rendu les consommateurs plus volatils et exigeants.\n\n### Conséquences\nLe marketing de masse est mort, place à l'ultra-personnalisation algorithmique.\n\n## 💡 Conseil de l'Enseignant\n"Ne regardez pas ce que les gens font, regardez pourquoi ils le font."\n\n## ❓ Pourquoi cette notion ?\nCar sans compréhension psychologique, la data n'est qu'un tas de chiffres inutiles.\n\n## 🏁 Conclusion\nLe marketing est la science du désir orchestrée par la donnée.`
        }] 
      },
      { id: 'cp_mkt_m7', title: '7. Growth Hacking Exam', lessons: [{ id: 'mkt_l7', title: 'Campaign Masterpiece', duration: '60:00', type: 'quiz', quiz: { id: 'q_mkt_fin', title: 'Final Campaign', minScore: 75, questions: [] } }] }
    ]
  },
  {
    id: 'cp_law',
    title: 'Digital & Business Law',
    description: 'Expertise in international business laws and digital regulations.',
    category: 'Campus Pro',
    price_credits: 0,
    xp_reward: 7000,
    content: '...',
    instructors: [CAMPUS_PRO_INSTRUCTORS.dr_diallo],
    level: 'Universitaire',
    duration: '100h',
    lessons_count: 7,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop',
    modules: [
      { 
        id: 'cp_law_m1', 
        title: '1. Jurisprudence Foundations', 
        lessons: [{ 
          id: 'law_l1', 
          title: 'International Digital Law', 
          duration: '60:00', 
          type: 'text', 
          content: `# 📘 Module 1: Fondations du Droit Numérique International\n\n## 🎯 Objectif\nComprendre les cadres juridiques régissant les données et le commerce transfrontalier.\n\n## 📖 Cours principal\nLe droit n'a plus de frontières physiques. Le RGPD en Europe influence les lois africaines sur la protection des données.\n\n## 🧠 Analyse\n### Causes\nL'émergence des plateformes mondiales (Gafam) a créé un vide juridique comblé par de nouvelles régulations.\n\n### Conséquences\nLes entreprises doivent désormais intégrer la conformité dès la conception (Privacy by Design).\n\n## 💡 Conseil de l'Enseignant\n"Le contrat est votre seule armure dans un monde dématérialisé."\n\n## ❓ Pourquoi cette notion ?\nPour protéger vos innovations et éviter des sanctions internationales lourdes.\n\n## 🏁 Conclusion\nLe droit est le régulateur indispensable de l'innovation technologique.`
        }] 
      },
      { id: 'cp_law_m7', title: '7. International Law Board', lessons: [{ id: 'law_l7', title: 'Legal Ethics Exam', duration: '120:00', type: 'quiz', quiz: { id: 'q_law_fin', title: 'Law Board', minScore: 75, questions: [] } }] }
    ]
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'e1',
    title: 'Design UI/UX : De Débutant à Pro',
    description: 'Le parcours complet pour maîtriser Figma et concevoir des interfaces modernes adaptées au marché africain.',
    category: 'Design',
    price_credits: 0,
    xp_reward: 1200,
    content: 'Un programme intensif couvrant la recherche utilisateur, le wireframing et le prototypage haute fidélité.',
    instructors: [INSTRUCTORS.yannick_noah],
    level: 'Débutant',
    duration: '12h 00m',
    lessons_count: 15,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'm1',
        title: 'Module 1 : Fondations du Design',
        lessons: [
          {
            id: 'l1',
            title: 'Pourquoi l\'UX est cruciale en Afrique ?',
            type: 'video',
            duration: '08:45',
            videoUrl: 'https://www.youtube.com/embed/jwCmvruL2u8',
            content: 'Découvrez comment le design peut résoudre des problèmes d\'accessibilité locale.',
            annotations: [{ id: 'a1', type: 'info', title: 'Statistique', text: '80% des utilisateurs africains naviguent sur mobile.' }]
          },
          {
            id: 'l2',
            title: 'Les 10 principes de Jakob Nielsen',
            type: 'text',
            duration: '15:00',
            content: '### Heuristiques de Nielsen\n1. Visibilité de l\'état du système\n2. Correspondance entre le système et le monde réel...'
          },
          {
            id: 'l3',
            title: 'Quiz de validation : Fondations',
            type: 'quiz',
            duration: '10:00',
            quiz: {
              id: 'q1',
              title: 'Testez vos bases',
              minScore: 80,
              questions: [
                { id: 'q1_1', question: 'Que signifie UX ?', options: ['User Experience', 'User Xylophone', 'Universal X-ray'], correctAnswer: 0 },
                { id: 'q1_2', question: 'L\'interface visuelle est-elle l\'UX ?', options: ['Oui', 'Non, c\'est l\'UI', 'C\'est la même chose'], correctAnswer: 1 }
              ]
            }
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2 : Maîtrise de Figma',
        lessons: [
          {
            id: 'l4',
            title: 'Interface et Outils Plumes',
            type: 'video',
            duration: '22:30',
            videoUrl: 'https://www.youtube.com/embed/g6Hbu_SABf8',
            content: 'Apprenez à utiliser les outils de dessin vectoriel.'
          },
          {
            id: 'l5',
            title: 'Exercice Pratique : Votre Premier Bouton',
            type: 'exercise',
            duration: '30:00',
            content: 'Créez un bouton avec Auto-Layout dans Figma en suivant les instructions de la vidéo précédente.'
          }
        ]
      }
    ]
  },
  {
    id: 'ap1',
    title: 'Agriculture & AgriTech : Modernisation Rurale',
    description: 'Transformez le secteur agricole africain grâce aux solutions IoT et aux marketplaces numériques.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 2000,
    content: 'Analyse des pertes post-récolte et déploiement de solutions de suivi météo et de vente directe.',
    instructors: [INSTRUCTORS.amadou_diallo],
    level: 'Intermédiaire',
    duration: '10h 00m',
    lessons_count: 12,
    image: 'https://images.unsplash.com/photo-1594751713536-47b2931495e3?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'ag1',
        title: 'Module 1 : Diagnostic et Enjeux Ruraux',
        lessons: [
          { 
            id: 'agl1', 
            title: 'I. Les freins de la productivité agricole', 
            type: 'text', 
            duration: '25:00', 
            content: `### 1. Analyse des Causes\nLa faible modernisation est le premier frein. En Afrique, beaucoup de cultivateurs utilisent encore des méthodes ancestrales sans accès aux données météo précises.\n\n### 2. Le Problème de l\'Information\n- **Isolement** : Manque de prix du marché en temps réel.\n- **Logistique** : Difficultés de transport vers les centres urbains.\n- **Météo** : Dépendance aux cycles de pluie sans prévisions.` 
          },
          { 
            id: 'agl2', 
            title: 'II. Conséquences et Impact Économique', 
            type: 'text', 
            duration: '20:00', 
            content: `### Le Gâchis Alimentaire\nOn estime que jusqu'à 40% de la production est perdue entre le champ et le consommateur final (pertes post-récolte).\n\n### Faible Rentabilité\nSans marketplace, le producteur est à la merci des intermédiaires qui cassent les prix.` 
          }
        ]
      },
      {
        id: 'ag2',
        title: 'Module 2 : Solutions et Architectures Digitales',
        lessons: [
          { 
            id: 'agl3', 
            title: 'III. Stratégie : Mobile First & Offline', 
            type: 'text', 
            duration: '30:00', 
            content: `### Guide Stratégique\nLes applications doivent être conçues pour des environnements à faible connexion.\n\n- **Mode Offline** : Utilisation de bases de données locales.\n- **Interface Simplifiée** : Icônes claires, peu de texte inutile.\n- **Paiement Intégré** : Mobile Money obligatoire.` 
          },
          { 
            id: 'agl4', 
            title: 'IV. Les Applications à Créer', 
            type: 'text', 
            duration: '20:00', 
            content: `### 4 Solutions Prioritaires\n1. **Marketplace Agricole** : Connecter directements producteurs et acheteurs.\n2. **Météo Intelligente** : Alertes météo localisées.\n3. **Gestion de Ferme** : Suivi des stocks et intrants.\n4. **IA Agricole** : Reconnaissance des maladies.` 
          },
          {
            id: 'agl_ex_final',
            title: 'Exercice Final : Prototype AgriTech',
            type: 'exercise',
            duration: '45:00',
            content: `### Votre Mission\nConcevez le schéma d'une interface de marketplace pour petits exploitants. Identifiez les 3 fonctionnalités indispensables pour un utilisateur sans connexion internet stable.`
          }
        ]
      }
    ]
  },
  {
    id: 'ap2',
    title: 'Santé & HealthTech : Digitalisation Médicale',
    description: 'Améliorez l\'accès aux soins en Afrique via la télémédecine et les dossiers patients numériques.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 2200,
    content: 'Optimisation de la gestion hospitalière et réduction des distances médicales.',
    instructors: [INSTRUCTORS.amadou_diallo],
    level: 'Avancé',
    duration: '12h 00m',
    lessons_count: 15,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'ht1',
        title: 'Module 1 : Enjeux de la Santé Numérique',
        lessons: [
          { 
            id: 'htl1', 
            title: 'I. État des lieux et Accessibilité', 
            type: 'text', 
            duration: '15:00', 
            content: `### 1. Le Désert Médical\nL'accès limité aux soins médicaux est aggravé par le manque de digitalisation des dossiers patients.\n\n### 2. Le Manque de Données\nSans suivi numérique, les médecins repartent de zéro à chaque consultation.` 
          },
          { 
            id: 'htl2', 
            title: 'II. Retards et Surcharges', 
            type: 'text', 
            duration: '10:00', 
            content: `### Impact sur les Patients\n- Retards de diagnostic.\n- Mauvaise gestion des maladies chroniques.\n- Surcharge des urgences par manque de tri.` 
          }
        ]
      },
      {
        id: 'ht2',
        title: 'Module 2 : Innovation HealthTech',
        lessons: [
          { 
            id: 'htl3', 
            title: 'III. Applications HealthTech Prioritaires', 
            type: 'text', 
            duration: '20:00', 
            content: `### Solutions Innovantes\n1. **Télémédecine** : Consultations à distance.\n2. **Rendez-vous Digitaux** : Réduire l'attente.\n3. **Dossier Médical Partagé** : Historique sécurisé.\n4. **Pharmacie Digitale** : Vérification de stock.` 
          },
          { 
            id: 'htl4', 
            title: 'IV. Sécurité et Éthique', 
            type: 'text', 
            duration: '12:00', 
            content: `### Points Clés\n- Confidentialité des données.\n- Interopérabilité entre cliniques.\n- Simplicité d'usage pour les seniors.` 
          },
          {
            id: 'htl_ex_final',
            title: 'Exercice : Parcours Patient',
            type: 'exercise',
            duration: '30:00',
            content: `### Mission\nDécrivez le parcours d'un patient utilisant une application de télémédecine en zone rurale. Quels sont les 2 obstacles techniques majeurs et comment les résoudre ?`
          }
        ]
      }
    ]
  },
  {
    id: 'ap3',
    title: 'Fintech & Mobile Money : Inclusion Financière',
    description: 'Maîtrisez les systèmes de paiement locaux pour stimuler l\'économie numérique.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 2500,
    content: 'Interconnectivité, wallets et microfinance digitale.',
    instructors: [INSTRUCTORS.sarah_kone],
    level: 'Expert',
    duration: '15h 00m',
    lessons_count: 18,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'ft1',
        title: 'Module 1 : Fragmentation et Inclusion',
        lessons: [
          { 
            id: 'ftl1', 
            title: 'I. Coûts et Exclusion financière', 
            type: 'text', 
            duration: '20:00', 
            content: `### La Réalité Bancaire\nLe faible accès bancaire (moins de 20% dans certains pays) freine la croissance. Les transactions cash sont coûteuses et peu sécurisées.` 
          },
          { 
            id: 'ftl2', 
            title: 'II. L\'Éveil du Mobile Money', 
            type: 'text', 
            duration: '15:00', 
            content: `### Pourquoi la Fintech ?\nLe mobile est l'outil principal d'inclusion financière en Afrique. Il permet de contourner l'absence d'agences physiques.` 
          }
        ]
      },
      {
        id: 'ft2',
        title: 'Module 2 : Architectures de Paiement',
        lessons: [
          { 
            id: 'ftl3', 
            title: 'III. Wallets et Microfinance', 
            type: 'text', 
            duration: '25:00', 
            content: `### Solutions à Développer\n1. **Wallet Mobile** : Paiement marchand simplifié.\n2. **Épargne Numérique** : Tontines digitales.\n3. **Microfinance** : Crédit basé sur le score mobile.` 
          },
          { 
            id: 'ftl4', 
            title: 'IV. Sécurité et Interopérabilité', 
            type: 'text', 
            duration: '20:00', 
            content: `### Défis\n- Prévention de la fraude.\n- Connexion entre différents opérateurs (MTN, Orange, Moov).` 
          },
          {
            id: 'ftl_ex_final',
            title: 'Exercice : Modèle Économique',
            type: 'exercise',
            duration: '40:00',
            content: `### Mission\nProposez un modèle de commissions pour une application permettant d'épargner de petits montants quotidiens via USSD. Comment rassurer l'utilisateur sur la sécurité de son argent ?`
          }
        ]
      }
    ]
  },
  {
    id: 'ap4',
    title: 'EdTech : Démocratisation du Savoir',
    description: 'Créez des plateformes éducatives adaptées aux contraintes de connectivité africaines.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 1800,
    content: 'MOOCs, Quiz IA et certifications professionnelles.',
    instructors: [INSTRUCTORS.yannick_noah],
    level: 'Intermédiaire',
    duration: '8h 30m',
    lessons_count: 10,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'ed1',
        title: 'Module 1 : Les Lacunes Éducatives',
        lessons: [
          { 
            id: 'edl1', 
            title: 'I. Accès aux formations modernes', 
            type: 'text', 
            duration: '10:00', 
            content: `### Le Fossé Numérique\nAccès limité à des formations modernes et numériques. Les programmes scolaires traditionnels peinent à s'adapter à la vitesse du digital.` 
          },
          { 
            id: 'edl2', 
            title: 'II. Manque de compétences pratiques', 
            type: 'text', 
            duration: '10:00', 
            content: `### Déficit de savoir-faire\nIl existe un décalage entre les diplômes obtenus et les besoins réels du marché du travail technologique.` 
          }
        ]
      },
      {
        id: 'ed2',
        title: 'Module 2 : Solutions EdTech',
        lessons: [
          { 
            id: 'edl3', 
            title: 'III. Plateformes Apprentissage Mobile', 
            type: 'text', 
            duration: '15:00', 
            content: `### Solutions à Créer\n1. **MOOC Africain** : Cours locaux adaptés.\n2. **Quiz Intelligents** : Validation de compétences.\n3. **IA Éducative** : Tutorat personnalisé.` 
          },
          { 
            id: 'edl4', 
            title: 'IV. Optimisation Connexion Faible', 
            type: 'text', 
            duration: '15:00', 
            content: `### Contraintes\nCréer des contenus légers (PDF, Audio) adaptés aux connexions internet instables.` 
          },
          {
            id: 'edl_ex_final',
            title: 'Exercice : Modèle Pédagogique',
            type: 'exercise',
            duration: '30:00',
            content: `### Mission\nImaginez une fonctionnalité qui permet d'apprendre via WhatsApp sans utiliser de données internet lourdes. Comment structureriez-vous le contenu ?`
          }
        ]
      }
    ]
  },
  {
    id: 'ap5',
    title: 'Transport & Logistique : Smart Cities',
    description: 'Optimisez la livraison et le transport urbain dans les mégalopoles africaines.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 2100,
    content: 'Suivi GPS, gestion de flotte et taxis numériques.',
    instructors: [INSTRUCTORS.amadou_diallo],
    level: 'Intermédiaire',
    duration: '9h 00m',
    lessons_count: 14,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'tr1',
        title: 'Module 1 : Défis Urbains et Logistiques',
        lessons: [
          { 
            id: 'trl1', 
            title: 'I. Organisation et Logistique', 
            type: 'text', 
            duration: '15:00', 
            content: `### Le Chaos des Transports\nOrganisation faible des transports en commun et de la livraison du dernier kilomètre dans les zones à forte densité.` 
          },
          { 
            id: 'trl2', 
            title: 'II. Retards et Coûts de Friction', 
            type: 'text', 
            duration: '10:00', 
            content: `### Impact Économique\nCoûts élevés de transport, mauvaise gestion logistique impactant le prix final des marchandises.` 
          }
        ]
      },
      {
        id: 'tr2',
        title: 'Module 2 : Mobilité Intelligente',
        lessons: [
          { 
            id: 'trl3', 
            title: 'III. Applications de Transport', 
            type: 'text', 
            duration: '20:00', 
            content: `### Opportunités\n1. **Livraison Intelligente** : Optimisation de trajets.\n2. **Taxi Numérique** : Séparation des flux de transport.\n3. **Suivi GPS** : Gestion de flottes de camions.` 
          },
          { 
            id: 'trl4', 
            title: 'IV. Optimisation Temps Réel', 
            type: 'text', 
            duration: '15:00', 
            content: `### Technologie\nImportance de la géolocalisation précise et des algorithmes d'assignation de chauffeurs.` 
          },
          {
            id: 'trl_ex_final',
            title: 'Exercice : Réseau de Livraison',
            type: 'exercise',
            duration: '35:00',
            content: `### Mission\nProposez une solution pour livrer des colis dans une zone sans adresses postales précises (utilisation de points de repère ou coordonnées GPS).`
          }
        ]
      }
    ]
  },
  {
    id: 'ap6',
    title: 'Énergie & Solutions Solaires',
    description: 'Répondez au défi de l\'électrification rurale via des systèmes solaires intelligents.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 2800,
    content: 'Pay-as-you-go, suivi énergétique et micro-réseaux.',
    instructors: [INSTRUCTORS.amadou_diallo],
    level: 'Avancé',
    duration: '14h 00m',
    lessons_count: 16,
    image: 'https://images.unsplash.com/photo-1509391366360-fe5bb65830bb?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'en1',
        title: 'Module 1 : Défis Énergétiques',
        lessons: [
          { 
            id: 'enl1', 
            title: 'I. Accès Limité à l\'Électricité', 
            type: 'text', 
            duration: '20:00', 
            content: `### Le déficit énergétique\nPlus de la moitié de la population en Afrique subsaharienne n'a pas accès à un réseau stable.` 
          },
          { 
            id: 'enl2', 
            title: 'II. Frein au Développement', 
            type: 'text', 
            duration: '10:00', 
            content: `### Impact\nL\'absence d\'énergie bloque l\'innovation technologique et l\'industrialisation locale.` 
          }
        ]
      },
      {
        id: 'en2',
        title: 'Module 2 : Puissance Solaire Numérique',
        lessons: [
          { 
            id: 'enl3', 
            title: 'III. Applications Solaire & IoT', 
            type: 'text', 
            duration: '25:00', 
            content: `### Solutions\n1. **Gestion Solaire** : Suivi de consommation via mobile.\n2. **Mini-réseaux** : Distribution d'énergie communautaire.\n3. **Suivi énergétique intelligent**.` 
          },
          { 
            id: 'enl4', 
            title: 'IV. Accessibilité en zones rurales', 
            type: 'text', 
            duration: '15:00', 
            content: `### Stratégie\nFaciliter le paiement à l'usage (Pay-as-you-go) via Mobile Money pour démocratiser le solaire.` 
          },
          {
            id: 'enl_ex_final',
            title: 'Exercice : Modèle PAYG',
            type: 'exercise',
            duration: '40:00',
            content: `### Mission\nExpliquez comment un système de crédit "Pay-as-you-go" peut aider un agriculteur à s'équiper d'une pompe solaire. Listez les modules logiciels nécessaires.`
          }
        ]
      }
    ]
  },
  {
    id: 'ap7',
    title: 'IA Africaine & Automatisation',
    description: 'Adaptez l\'Intelligence Artificielle aux langues et contextes locaux d\'Afrique.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 3500,
    content: 'NLP pour langues vernaculaires, diagnostic IA et automatisation.',
    instructors: [INSTRUCTORS.sarah_kone],
    level: 'Avancé',
    duration: '18h 00m',
    lessons_count: 20,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'ia1',
        title: 'Module 1 : L\'enjeu de l\'IA Locale',
        lessons: [
          { 
            id: 'ial1', 
            title: 'I. Absence de solutions adaptées', 
            type: 'text', 
            duration: '20:00', 
            content: `### IA et Contexte\nLa plupart des modèles d'IA mondiaux sont entraînés sur des données occidentales. Il existe un besoin crucial de modèles adaptés aux réalités africaines.` 
          },
          { 
            id: 'ial2', 
            title: 'II. Opportunités d\'Innovation', 
            type: 'text', 
            duration: '15:00', 
            content: `### Secteurs Clés\nAutomatisation dans l'agriculture, diagnostic médical assisté et traduction automatique des langues vernaculaires.` 
          }
        ]
      },
      {
        id: 'ia2',
        title: 'Module 2 : Le Moteur de l\'Innovation',
        lessons: [
          { 
            id: 'ial3', 
            title: 'III. Applications IA Prioritaires', 
            type: 'text', 
            duration: '30:00', 
            content: `### Projets à Lancer\n1. **NLP Local** : Compréhension des langues locales.\n2. **IA de Santé** : Analyse d'imagerie médicale.\n3. **IA Agricole** : Prévision de récoltes.` 
          },
          { 
            id: 'ial4', 
            title: 'IV. Éthique et Souveraineté des données', 
            type: 'text', 
            duration: '20:00', 
            content: `### Points de Vigilance\nGarder la maîtrise des données générées localement et assurer la transparence des algorithmes.` 
          },
          {
            id: 'ial_ex_final',
            title: 'Exercice : Cas d\'Usage IA',
            type: 'exercise',
            duration: '45:00',
            content: `### Votre Mission\nIdentifiez un problème local répétitif (ex: tri de déchets, traduction de dialectes) et expliquez comment une IA de classification simple pourrait aider.`
          }
        ]
      }
    ]
  },
  {
    id: 'ap8',
    title: 'Commerce & Marketplace',
    description: 'Digitalisez le commerce local africain avec des plateformes d\'e-commerce modernes.',
    category: 'African Project',
    price_credits: 0,
    xp_reward: 1900,
    content: 'Vente en ligne, gestion de stock et logistique intégrée.',
    instructors: [INSTRUCTORS.amadou_diallo],
    level: 'Intermédiaire',
    duration: '11h 00m',
    lessons_count: 14,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    modules: [
      {
        id: 'co1',
        title: 'Module 1 : Barrières du Commerce Local',
        lessons: [
          { id: 'col1', title: 'I. Difficultés de Vente et Visibilité', type: 'text', duration: '15:00', content: '### Digitalisation des PME\nBeaucoup de commerçants locaux n\'ont pas de visibilité en ligne au-delà des réseaux sociaux informels.' },
          { id: 'col2', title: 'II. Logistique et Distribution', type: 'text', duration: '10:00', content: '### Le Défi de la Livraison\nFaible structuration des adresses et coûts de livraison imprévisibles.' }
        ]
      },
      {
        id: 'co2',
        title: 'Module 2 : Créer une Marketplace Moderne',
        lessons: [
          { id: 'col3', title: 'III. Applications Marketplace', type: 'text', duration: '20:00', content: '### Solutions\n1. **Marketplace de Proximité** : Connecter quartiers et vendeurs.\n2. **Paiement Mobile Sécurisé** : Tiers de confiance.' },
          { id: 'col4', title: 'IV. Intégration Mobile Money', type: 'text', duration: '15:00', content: '### Stratégie\nFaciliter le paiement à la commande pour réduire les annulations à la livraison.' },
          {
            id: 'col_ex_final',
            title: 'Exercice : Tunnel de Vente Africa',
            type: 'exercise',
            duration: '30:00',
            content: `### Mission\nDécrivez les 5 étapes clés d'une transaction sur votre marketplace, du clic sur le produit au paiement reçu par le marchand.`
          }
        ]
      }
    ]
  }
];
