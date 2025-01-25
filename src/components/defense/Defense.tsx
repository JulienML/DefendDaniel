'use client';
import { FC, useState, useEffect } from 'react';

interface DefenseSceneProps {
  language: 'fr' | 'en';
  round: number;
  alibi: string[];
  problematics: string[];
  requiredWords: {
    word: string;
    position: number;
  }[];
  setNextScene: () => void;
  setLawyerAnswer: (answer: string) => void;
}

const DefenseScene: FC<DefenseSceneProps> = ({
  language,
  round,
  alibi,
  problematics,
  requiredWords,
  setNextScene,
  setLawyerAnswer
}) => {
  const [answer, setAnswer] = useState('');
  const [insertedWords, setInsertedWords] = useState<boolean[]>(new Array(requiredWords.length).fill(false));
  const [countdown, setCountdown] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleSubmit(); // Auto-submit quand le timer atteint 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fonction pour compter les mots
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  // Fonction pour vérifier si on doit insérer un mot obligatoire
  const checkAndInsertRequiredWord = (text: string) => {
    const currentWordCount = countWords(text);
    let newText = text;
    let newInsertedWords = [...insertedWords];
    let wordInserted = false;

    requiredWords.forEach((word, index) => {
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
    const textBeforeCursor = text.substring(0, cursorPosition);
    const wordsBeforeCursor = countWords(textBeforeCursor);

    return !requiredWords.some((word, index) => {
      if (!insertedWords[index]) return false;

      const wordStartPosition = text.indexOf(word.word);
      const wordEndPosition = wordStartPosition + word.word.length;

      return cursorPosition > wordStartPosition && cursorPosition <= wordEndPosition;
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
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
    setLawyerAnswer(answer);
    setNextScene();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Vérifie si la réponse est valide pour soumission
  const isAnswerValid = () => {
    const lastWordPosition = Math.max(...requiredWords.map(word => word.position));
    const currentWordCount = countWords(answer);
    return currentWordCount >= lastWordPosition && insertedWords.every(inserted => inserted);
  };

  return (
    <div className="w-screen h-screen flex flex-col p-8 bg-black text-white">
      {/* Header avec le compte à rebours */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {language === 'fr' ? 'Préparez votre défense' : 'Prepare your defense'}
        </h2>
        <div className={`text-2xl font-mono ${countdown < 10 ? 'text-red-500' : 'text-white'}`}>
          {formatTime(countdown)}
        </div>
      </div>

      {/* Zone de contexte */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-xl mb-2">
          {language === 'fr' ? 'Alibi du client' : 'Client\'s alibi'}:
        </h3>
        <p className="text-gray-300 mb-4">{alibi[round - 1]}</p>

        <h3 className="text-xl mb-2">
          {language === 'fr' ? 'Point problématique' : 'Problematic point'}:
        </h3>
        <p className="text-red-400">{problematics[round - 1]}</p>
      </div>

      {/* Mots requis */}
      <div className="bg-purple-900 p-4 rounded-lg mb-6">
        <h3 className="text-xl mb-2">
          {language === 'fr' ? 'Mots/Expressions à utiliser' : 'Required words/expressions'}:
        </h3>
        <div className="space-y-2">
          {requiredWords.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-purple-300">
                {language === 'fr'
                  ? `Après le ${item.position}${item.position === 1 ? 'er' : 'ème'} mot`
                  : `After the ${item.position}${item.position === 1 ? 'st' : item.position === 2 ? 'nd' : item.position === 3 ? 'rd' : 'th'} word`
                }:
              </span>
              <span className="text-white font-bold">{item.word}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de texte */}
      <textarea
        value={answer}
        onChange={handleTextChange}
        disabled={isTimeUp}
        placeholder={language === 'fr'
          ? "Écrivez votre défense ici..."
          : "Write your defense here..."}
        className="flex-grow w-full p-4 bg-gray-900 text-white rounded-lg resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Bouton de soumission */}
      <button
        onClick={handleSubmit}
        disabled={!isAnswerValid()}
        className={`px-8 py-4 rounded-lg text-xl transition-all duration-300 ${
          isAnswerValid()
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        {language === 'fr' ? 'Soumettre' : 'Submit'}
      </button>
    </div>
  );
};

export default DefenseScene;