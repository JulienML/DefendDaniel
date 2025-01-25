'use client';
import { FC, useEffect, useState } from 'react';

interface CourtSceneProps {
  language: 'fr' | 'en';
  round: number;
  judgeQuestions: string[];
  setNextScene: () => void;
}

const CourtScene: FC<CourtSceneProps> = ({
  language,
  round,
  judgeQuestions,
  setNextScene,
}) => {
  const [visible, setVisible] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

  const handleNext = () => {
    setNextScene();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className={`space-y-8 text-center transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* <img
            src="/judge.png"
            alt="Judge"
            className="w-full h-full object-contain"
          /> */}
        </div>
        <p className="text-white text-3xl font-serif max-w-2xl">
          {judgeQuestions[round - 1]}
        </p>

        <button
          onClick={handleNext}
          disabled={!buttonEnabled}
          className={`px-8 py-3 rounded-lg text-xl transition-all duration-300 ${
            buttonEnabled
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {buttonEnabled ? (language === 'fr' ? 'Préparer la défense' : 'Prepare defense') : `${countdown}s`}
        </button>
      </div>
    </div>
  );
}

export default CourtScene;