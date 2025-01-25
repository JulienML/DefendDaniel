'use client';
import { FC, useState, useEffect } from 'react';

interface EndSceneProps {
  language: 'fr' | 'en';
  judgeQuestions: string[];
  lawyerAnswers: string[];
  setNextScene: () => void;
  texts: {
    end: {
      title: string;
      description: string;
      verdict: {
        good: string;
        bad: string;
      };
      button: string;
    }
  };
}

const EndScene: FC<EndSceneProps> = ({
  language,
  judgeQuestions,
  lawyerAnswers,
  setNextScene,
  texts
}) => {
  const [visible, setVisible] = useState(false);
  // Score basique : nombre de réponses non vides
  const score = lawyerAnswers.filter(answer => answer.trim().length > 0).length;

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col p-8 bg-black text-white">
      <div className={`space-y-8 transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        <h1 className="text-4xl font-bold text-center mb-8">
          {texts.end.title}
        </h1>

        <p className="text-xl text-center mb-8">
          {texts.end.description}
        </p>

        {/* Questions et réponses */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {judgeQuestions.map((question, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                {language === 'fr' ? `Question ${index + 1}` : `Question ${index + 1}`}
              </h3>
              <p className="text-gray-300 mb-4">{question}</p>
              <div className="bg-blue-900 p-4 rounded">
                <h4 className="text-lg font-bold mb-2">
                  {language === 'fr' ? 'Votre réponse' : 'Your answer'}:
                </h4>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {lawyerAnswers[index] || (language === 'fr' ? '(Pas de réponse)' : '(No answer)')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div className={`text-2xl text-center font-bold ${score >= 2 ? 'text-green-500' : 'text-red-500'}`}>
          {score >= 2 ? texts.end.verdict.good : texts.end.verdict.bad}
        </div>

        {/* Bouton rejouer */}
        <div className="text-center">
          <button
            onClick={setNextScene}
            className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {texts.end.button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScene;