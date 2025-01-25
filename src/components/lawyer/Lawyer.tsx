'use client';
import { FC, useState, useEffect } from 'react';

interface LawyerSceneProps {
  language: 'fr' | 'en';
  round: number;
  judgeQuestions: string[];
  lawyerAnswers: string[];
  setNextScene: () => void;
}

const LawyerScene: FC<LawyerSceneProps> = ({
  language,
  round,
  judgeQuestions,
  lawyerAnswers,
  setNextScene
}) => {
  const [visible, setVisible] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    setVisible(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setButtonEnabled(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col p-8 bg-black text-white">
      <div className={`space-y-8 transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Question du juge */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'fr' ? 'Question du juge' : 'Judge\'s question'}:
          </h2>
          <p className="text-xl text-gray-300">
            {judgeQuestions[round - 1]}
          </p>
        </div>

        {/* Réponse de l'avocat */}
        <div className="bg-blue-900 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'fr' ? 'Votre réponse' : 'Your answer'}:
          </h2>
          <p className="text-xl text-gray-300 whitespace-pre-wrap">
            {lawyerAnswers[round - 1]}
          </p>
        </div>

        {/* Bouton pour continuer */}
        <button
          onClick={setNextScene}
          disabled={!buttonEnabled}
          className={`px-8 py-4 rounded-lg text-xl transition-all duration-300 ${
            buttonEnabled
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {buttonEnabled
            ? (language === 'fr' ? 'Continuer' : 'Continue')
            : `${countdown}s`
          }
        </button>
      </div>
    </div>
  );
};

export default LawyerScene;