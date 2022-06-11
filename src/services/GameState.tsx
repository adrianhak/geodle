import React from 'react';
import { IGameRound } from '../@types/GameRound';
import { GameStateContextType, IGameState } from '../@types/GameState';
import { IGuess } from '../@types/Guess';

const { createContext, useContext } = React;

export const InitialGameStateContext: GameStateContextType = {
  prevGames: null,
  currentGame: null,
  maxGuesses: 6,
  setGame: (gameRound: IGameRound) => undefined, // Placeholder
  addGuess: (guess: IGuess) => undefined,
  saveGame: (game: IGameState) => undefined,
};

const GameStateContext = createContext<GameStateContextType>(
  InitialGameStateContext
);

export const GameStateProvider = (props: any) => {
  const value = {
    prevGames: props.prevGames || InitialGameStateContext.prevGames,
    currentGame: props.currentGame || InitialGameStateContext.currentGame,
    maxGuesses: props.maxGuesses || InitialGameStateContext.maxGuesses,
    setGame: props.setGame || InitialGameStateContext.setGame,
    addGuess: props.addGuess || InitialGameStateContext.addGuess,
    saveGame: props.saveGame || InitialGameStateContext.saveGame,
  };

  return (
    <GameStateContext.Provider value={value}>
      {props.children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  return useContext(GameStateContext);
};
