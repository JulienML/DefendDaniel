'use client';
import { FC, useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import Image from 'next/image';

interface Message {
  content: string;
  role: 'lawyer' | 'judge';
  requiredWords?: string[];
}


interface Chat {
  messages: Message[];
}

interface LawyerSceneProps {
  language: 'fr' | 'en' | 'es';
  chat: Chat;
  setNextScene: () => void;
  currentQuestion: string;
  round: number;
  setRound: Dispatch<SetStateAction<number>>;
}

const LawyerScene: FC<LawyerSceneProps> = ({
  language,
  chat,
  setNextScene,
  currentQuestion,
  round,
  setRound,
}) => {
  const [visible, setVisible] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const lastJudgeMessage = chat.messages.filter((message: Message) => message.role === 'judge').slice(-1)[0]?.content;
    const lastLawyerMessage = chat.messages.filter((message: Message) => message.role === 'lawyer').slice(-1)[0]?.content;
    setQuestion(lastJudgeMessage || '');
    setAnswer(lastLawyerMessage || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    const playAudio = async () => {
      try {
        if (!answer) return;

        const response = await fetch('/api/voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: language,
            text: answer,
            role: 'lawyer'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to generate audio');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        
        const volumeHeader = response.headers.get('X-Volume');
        const volume = volumeHeader ? parseFloat(volumeHeader) : 1;

        console.log('Volume:', volume);

        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.volume = volume;
        audio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [answer, language]);

  useEffect(() => {
    setVisible(true);
    setRound(round + 1);
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

  const handleNextScene = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setNextScene();
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Image de fond */}
      <Image
        src="https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_attorney1_k5DWtEzcV.png?updatedAt=1737835883169"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Contenu avec overlay noir */}
      <div className="absolute inset-0">
        <div className="flex flex-col items-center justify-end h-full p-8">
          <div className={`flex flex-col items-center justify-center space-y-8 transition-opacity duration-1000 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Question du juge */}
            <div className="bg-black/60 border border-black border-8 p-6 mb-8 w-[80%]">
              <h2 className="text-2xl font-bold mb-4 roboto-slab text-white">
                {language === 'fr' ? 'Question du juge' : language === 'en' ? 'Judge\'s question' : 'Pregunta del juez'}:
              </h2>
              <p className="text-xl text-white roboto-slab">
                {question}
              </p>
            </div>

            {/* Réponse de l'avocat avec flèche */}
            <div className="relative bg-black/60 border border-black border-8 p-6 mb-8 w-[80%]">
              <h2 className="text-2xl font-bold mb-4 roboto-slab text-white">
                {language === 'fr' ? 'Votre réponse' : language === 'en' ? 'Your answer' : 'Tu respuesta'}:
              </h2>
              <p className="text-xl text-white roboto-slab whitespace-pre-wrap mb-8">
                {answer}
              </p>

              {/* Flèche à droite */}
              <div className="absolute bottom-5 right-5">
                <button
                  onClick={handleNextScene}
                  disabled={!buttonEnabled || (currentQuestion === "" && round < 3)}
                  className={`text-white transition-colors ${
                    buttonEnabled && (currentQuestion !== "" || round === 3)
                      ? 'hover:text-blue-400 cursor-pointer'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                  aria-label="Continuer"
                >
                  {!buttonEnabled ? (
                    <span className="text-2xl">{countdown}s</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerScene;