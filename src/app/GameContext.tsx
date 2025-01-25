'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type Scene = 'menu' | 'intro' | 'court' | 'defense' | 'lawyer' | 'end';

interface GameState {
  score: number;
  timeLeft: number;
  language: 'fr' | 'en' | 'es';
  round: number;
  currentScene: Scene;
  currentAnswer: string;
  audioEnabled: boolean;
}

interface GameContextType {
  gameState: GameState;
  setLanguage: (lang: GameState['language']) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setCurrentAnswer: (answer: string) => void;
  goToNextScene: () => void;
  resetGame: () => void;
}

const defaultGameState: GameState = {
  score: 0,
  timeLeft: 40,
  language: 'fr',
  round: 1,
  currentScene: 'menu',
  currentAnswer: '',
  audioEnabled: false
};

const sceneFlow: Scene[] = ['menu', 'intro', 'court', 'defense', 'lawyer'];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  const setLanguage = (lang: GameState['language']) => {
    setGameState(prev => ({ ...prev, language: lang }));
  };

  const setTimeLeft = (time: number | ((prev: number) => number)) => {
    setGameState(prev => ({ ...prev, timeLeft: typeof time === 'function' ? time(prev.timeLeft) : time }));
  };

  const setCurrentAnswer = (answer: string) => {
    setGameState(prev => ({ ...prev, currentAnswer: answer }));
  };

  const goToNextScene = () => {
    setGameState(prev => {
      const currentIndex = sceneFlow.indexOf(prev.currentScene);
      let nextScene = sceneFlow[currentIndex + 1];
      let nextRound = prev.round;

      // Si on vient de finir le lawyer et qu'on n'est pas au dernier round
      if (prev.currentScene === 'lawyer' && prev.round < 3) {
        nextScene = 'court';
        nextRound = prev.round + 1;
      }
      // Si on a fini le dernier round
      else if (prev.currentScene === 'lawyer' && prev.round >= 3) {
        nextScene = 'end';
      }

      return {
        ...prev,
        currentScene: nextScene,
        round: nextRound,
        timeLeft: nextScene === 'defense' ? 40 : prev.timeLeft
      };
    });
  };

  const resetGame = () => {
    setGameState(defaultGameState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setLanguage,
        setTimeLeft,
        setCurrentAnswer,
        goToNextScene,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}