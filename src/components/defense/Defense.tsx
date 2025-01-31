'use client';
import { FC, useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import Image from 'next/image';

interface Message {
  content: string;
  role: 'lawyer' | 'judge';
}

interface Chat {
  messages: Message[];
}

interface DefenseSceneProps {
  language: 'fr' | 'en' | 'es';
  requiredWords: string[];
  setNextScene: () => void;
  setChat: (chat: SetStateAction<Chat>) => void;
  setCurrentQuestion: Dispatch<SetStateAction<string>>;
  setReaction: Dispatch<SetStateAction<string>>;
  setRequiredWords: Dispatch<SetStateAction<string[]>>;
}

const DefenseScene: FC<DefenseSceneProps> = ({
  language,
  requiredWords,
  setNextScene,
  setCurrentQuestion,
  setChat,
  setReaction,
  setRequiredWords
}) => {
  const [answer, setAnswer] = useState('');
  const [insertedWords, setInsertedWords] = useState<boolean[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [wordPositions, setWordPositions] = useState<Array<{ word: string; position: number }>>([]);
  const [mandatoryWords, setMandatoryWords] = useState(requiredWords);
  const [isLoading, setIsLoading] = useState(true);
  const [ words ] = useState(requiredWords);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.id = 'defenseAudio';
    document.body.appendChild(audio);
    audioRef.current = audio;

    const loadAndPlayAudio = async () => {
      try {
        audio.src = '/sounds/background_music.mp3';
        audio.volume = 0.1;

        await audio.load();
        await audio.play();
      } catch (error) {
        console.log('Audio playback error:', error);
      }
    };

    loadAndPlayAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        document.body.removeChild(audioRef.current);
        audioRef.current = null;
      }
    };
  }, []);

  // Initialisation des mots obligatoires
  useEffect(() => {
    if (requiredWords.length > 0) {
      setMandatoryWords(requiredWords);
    }
    setReaction('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredWords]);

  // Génération des positions et initialisation
  useEffect(() => {
    if (mandatoryWords.length > 0) {
      const positions = generateWordPositions(mandatoryWords);
      setWordPositions(positions);
      setInsertedWords(new Array(mandatoryWords.length).fill(false));
      setCurrentQuestion("");
      setIsLoading(false);
    }
  }, [mandatoryWords]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset des required words après initialisation
  useEffect(() => {
    if (!isLoading && wordPositions.length > 0) {
      setRequiredWords([]);
    }
  }, [isLoading, wordPositions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isTimeUp) {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeUp])    

  // Timer et reset de la question
  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          setIsTimeUp(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // On garde uniquement la dépendance answer car handleSubmit est stable

  // Génère un nombre aléatoire entre 9 et 15
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * (15 - 9 + 1)) + 9;
  };

  // Génère les positions pour les mots requis
  const generateWordPositions = (words: string[]) => {
    let currentPosition = generateRandomNumber(); // On commence à une position aléatoire
    return words.map(word => {
      const position = currentPosition;
      currentPosition += generateRandomNumber(); // Ajoute un nombre aléatoire de mots pour le prochain mot requis
      return {
        word,
        position
      };
    });
  };

  // Fonction pour compter les mots
  const countWords = (text: string) => {
    // Remplacer temporairement les expressions requises par un seul mot
    let modifiedText = text;
    wordPositions.forEach(({ word }) => {
      if (modifiedText.includes(word)) {
        // Remplace l'expression complète par un placeholder unique
        modifiedText = modifiedText.replace(word, 'SINGLEWORD');
      }
    });

    // Maintenant compte les mots normalement
    return modifiedText.trim().split(/\s+/).length || 0;
  };

  // Fonction pour vérifier si on doit insérer un mot obligatoire
  const checkAndInsertRequiredWord = (text: string) => {
    const currentWordCount = countWords(text);
    let newText = text;
    const newInsertedWords = [...insertedWords];
    let wordInserted = false;

    wordPositions.forEach((word, index) => {
      if (!insertedWords[index] && currentWordCount === word.position && text.endsWith(' ')) {
        newText = `${text}${word.word} `;
        newInsertedWords[index] = true;
        wordInserted = true;
      }
    });

    if (wordInserted) {
      setInsertedWords(newInsertedWords);
    }

    return newText;
  };

  // Fonction pour vérifier si on peut supprimer du texte
  const canDeleteAt = (text: string, cursorPosition: number) => {
    // const textBeforeCursor = text.substring(0, cursorPosition);
    // const wordsBeforeCursor = countWords(textBeforeCursor);

    return !wordPositions.some((word, index) => {
      if (!insertedWords[index]) return false;

      const wordStartPosition = text.indexOf(word.word);
      const wordEndPosition = wordStartPosition + word.word.length;

      return cursorPosition > wordStartPosition && cursorPosition <= wordEndPosition;
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setAnswer(newText);
    const cursorPosition = e.target.selectionStart;

    // Si c'est une suppression
    if (newText.length < answer.length) {
      if (!canDeleteAt(answer, cursorPosition)) {
        return;
      }
    }

    // Insertion normale + vérification des mots obligatoires
    const processedText = checkAndInsertRequiredWord(newText);
    setAnswer(processedText);
  };

  const handleSubmit = () => {
    setChat(prevChat => ({
      messages: [...prevChat.messages, { content: answer, role: 'lawyer', requiredWords: words }]
    }));
    setNextScene();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Vérifie si la réponse est valide pour soumission
  const isAnswerValid = () => {
    const lastWordPosition = Math.max(...wordPositions.map(word => word.position));
    const currentWordCount = countWords(answer);
    return currentWordCount >= lastWordPosition && insertedWords.every(inserted => inserted);
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Image de fond */}
      <Image
        src="https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_attorney2_gbcNJRrYM.png?updatedAt=1737835883087"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Contenu avec overlay noir */}
      <div className="absolute inset-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-2xl text-gray-300">
              {language === 'fr' ? 'Chargement...' : language === 'en' ? 'Loading...' : 'Cargando...'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-end p-8 h-full">
            {/* Header avec le compte à rebours */}
            <div className="flex justify-between items-center mb-6">
              <div className={`text-8xl roboto-slab ${countdown < 10 ? 'text-red-500' : 'text-white'}`}>
                {formatTime(countdown)}
              </div>
            </div>

            {/* Prochain mot requis */}
            <div className="mb-6">
              {wordPositions.map((item, index) => {
                // Ne montrer que le premier mot non inséré
                if (insertedWords[index] || index > 0 && !insertedWords[index - 1]) return null;
                const remainingWords = item.position - countWords(answer);
                return (
                  <div key={index} className="bg-black/60 border border-black border-8 p-6 text-white">
                    <span className="text-5xl text-sky-500 roboto-slab mt-2">
                      {item.word.toUpperCase()}
                    </span>
                    <span className="text-5xl text-white roboto-slab mt-2">                      {language === 'fr'
                      ? `dans `
                      : language === 'en'
                        ? `in `
                        : `en `
                    }</span>
                    <span className="text-5xl text-red-500 roboto-slab mt-2">{remainingWords}</span>
                    <span className="text-5xl text-white roboto-slab mt-2">                      {language === 'fr'
                      ? ` mots`
                      : language === 'en'
                        ? ` words`
                        : ` palabras`
                    }</span>
                  </div>
                );
              }).filter(Boolean)[0]}
            </div>

            {/* Zone de texte avec bouton submit en position absolue */}
            <div className="relative w-full mb-6">
              <textarea
                value={answer}
                onChange={handleTextChange}
                disabled={isTimeUp}
                placeholder={language === 'fr'
                  ? "Écrivez votre défense ici..."
                  : language === 'en'
                    ? "Write your defense here..."
                    : "Write your defense here..."}
                className="w-full p-6 bg-black/60 border border-black border-8 text-white text-4xl rounded-none focus:outline-none roboto-slab h-[30vh]"
              />

              {/* Bouton de soumission */}
              <button
                onClick={() => handleSubmit()}
                disabled={!isAnswerValid()}
                className={`absolute bottom-5 right-5 px-8 py-4 rounded-lg text-xl transition-all duration-300 ${isAnswerValid()
                    ? 'bg-sky-500 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-600 cursor-not-allowed'
                  }`}
              >
                {language === 'fr' ? 'Soumettre' : language === 'en' ? 'Submit' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefenseScene;