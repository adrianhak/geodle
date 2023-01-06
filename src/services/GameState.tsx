import React from 'react';
import { GameStateContextType, IGameState } from '../@types/GameState';
import { GameRound, Guess } from '../api';

const { createContext, useContext } = React;

export const InitialGameStateContext: GameStateContextType = {
  prevGames: null,
  currentGame: null,
  maxGuesses: 6,
  setGame: (gameRound: GameRound) => undefined,
  setAnswer: (answer: string) => undefined,
  addGuess: (guess: Guess) => undefined,
  saveGame: (game: IGameState) => undefined,
  resetToday: () => undefined,
};

const GameStateContext = createContext<GameStateContextType>(InitialGameStateContext);

export const GameStateProvider = (props: any) => {
  const value = {
    prevGames: props.prevGames || InitialGameStateContext.prevGames,
    currentGame: props.currentGame || InitialGameStateContext.currentGame,
    maxGuesses: props.maxGuesses || InitialGameStateContext.maxGuesses,
    setGame: props.setGame || InitialGameStateContext.setGame,
    setAnswer: props.setAnswer || InitialGameStateContext.setAnswer,
    addGuess: props.addGuess || InitialGameStateContext.addGuess,
    saveGame: props.saveGame || InitialGameStateContext.saveGame,
    resetToday: props.resetToday || InitialGameStateContext.resetToday,
  };

  return <GameStateContext.Provider value={value}>{props.children}</GameStateContext.Provider>;
};

export const useGameState = () => {
  return useContext(GameStateContext);
};
