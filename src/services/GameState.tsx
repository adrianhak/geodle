import React from 'react';
import { IGameRound } from '../@types/GameRound';
import { GameStateContextType, IGameState } from '../@types/GameState';
import { IGuess } from '../@types/Guess';

const { createContext, useContext } = React;

export const InitialGameStateContext: GameStateContextType = {
  gameStates: [],
  maxGuesses: 6,
  getCurrentGame: () => undefined,
  addRound: (gameRound: IGameRound) => undefined, // Placeholder
  addGuess: (gameState: IGameState, guess: IGuess) => undefined,
};

const GameStateContext = createContext<GameStateContextType>(
  InitialGameStateContext
);

export const GameStateProvider = (props: any) => {
  const value = {
    gameStates: props.gameStates || InitialGameStateContext.gameStates,
    maxGuesses: props.maxGuesses || InitialGameStateContext.maxGuesses,
    getCurrentGame:
      props.getCurrentGame || InitialGameStateContext.getCurrentGame,
    addRound: props.addRound || InitialGameStateContext.addRound,
    addGuess: props.addGuess || InitialGameStateContext.addGuess,
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
