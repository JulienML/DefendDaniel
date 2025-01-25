'use client';

import { FC } from 'react';

interface MenuSceneProps {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  setNextScene: () => void;
  texts: {
    menu: {
      play: string;
    }
  };
}

const MenuScene: FC<MenuSceneProps> = ({ language, setLanguage, setNextScene }) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8 bg-slate-900">
      {/* Sélecteur de langue */}
      <div className="w-48">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
          className="w-full px-4 py-2 rounded-lg bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Bouton Play */}
      <button
        onClick={setNextScene}
        className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {language === 'fr' ? 'Jouer' : 'Play'}
      </button>
    </div>
  );
};

export default MenuScene;