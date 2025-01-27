'use client';
import { FC, useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface Verdict {
  verdict: boolean;
  argument: string;
  prisonYears: number;
}

interface EndSceneProps {
  language: 'fr' | 'en' | 'es';
  setNextScene: () => void;
  verdict: Verdict | null;
}

const EndScene: FC<EndSceneProps> = ({
  language,
  setNextScene,
  verdict
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (verdict) {
      setIsLoading(false);

      const playVerdict = async () => {
        try {
          const response = await fetch('/api/voice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              language,
              text: verdict.argument,
              role: 'judge'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to generate audio');
          }

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);


        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.volume = 0.5;
          await audio.play();
        } catch (error) {
          console.error('Error playing verdict audio:', error);
        }
      };

      playVerdict();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verdict]);

  const handleNextScene = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setNextScene();
  };

  const getLoadingText = () => {
    if (language === 'fr') {
      return 'Le juge délibère...';
    } else if (language === 'en') {
      return 'The judge is deliberating...';
    } else {
      return 'El juez está deliberando...';
    }
  };

  const getVerdictText = () => {
    if (language === 'fr') {
      return verdict?.verdict ? 'NON COUPABLE' : 'COUPABLE';
    } else if (language === 'en') {
      return verdict?.verdict ? 'NOT GUILTY' : 'GUILTY';
    } else {
      return verdict?.verdict ? 'NO CULPABLE' : 'CULPABLE';
    }
  };

  const getSentenceText = () => {
    if (language === 'fr') {
      return verdict?.prisonYears && verdict?.prisonYears > 0 
          ? `${verdict?.prisonYears} ans de prison` 
        : 'Libéré';
    } else if (language === 'en') {
      return verdict?.prisonYears && verdict?.prisonYears > 0 
        ? `${verdict?.prisonYears} years in prison` 
        : 'Released';
    } else {
      return verdict?.prisonYears && verdict?.prisonYears > 0 
        ? `${verdict?.prisonYears} años de prisión` 
        : 'Liberado';
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <Image
        src={isLoading 
          ? "https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/court_M-RO6txqB.png?updatedAt=1737835884433"
          : "https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_judge1_Bn04jNl_E.png?updatedAt=1737835883169"
        }
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/60 border-8 border-black w-[600px] p-10 m-8 flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <h1 className="text-4xl text-white roboto-slab mb-8">
                {getLoadingText()}
              </h1>
              <div className="animate-bounce">
                <svg className="w-16 h-16 text-white mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center justify-between h-full">
              <h1 className="text-5xl text-white roboto-slab mb-8">
                {language === 'fr'
                  ? 'Verdict'
                  : language === 'en'
                  ? 'Verdict'
                  : 'Veredicto'
                }
              </h1>
              
              <h2 className={`text-7xl mb-8 roboto-slab ${verdict?.verdict ? 'text-green-500' : 'text-red-500'}`}>
                {getVerdictText()}
              </h2>

              <p className="text-3xl text-white mb-8 roboto-slab">
                {getSentenceText()}
              </p>

              <p className="text-2xl text-white mb-8 roboto-slab italic max-w-[80%]">
                {verdict?.argument}
              </p>

              <button
                onClick={handleNextScene}
                className="px-12 py-6 text-2xl font-bold text-white bg-sky-500 hover:bg-blue-700 transition-colors roboto-slab mt-auto"
              >
                {language === 'fr' ? 'Rejouer' : language === 'en' ? 'Try again' : 'Jugar de nuevo'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndScene;