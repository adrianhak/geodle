import React from 'react';
import Navbar from './components/Navbar';
import Game from './components/Game';
import { GameServerProvider } from './services/GameServer';
import { useEffect, useState } from 'react';
import { GameStateProvider } from './services/GameState';
import { IGameState } from './@types/GameState';
import { IGameRound } from './@types/GameRound';
import { IGuess } from './@types/Guess';

function App() {
  const [gameStates, setGameStates] = useState<IGameState[] | null>(null);

  const getCurrentGame = (): IGameState | undefined => {
    if (!gameStates) {
      return undefined;
    }
    return gameStates[gameStates.length - 1];
  };

  // Add a new game round to the game state
  const addRound = (gameRound: IGameRound) => {
    setGameStates((gameStates) => {
      if (gameStates) {
        if (
          gameStates.filter(
            (gameState) => gameState.gameRound.id === gameRound.id
          ).length === 0
        ) {
          return gameStates.concat([
            { gameRound: gameRound, guesses: [], isCompleted: false },
          ]);
        }
        return gameStates;
      } else {
        return [{ gameRound: gameRound, guesses: [], isCompleted: false }];
      }
    });
  };

  // TODO: Move this logic to service (and keep state in service)
  const addGuess = (gameState: IGameState, guess: IGuess) => {
    setGameStates((gameStates) => {
      if (
        gameStates &&
        gameStates.indexOf(gameState) !== -1 &&
        gameStates[gameStates.indexOf(gameState)].guesses.length < 6 &&
        gameStates[gameStates.indexOf(gameState)].guesses.filter(
          (g) => g.locationCode === guess.locationCode
        ).length === 0
      ) {
        return [
          ...gameStates.slice(0, gameStates.indexOf(gameState)),
          {
            ...gameState,
            guesses: [...gameState.guesses, guess],
            isCompleted: gameState.guesses.length === 5 || guess.distance === 0,
          },
          ...gameStates.slice(gameStates.indexOf(gameState) + 1),
        ];
      }
      return null;
    });
  };

  useEffect(() => {
    // Load previously stored game state
    const storedState = localStorage.getItem('gameState');
    if (storedState) {
      setGameStates(JSON.parse(storedState));
    }
    //
  }, []);

  // Write game state to local storage when changed
  useEffect(() => {
    if (gameStates) {
      localStorage.setItem('gameState', JSON.stringify(gameStates));
    }
  }, [gameStates]);

  return (
    <div className='App text-neutral-900 dark:text-white text-center bg-neutral-100 dark:bg-neutral-900 w-full h-screen'>
      <div className='m-auto max-w-2xl flex flex-col h-full'>
        <Navbar></Navbar>
        <GameStateProvider
          gameStates={gameStates}
          getCurrentGame={getCurrentGame}
          addRound={addRound}
          addGuess={addGuess}>
          <GameServerProvider>
            <div className='px-2 flex-grow'>
              <Game></Game>
            </div>
          </GameServerProvider>
        </GameStateProvider>
        <footer className='mb-5 text-sm'>
          Enjoying Geodle?{' '}
          <a href='https://ko-fi.com/adrianhak' className='underline'>
            Buy me a ☕️
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
