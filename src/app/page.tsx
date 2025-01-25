'use client';

import { useState, useEffect } from 'react';
import MenuScene from '../components/menu/Menu';
import IntroScene from '../components/intro/Intro';
import CourtScene from '../components/court/Court';
import DefenseScene from '../components/defense/Defense';
import LawyerScene from '../components/lawyer/Lawyer';
import EndScene from '../components/end/End';
import AccusationScene from '../components/accusation/Accusation';

// Types pour notre état
type Language = 'fr' | 'en';
type Scene = 'menu' | 'intro' | 'accusation' | 'court' | 'defense' | 'lawyer' | 'end';

interface RequiredWord {
  word: string;
  position: number; // Position après X mots
}

// Textes de l'application
const texts = {
  fr: {
    menu: {
      play: 'Jouer'
    },
    intro: {
      title: "Introduction",
      description: "Vous êtes accusé d'un crime. Votre avocat va vous défendre.",
      button: "Continuer",
    },
    accusation: {
      description: "Vous êtes accusé de meurtre au premier degré. Le corps de Victor Dubois a été retrouvé dans son bureau le 15 mars à 23h.",
      alibi: [
        "J'étais au cinéma en train de regarder le dernier film Marvel",
        "Ma place de cinéma et mes achats de confiserie sont sur mon relevé bancaire",
        "Le film se terminait à 23h30, je suis rentré directement chez moi",
        "Plusieurs personnes m'ont vu au cinéma ce soir-là"
      ],
      problematics: [
        "Le ticket de cinéma a été acheté en ligne, n'importe qui aurait pu l'utiliser",
        "Le bureau de la victime est à seulement 10 minutes du cinéma",
        "Vous aviez un motif : la victime allait vous licencier",
        "Des traces de votre ADN ont été retrouvées dans le bureau"
      ],
    },
    courtQuestions: [
      "Comment expliquez-vous la présence de votre ADN sur la scène de crime alors que vous prétendez être au cinéma ?",
      "Avec le cinéma si proche du bureau, n'auriez-vous pas eu le temps de commettre le crime pendant l'entracte ?",
      "Étant donné votre licenciement imminent, n'aviez-vous pas une excellente raison de vouloir vous venger ?"
    ],
    defense: [],
    end: {
      title: "Fin du procès",
      description: "Voici vos réponses aux questions du juge :",
      verdict: {
        good: "Félicitations ! Votre client est libre grâce à votre défense éloquente !",
        bad: "Malheureusement, votre client a été condamné. Vos arguments n'ont pas convaincu le juge."
      },
      button: "Rejouer"
    },
    requiredWords: [
      [ // Round 1
        {
          word: "fan inconditionnel de Marvel",
          position: 5
        },
        {
          word: "pleurer pendant le film",
          position: 12
        },
        {
          word: "collectionneur de figurines",
          position: 20
        }
      ],
      [ // Round 2
        {
          word: "manger bruyamment du popcorn",
          position: 4
        },
        {
          word: "costume de Spider-Man sous mes vêtements",
          position: 10
        },
        {
          word: "selfie avec l'affiche du film",
          position: 18
        }
      ],
      [ // Round 3
        {
          word: "peluche de Thor",
          position: 3
        },
        {
          word: "imiter Thanos pendant la séance",
          position: 8
        },
        {
          word: "poster géant dans ma chambre",
          position: 15
        }
      ]
    ]
  },
  en: {
    menu: {
      play: 'Play'
    },
    intro: {
      title: "Introduction",
      description: "You are accused of a crime. Your lawyer will defend you.",
      button: "Continue",
    },
    accusation: {
      description: "You are accused of first-degree murder. Victor Dubois's body was found in his office on March 15th at 11 PM.",
      alibi: [
        "I was at the cinema watching the latest Marvel movie",
        "My movie ticket and concession purchases are on my bank statement",
        "The movie ended at 11:30 PM, I went straight home",
        "Several people saw me at the cinema that evening"
      ],
      problematics: [
        "The movie ticket was bought online, anyone could have used it",
        "The victim's office is only 10 minutes away from the cinema",
        "You had a motive: the victim was going to fire you",
        "Your DNA traces were found in the office"
      ]
    },
    courtQuestions: [
      "Comment expliquez-vous la présence de votre ADN sur la scène de crime alors que vous prétendez être au cinéma ?",
      "Avec le cinéma si proche du bureau, n'auriez-vous pas eu le temps de commettre le crime pendant l'entracte ?",
      "Étant donné votre licenciement imminent, n'aviez-vous pas une excellente raison de vouloir vous venger ?"
    ],
    defense: [],
    end: {
      title: "End of Trial",
      description: "Here are your answers to the judge's questions:",
      verdict: {
        good: "Congratulations! Your client is free thanks to your eloquent defense!",
        bad: "Unfortunately, your client has been convicted. Your arguments didn't convince the judge."
      },
      button: "Play Again"
    },
    requiredWords: [
      [ // Round 1
        {
          word: "unconditional Marvel fan",
          position: 5
        },
        {
          word: "crying during the movie",
          position: 12
        },
        {
          word: "action figure collector",
          position: 20
        }
      ],
      [ // Round 2
        {
          word: "loudly eating popcorn",
          position: 4
        },
        {
          word: "Spider-Man costume under my clothes",
          position: 10
        },
        {
          word: "selfie with the movie poster",
          position: 18
        }
      ],
      [ // Round 3
        {
          word: "Thor plushie",
          position: 3
        },
        {
          word: "impersonating Thanos during the screening",
          position: 8
        },
        {
          word: "giant poster in my bedroom",
          position: 15
        }
      ]
    ]
  }
};

const sceneOrder: Scene[] = ['menu', 'intro', 'accusation', 'court', 'defense', 'lawyer'];

export default function Home() {
  // Gestion des scènes
  const [currentScene, setCurrentScene] = useState<Scene>('menu');

  // États principaux du jeu
  const [language, setLanguage] = useState<Language>('fr');
  const [accusation, setAccusation] = useState<string>('');
  const [alibi, setAlibi] = useState<string[]>([]);
  const [problematics, setProblematics] = useState<string[]>([]);
  const [round, setRound] = useState<number>(1);

  // Questions du juge et réponses de l'avocat
  const [judgeQuestions, setJudgeQuestions] = useState<string[]>([
    '',
    '',
    ''
  ]);

  const [lawyerAnswers, setLawyerAnswers] = useState<string[]>([
    '',
    '',
    ''
  ]);

  // Initialisation des états avec les données du texte actuel
  const initializeAccusationData = () => {
    setAccusation(texts[language].accusation.description);
    setAlibi(texts[language].accusation.alibi);
    setProblematics(texts[language].accusation.problematics);
    setJudgeQuestions(texts[language].courtQuestions);
  };

  // Mise à jour des données quand la langue change
  useEffect(() => {
    initializeAccusationData();
  }, [language]);

  // Méthode pour mettre à jour la réponse de l'avocat pour le round actuel
  const setLawyerAnswer = (answer: string) => {
    const newAnswers = [...lawyerAnswers];
    newAnswers[round - 1] = answer;
    setLawyerAnswers(newAnswers);
  };

  const setNextScene = () => {
    if (currentScene === 'lawyer') {
      if (round < 3) {
        setRound(round + 1);
        setCurrentScene('court');
      } else {
        setCurrentScene('end');
      }
      return;
    }

    if (currentScene === 'end') {
      setCurrentScene('menu');
      return;
    }

    const currentIndex = sceneOrder.indexOf(currentScene);
    if (currentIndex !== -1 && currentIndex < sceneOrder.length - 1) {
      setCurrentScene(sceneOrder[currentIndex + 1]);
    }
  };

  // Props communs à passer aux composants
  const commonProps = {
    language,
    setLanguage,
    accusation,
    setAccusation,
    alibi,
    setAlibi,
    problematics,
    setProblematics,
    round,
    setRound,
    judgeQuestions,
    setJudgeQuestions,
    lawyerAnswers,
    setLawyerAnswer,
    setCurrentScene,
    setNextScene,
    texts: texts[language],
    requiredWords: texts[language].requiredWords[round - 1],
  };

  switch (currentScene) {
    case 'menu':
      return <MenuScene {...commonProps} />;
    case 'intro':
      return <IntroScene {...commonProps} />;
    case 'accusation':
      return <AccusationScene {...commonProps} />;
    case 'court':
      return <CourtScene {...commonProps} />;
    case 'defense':
      return <DefenseScene {...commonProps} />;
    case 'lawyer':
      return <LawyerScene {...commonProps} />;
    case 'end':
      return <EndScene {...commonProps} />;
    default:
      return <MenuScene {...commonProps} />;
  }
}