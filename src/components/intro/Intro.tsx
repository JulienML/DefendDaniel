'use client';
import { FC } from 'react';

interface IntroSceneProps {
  texts: any,
  language: 'fr' | 'en';
  setNextScene: () => void;
}

const IntroScene: FC<IntroSceneProps> = ({
  texts,
  setNextScene,
}) => {
  const handleContinue = () => {
    setNextScene();
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8 bg-slate-900 text-white p-4">
      <h1 className="text-4xl font-bold">
        {texts.intro.title}
      </h1>

      <p className="text-xl text-center max-w-2xl">
        {texts.intro.description}
      </p>

      <button
        onClick={handleContinue}
        className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mt-8"
      >
        {texts.intro.button}
      </button>
    </div>
  );
};

export default IntroScene;