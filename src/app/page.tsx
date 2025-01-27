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
type Language = 'fr' | 'en' | 'es';

type Scene = 'menu' | 'intro' | 'accusation' | 'court' | 'defense' | 'lawyer' | 'end';
interface Story {
  accusation: {
    description: string;
    alibi: string[];
  };
}

interface Message {
  content: string;
  role: 'lawyer' | 'judge';
  requiredWords?: string[];
}

interface Chat {
  messages: Message[];
}

interface Verdict {
  verdict: boolean;
  argument: string;
  prisonYears: number;
}

const intro = {
  fr: {
    title: "L'Avocat de l'IA",
    description: `Daniel est un mec banale. Il n'a rien fait de mal.\nPourtant, il est convoqué aujourd'hui dans ce tribunal. Pauvre Daniel...`,
    start: "Commencer"
  },
  en: {
    title: "The AI Lawyer", 
    description: `Daniel is an ordinary guy. He hasn't done anything wrong.\nYet he's been summoned to court today. Poor Daniel...`,
    start: "Start"
  },
  es: {
    title: "El Abogado de la IA",
    description: `Daniel es un tipo corriente. No ha hecho nada malo.\nSin embargo, ha sido convocado a la corte hoy. Pobre Daniel...`,
    start: "Empezar"
  }
}

const sceneOrder: Scene[] = ['menu', 'intro', 'accusation', 'court', 'defense', 'lawyer'];

export default function Home() {
  // Gestion des scènes
  const [currentScene, setCurrentScene] = useState<Scene>('menu');
  const [story, setStory] = useState<Story | null>(null);
  const [chat, setChat] = useState<Chat>({ messages: [] });
  // États principaux du jeu
  const [language, setLanguage] = useState<Language>('fr');

  const [round, setRound] = useState<number>(1);

  const [requiredWords, setRequiredWords] = useState<string[]>([])

  const [currentQuestion, setCurrentQuestion] = useState<string>('');

  const [reaction, setReaction] = useState<string>('');


  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const resetGame = () => {
    setCurrentScene('menu');
    setStory(null);
    setChat({ messages: [] });
    setLanguage('fr');
    setRound(1);
    setRequiredWords([]);
  };

  const setNextScene = async () => {
    if (currentScene === 'lawyer') {
      if (round < 4) {
        setCurrentScene('court');
      } else {
        // Generate judge's verdict before ending
        const generateVerdict = async () => {
          try {
            const response = await fetch('/api/text/verdict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                language,
                story,
                chat
              })
            });

            const data = await response.json();

            if (!data.success) {
              throw new Error('Failed to generate verdict');
            }

            setVerdict(data.verdict);
          } catch (error) {
            console.error('Error generating verdict:', error);
          }
        };

        await generateVerdict();

        setCurrentScene('end');
      }
      return;
    }

    if (currentScene === 'end') {
      resetGame();
      return;
    }

    const currentIndex = sceneOrder.indexOf(currentScene);
    if (currentIndex !== -1 && currentIndex < sceneOrder.length - 1) {
      setCurrentScene(sceneOrder[currentIndex + 1]);
    }
  };

  // Props communs à passer aux composants
  const commonProps = {
    intro,
    language,
    setLanguage,
    round,
    setRound,
    setCurrentScene,
    setNextScene,
    story,
    currentQuestion,
    setCurrentQuestion,
    requiredWords,
    setRequiredWords,
    chat,
    setChat,
    reaction,
    setReaction,
    verdict,
    setVerdict
  };

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch('/api/text/story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language })
        });

        const data = await response.json();

        if (data.success && data.story) {
          setStory({
            accusation: {
              description: data.story.description,
              alibi: data.story.alibi,
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'histoire:', error);
      }
    };


    if (currentScene === 'intro') {
      fetchStory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]); // on écoute les changements de currentScene

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('/api/text/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language,
            story: story?.accusation,
            chat: chat
          })
        });

        const data = await response.json();
        if (data.question && data.words) {
          setCurrentQuestion(data.question);
          setRequiredWords(data.words);
          if (data.reaction && data.reaction !== '') {
            setReaction(data.reaction);
          }
          setChat(prevChat => ({
            messages: [...prevChat.messages, { content: data.question, role: 'judge' }]
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la question:', error);
      }
    };

    if ((currentScene === 'accusation' && story) || (currentScene === 'lawyer' && round < 3 && story)) {
      fetchQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]);

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