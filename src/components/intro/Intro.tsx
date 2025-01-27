'use client';
import { FC, useEffect, useRef } from 'react';
import Image from 'next/image';


interface Story {
  accusation: {
    description: string;
    alibi: string[];
  };
}

interface IntroSceneProps {
  intro: {
    fr: {
      title: string;
      description: string;
      start: string;
    };
    en: {
      title: string;
      description: string;
      start: string;
    };
    es: {
      title: string;
      description: string;
      start: string;
    };
  },
  language: 'fr' | 'en' | 'es';
  setNextScene: () => void;
  story: Story | null;
}

const IntroScene: FC<IntroSceneProps> = ({
  intro,
  language,
  setNextScene,
  story,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.id = 'introAudio';
    document.body.appendChild(audio);
    audioRef.current = audio;

    const loadAndPlayAudio = async () => {
      try {
        if (language === 'en') {
          audio.src = '/sounds/intro_en.mp3';
        } else if (language === 'fr') {
          audio.src = '/sounds/intro_fr.mp3';
        } else if (language === 'es') {
          audio.src = '/sounds/intro_es.mp3';
        }

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
  }, [language]);

  const handleContinue = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      document.body.removeChild(audioRef.current);
      audioRef.current = null;
    }
    setNextScene();
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Image de fond */}
      <Image
        src="https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_BG1_rva-mKDVA.jpg?updatedAt=1737835881047https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_BG1_rva-mKDVA.jpg?updatedAt=1737835881047"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay noir */}
      <div className="absolute inset-0 bg-black/70">
        {/* Contenu */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
          <p className="text-4xl text-white text-center mb-8 roboto-slab max-w-2xl">
            {intro[language].description}
          </p>

          <button
            onClick={() => handleContinue()}
            className={`px-8 py-4 text-xl font-bold text-white rounded-lg transition-colors roboto-slab
              ${story ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'}`}
            disabled={!story}
          >
            {intro[language].start}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScene;