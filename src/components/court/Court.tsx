'use client';
import { FC, useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface CourtSceneProps {
  setNextScene: () => void;
  currentQuestion: string;
  reaction: string;
  round: number;
}

const CourtScene: FC<CourtSceneProps> = ({
  setNextScene,
  currentQuestion,
  reaction,
  round
}) => {
  const [showFirstImage, setShowFirstImage] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  useEffect(() => {
    const playAudio = async () => {
      // Si déjà en train de jouer, on ne fait rien
      if (isPlayingRef.current || !currentQuestion) return;
      
      try {
        isPlayingRef.current = true;        
        const response = await fetch('/api/voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: 'en',
            text: reaction !== '' ? reaction + currentQuestion : currentQuestion,
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
        
        audio.addEventListener('ended', () => {
          isPlayingRef.current = false;
        });

        await audio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        isPlayingRef.current = false;
      }
    };

    playAudio();

    return () => {
      isPlayingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentQuestion, reaction]);

  const handleNextScene = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setNextScene();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstImage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen">
      {/* Image de fond statique */}
      <Image
        src="https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_judge2_FoYazvSFmu.png?updatedAt=1737835883172"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Image superposée avec transition */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${showFirstImage ? 'opacity-100' : 'opacity-0'}`}>
        <Image
          src="https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_judge1_Bn04jNl_E.png?updatedAt=1737835883169"
          alt="Overlay"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Rectangle noir en bas */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] bg-black/60 border border-black border-8 mb-[8vh] p-6">
        <div className="text-white roboto-slab">
          <p className="text-4xl mb-4">
            {reaction !== '' && round !== 1 ? reaction.replace(/\?/g, '') : ''} <br />
            {currentQuestion ? currentQuestion : '...'}
          </p>

          {/* Flèche à droite */}
          <div className="flex justify-end">
            <button
              onClick={handleNextScene}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label="Continuer"
            >
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtScene;