// /$$$$$$  /$$$$$$ /$$    /$$ /$$$$$$$$       /$$      /$$ /$$$$$$$$        /$$$$$$           /$$$$$  /$$$$$$  /$$$$$$$ 
// /$$__  $$|_  $$_/| $$   | $$| $$_____/      | $$$    /$$$| $$_____/       /$$__  $$         |__  $$ /$$__  $$| $$__  $$
// | $$  \__/  | $$  | $$   | $$| $$            | $$$$  /$$$$| $$            | $$  \ $$            | $$| $$  \ $$| $$  \ $$
// | $$ /$$$$  | $$  |  $$ / $$/| $$$$$         | $$ $$/$$ $$| $$$$$         | $$$$$$$$            | $$| $$  | $$| $$$$$$$ 
// | $$|_  $$  | $$   \  $$ $$/ | $$__/         | $$  $$$| $$| $$__/         | $$__  $$       /$$  | $$| $$  | $$| $$__  $$
// | $$  \ $$  | $$    \  $$$/  | $$            | $$\  $ | $$| $$            | $$  | $$      | $$  | $$| $$  | $$| $$  \ $$
// |  $$$$$$/ /$$$$$$   \  $/   | $$$$$$$$      | $$ \/  | $$| $$$$$$$$      | $$  | $$      |  $$$$$$/|  $$$$$$/| $$$$$$$/
// \______/ |______/    \_/    |________/      |__/     |__/|________/      |__/  |__/       \______/  \______/ |_______/ 
//
// Hi, I'm Roland and i'm looking for a job.
// Resume in /public/resume.pdf
// roland.vrignon@roland.com
// https://www.linkedin.com/in/roland-vrignon/
//


'use client';

import { FC } from 'react';
import Image from 'next/image';

interface MenuSceneProps {
  language: 'fr' | 'en' | 'es';
  setLanguage: (lang: 'fr' | 'en' | 'es') => void;
  setNextScene: () => void;
}

const MenuScene: FC<MenuSceneProps> = ({ setLanguage, setNextScene }) => {

  const handleLanguageSelect = (language: 'fr' | 'en' | 'es') => {
    setLanguage(language);
    setNextScene();
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Image de fond */}
      <Image
        src="https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_start_P_osNnWmM.png?updatedAt=1737835883339"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Contenu du menu avec un fond semi-transparent */}
      <div className="relative z-10 flex flex-col items-end justify-center h-full w-full">
        <div className="flex flex-col gap-10 mr-[20vw]">
          <button
            onClick={() => handleLanguageSelect('en')}
            className="text-8xl text-white roboto-slab hover:text-sky-500 transition-colors"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageSelect('fr')}
            className="text-8xl text-white roboto-slab hover:text-sky-500 transition-colors"
          >
            Français
          </button>
          <button
            onClick={() => handleLanguageSelect('es')}
            className="text-8xl text-white roboto-slab hover:text-sky-500 transition-colors"
          >
            Español
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuScene;