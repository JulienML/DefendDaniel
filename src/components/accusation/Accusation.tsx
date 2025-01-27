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

interface Story {
  accusation: {
    description: string;
    alibi: string[];
  };
}

interface AccusationSceneProps {
  language: 'fr' | 'en' | 'es';
  story: Story | null;
  setNextScene: () => void;
}

const AccusationScene: FC<AccusationSceneProps> = ({
  language,
  story,
  setNextScene,
}) => {
  return (
    <div className="relative w-screen h-screen">
      {/* Image de fond */}
      <Image
        src="https://ik.imagekit.io/z0tzxea0wgx/MistralGameJam/DD_BG1_rva-mKDVA.jpg?updatedAt=1737835881047"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay noir */}
      <div className="absolute inset-0 bg-black/70">
        {/* Contenu */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 space-y-8">
          <div className="max-w-3xl w-full space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-4 roboto-slab">
                {language === 'fr' ? "Chef d'accusation" : language === 'en' ? 'Indictment' : 'Acusación'}
              </h2>
              <p className="text-xl text-white roboto-slab">
                {story?.accusation.description}
              </p>
            </div>

            {/* Alibis */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-4 roboto-slab">
                {language === 'fr' ? 'Alibis' : language === 'en' ? 'Alibis' : 'Coartadas'}
              </h2>
              <ul className="list-disc list-inside text-white space-y-2 roboto-slab">
                {story?.accusation.alibi.map((alibi, index) => (
                  <li key={index} className="text-xl">{alibi}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={setNextScene}
            className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors roboto-slab"
          >
            {language === 'fr' ? 'Allez au tribunal !' : language === 'en' ? 'Go to court!' : '¡A los tribunales!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccusationScene;