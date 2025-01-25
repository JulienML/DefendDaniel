'use client';
import { FC, useState, useEffect } from 'react';

interface AccusationSceneProps {
  language: 'fr' | 'en';
  accusation: string;
  alibi: string[];
  problematics: string[];
  setNextScene: () => void;
}

const AccusationScene: FC<AccusationSceneProps> = ({
  language,
  accusation,
  alibi,
  problematics,
  setNextScene
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className={`space-y-8 text-center transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="max-w-3xl mx-auto space-y-8 p-6">
          {/* Accusation */}
          <div className="space-y-4">
            <h2 className="text-white text-3xl font-bold mb-4">
              {language === 'fr' ? 'Accusation' : 'Accusation'}
            </h2>
            <div className="bg-red-900 p-6 rounded-lg">
              <p className="text-white text-xl">
                {accusation}
              </p>
            </div>
          </div>

          {/* Alibis */}
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold">
              {language === 'fr' ? 'Vos alibis' : 'Your alibis'}
            </h2>
            <div className="bg-gray-800 p-6 rounded-lg space-y-4">
              {alibi.map((item, index) => (
                <p key={index} className="text-white text-lg">
                  • {item}
                </p>
              ))}
            </div>
          </div>

          {/* Points problématiques */}
          <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold">
              {language === 'fr' ? 'Points problématiques' : 'Problematic points'}
            </h2>
            <div className="bg-red-800 p-6 rounded-lg space-y-4">
              {problematics.map((item, index) => (
                <p key={index} className="text-white text-lg">
                  • {item}
                </p>
              ))}
            </div>
          </div>

          <button
            onClick={setNextScene}
            className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mt-8"
          >
            {language === 'fr' ? 'Commencer le procès' : 'Start the trial'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccusationScene;